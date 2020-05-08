const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    winner: {
      type: String,
      required: true,
    },
    loser: {
      type: String,
      required: true,
    },
    map_wins: {
      type: Number,
      required: true,
    },
    map_losses: {
      type: Number,
      required: true,
    },
    date_played: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", gameSchema);
