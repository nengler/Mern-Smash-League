const router = require("express").Router();
let Game = require("../models/game.model");
let Player = require("../models/player.model");

router.route("/").get((req, res) => {
  Game.find()
    .then((games) => res.json(games))
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/add").post((req, res) => {
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

  newGame
    .save()
    .then(() => {
      Player.findOneAndUpdate(
        { username: winner },
        { $inc: { set_wins: 1, map_wins: map_wins, map_losses: map_losses } }
      )
        .then(() => {
          Player.findOneAndUpdate(
            { username: loser },
            {
              $inc: {
                set_losses: 1,
                map_wins: map_losses,
                map_losses: map_wins,
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
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/:id").get((req, res) => {
  Game.findById(req.params.id)
    .then((game) => res.json(game))
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/:id").delete((req, res) => {
  Game.findByIdAndDelete(req.params.id)
    .then(() => res.json("Game Deleted"))
    .catch((err) => res.status(400).json("Error:" + err));
});

router.route("/update/:id").post((req, res) => {
  Game.findById(req.params.id)
    .then((game) => {
      game.winner = req.body.winner;
      game.loser = req.body.loser;
      game.map_wins = req.body.map_wins;
      game.map_losses = req.body.map_losses;
      game
        .save()
        .then(() => res.json("Game updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

module.exports = router;
