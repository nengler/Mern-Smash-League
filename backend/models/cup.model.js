const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GameSchema = require("./game.model").schema;
let PlayerSchema = require("./player.model").schema;

const cupSchema = new Schema(
  {
    cup_name: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    winner: {
      type: String,
    },
    players: {
      type: [PlayerSchema],
    },
    games: {
      type: [GameSchema],
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cup = mongoose.model("Cup", cupSchema);

module.exports = Cup;
