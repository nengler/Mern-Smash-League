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

router.route("/").get((req, res) => {
  arrayOfCupsPlayersSorted = new Array();
  Cup.find()
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

  const newCup = new Cup({
    cup_name,
  });

  newCup
    .save()
    .then(() => {
      res.json("Cup added!");
    })
    .catch((err) => {
      console.log(err);
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

router.route("/add/player/:id").post((req, res) => {
  const username = req.body.username;

  const newPlayer = new Player({ username });

  Cup.findOneAndUpdate(
    { cup_name: req.params.id },
    { $push: { players: newPlayer } }
  ).then(() => res.json("player added"));
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
