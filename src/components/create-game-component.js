import React, { Component } from "react";
import axios from "axios";
import { APIROUTE } from "../constants/routes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      winner: "",
      loser: "",
      mapWins: 3,
      mapLosses: 0,
      date: new Date(),
    };
  }

  componentDidMount() {
    axios.get(APIROUTE + "players/").then((res) => {
      this.setState({
        players: res.data.map((user) => user.username),
        winner: res.data[0].username,
        loser: res.data[1].username,
      });
    });
  }

  handleDateChange = (date) => {
    this.setState({ date: date });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { winner, loser, mapWins, mapLosses, date } = this.state;
    const game = {
      winner,
      loser,
      map_wins: mapWins,
      map_losses: mapLosses,
      date_played: date,
    };
    axios
      .post(APIROUTE + "games/add", game)
      .then(() => {
        console.log("game created");
      })
      .catch((err) => console.log(err));
    console.log("clicky cliky");
  };

  render() {
    const { winner, loser, mapWins, mapLosses } = this.state;
    const isInvalid = winner === loser || mapWins === "" || mapLosses === "";
    return (
      <div>
        <h1 className="header create-game-header">Add Game Record</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="pr-1">
              <label className="select-label">Winner:</label>
              <select
                name="winner"
                value={this.state.winner}
                onChange={this.handleChange}
              >
                {this.state.players.map((player) => (
                  <option key={player} value={player}>
                    {player}
                  </option>
                ))}
              </select>
            </div>
            <div className="pl-1 pr-1">
              <label className="select-label">Loser:</label>
              <select
                name="loser"
                value={this.state.loser}
                onChange={this.handleChange}
              >
                {this.state.players.map((player) => (
                  <option key={player} value={player}>
                    {player}
                  </option>
                ))}
              </select>
            </div>
            <div className="pl-1">
              <DatePicker
                name="date"
                onChange={this.handleDateChange}
                selected={this.state.date}
              />
            </div>
          </div>
          <div className="row">
            <div className="pr-1">
              <label className="select-label">Maps Won:</label>
              <input
                type="number"
                value={this.state.mapWins}
                name="mapWins"
                onChange={this.handleChange}
              />
            </div>
            <div className="pl-1">
              <label className="select-label">Maps Lost:</label>
              <input
                type="number"
                value={this.state.mapLosses}
                name="mapLosses"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div>
            <button className="button" disabled={isInvalid}>
              Create Record
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateGame;
