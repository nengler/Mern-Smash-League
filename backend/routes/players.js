const router = require("express").Router();
let Player = require("../models/player.model");
let Game = require("../models/game.model");

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
  Player.find()
    .then((players) => {
      players = orderPlayersByWins(players);
      res.json(players);
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;

  const newPlayer = new Player({ username });

  newPlayer
    .save()
    .then(() => res.json("Player added!"))
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/:id").get((req, res) => {
  Player.findOne({ username: req.params.id })
    .then((player) => {
      if (player != null) {
        Game.find()
          .or([{ winner: player.username }, { loser: player.username }])
          .then((games) => res.json({ player: player, games: games }))
          .catch((err) => res.status(400).json("Error:" + err));
      } else {
        res.json("Player does not exist");
      }
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/:id").delete((req, res) => {
  Player.deleteOne({ username: req.params.id })
    .then(() => res.json("Player Deleted"))
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/update/:id").post((req, res) => {
  Player.findOne({ username: req.params.id })
    .then((player) => {
      player.username = req.body.username;
      player
        .save()
        .then(() => res.json("Player updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

module.exports = router;
