const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    set_wins: {
      type: Number,
      default: 0,
    },
    set_losses: {
      type: Number,
      default: 0,
    },
    map_wins: {
      type: Number,
      default: 0,
    },
    map_losses: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", playerSchema);
