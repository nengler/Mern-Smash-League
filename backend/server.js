const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established succesfully");
});

const gamesRouter = require("./routes/games");
const playersRouter = require("./routes/players");
const cupsRouter = require("./routes/cups");

app.use("/games", gamesRouter);
app.use("/players", playersRouter);
app.use("/cups", cupsRouter);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
