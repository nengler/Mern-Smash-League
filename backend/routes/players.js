const router = require("express").Router();
let Player = require("../models/player.model");
let Game = require("../models/game.model");

router.route("/").get((req, res) => {
  Player.find()
    .then((players) => {
      res.json(players);
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;

  const newPlayer = new Player({ username });

  Player.exists({ username: username })
    .then((res) => {
      if (res === false) {
        newPlayer
          .save()
          .then(() => res.json("Player added!"))
          .catch((err) => res.status(400).json("Error: " + err));
      } else {
        res.status(400).json("Duplicate Player:");
      }
    })
    .catch((err) => res.status(400).json("Error " + err));
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
