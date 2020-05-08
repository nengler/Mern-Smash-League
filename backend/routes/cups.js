const router = require("express").Router();
let Game = require("../models/game.model");
let Player = require("../models/player.model");
let Cup = require("../models/cup.model");

function orderPlayersByWins(players) {
  for (let i = 0; i < players.length; i++) {
    let highestWins = players[i].wins;
    let highestWinPercentage =
      players[i].map_wins / (players[i].map_wins + players[i].map_losses);
    let highestWinsIndex = i;
    let shouldSwap = false;
    for (let j = i + 1; j < players.length; j++) {
      let iteratedPlayerWinPer =
        players[j].map_wins / (players[j].map_wins + players[j].map_losses);
      if (players[j].wins > highestWins) {
        highestWins = players[j].wins;
        highestWinsIndex = j;
        shouldSwap = true;
        highestWinPercentage = iteratedPlayerWinPer;
      } else if (
        players[j].wins === highestWins &&
        iteratedPlayerWinPer > highestWinPercentage
      ) {
        highestWinPercentage = iteratedPlayerWinPer;
        highestWinsIndex = j;
        shouldSwap = true;
      }
    }
    if (shouldSwap) {
      let temp = players[i];
      players[i] = players[highestWinsIndex];
      players[highestWinsIndex] = temp;
    }
  }
  return players;
}

router.route("/leagues").get((req, res) => {
  arrayOfCupsPlayersSorted = new Array();
  Cup.find({ type: "league" })
    .then((cups) => {
      cups.forEach((cup) => {
        let cupNameAndPlayers = new Object();
        let sortedPlayers = orderPlayersByWins(cup.players);
        cupNameAndPlayers.players = sortedPlayers;
        cupNameAndPlayers.cup_name = cup.cup_name;
        arrayOfCupsPlayersSorted.push(cupNameAndPlayers);
      });
      res.json(arrayOfCupsPlayersSorted);
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/notSorted").get((req, res) => {
  arrayOfCupsPlayersSorted = new Array();
  Cup.find()
    .then((cups) => {
      cups.forEach((cup) => {
        let cupNameAndPlayers = new Object();
        cupNameAndPlayers.players = cup.players.map((player) => {
          return player.username;
        });
        cupNameAndPlayers.cup_name = cup.cup_name;
        cupNameAndPlayers.id = cup._id;
        arrayOfCupsPlayersSorted.push(cupNameAndPlayers);
      });
      res.json(arrayOfCupsPlayersSorted);
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/add").post((req, res) => {
  const cup_name = req.body.cup_name;
  const type = req.body.type;

  const newCup = new Cup({
    cup_name,
    type,
  });

  newCup
    .save()
    .then(() => {
      res.json("Cup added!");
    })
    .catch((err) => {
      res.status(400).json("Error:" + err);
    });
});

router.route("/:id").get((req, res) => {
  Cup.findOne({ cup_name: req.params.id })
    .then((cup) => res.json(cup))
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/:id").delete((req, res) => {
  Cup.deleteOne({ cup_name: req.params.id })
    .then(() => res.json("Cup Deleted"))
    .catch((err) => res.status(400).json("Error:" + err));
});

function getAllPlayerGames(value, playerName) {
  if (value.winner === playerName || value.loser === playerName) return value;
}

router.route("/player/:id").get((req, res) => {
  Cup.find({ "players.username": req.params.id })
    .then((cups) => {
      let filteredGames = [];
      let overallPlayerStats = {
        set_wins: 0,
        set_losses: 0,
        map_wins: 0,
        map_losses: 0,
      };
      let playerStatsArray = [];
      let cupsPlayerIsIn = [];
      cups.forEach((cup) => {
        cupsPlayerIsIn.push(cup.cup_name);
        filteredGames.push(
          cup.games.filter((item) => getAllPlayerGames(item, req.params.id))
        );
        cup.players.forEach((player) => {
          if (player.username === req.params.id) {
            playerStatsArray.push(player);
            overallPlayerStats.set_wins += player.set_wins;
            overallPlayerStats.set_losses += player.set_losses;
            overallPlayerStats.map_wins += player.map_wins;
            overallPlayerStats.map_losses += player.map_losses;
          }
        });
      });
      let data = {
        filteredGames,
        playerStatsArray,
        overallPlayerStats,
        cupsPlayerIsIn,
      };
      res.json(data);
    })
    .catch((err) => res.status(400).json("ERR: " + err));
});

router.route("/add/player/:id").post((req, res) => {
  const username = req.body.username;

  const newPlayer = new Player({ username });

  Cup.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { players: newPlayer } }
  )
    .then(() => res.json("player added"))
    .catch((err) => res.status(400).json("ERR:" + err));
});

router.route("/games/get").get((req, res) => {
  console.log("init");
  Cup.find()
    .then((cups) => {
      let cupNames = [];
      let gamesSortedByCup = [];
      cups.forEach((cup) => {
        cupNames.push(cup.cup_name);
        gamesSortedByCup.push(cup.games);
      });
      let data = {
        cupNames,
        gamesSortedByCup,
      };
      res.json(data);
    })
    .catch((err) => res.status(400).json("ERR " + err));
});

router.route("/add/game/:id").post((req, res) => {
  const winner = req.body.winner;
  const loser = req.body.loser;
  const map_wins = req.body.map_wins;
  const map_losses = req.body.map_losses;
  const date_played = req.body.date_played;

  const newGame = new Game({
    winner,
    loser,
    map_wins,
    map_losses,
    date_played,
  });

  Cup.updateOne({ _id: req.params.id }, { $push: { games: newGame } })
    .then(() => {
      Cup.updateOne(
        { "players.username": winner, _id: req.params.id },
        {
          $inc: {
            "players.$.set_wins": 1,
            "players.$.map_wins": map_wins,
            "players.$.map_losses": map_losses,
          },
        }
      )
        .then(() => {
          Cup.updateOne(
            { _id: req.params.id, "players.username": loser },
            {
              $inc: {
                "players.$.set_losses": 1,
                "players.$.map_wins": map_losses,
                "players.$.map_losses": map_wins,
              },
            }
          )
            .then(() => {
              res.json("Game added!");
            })
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.json("Err " + err));
});

module.exports = router;
