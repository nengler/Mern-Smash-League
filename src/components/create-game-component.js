import React, { Component } from "react";
import axios from "axios";
import { APIROUTE } from "../constants/routes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cups: [],
      cupSelected: "",
      players: [],
      winner: "",
      loser: "",
      mapWins: 3,
      mapLosses: 0,
      date: new Date(),
    };
  }

  componentDidMount() {
    axios
      .get(APIROUTE + "cups/notSorted")
      .then((res) => {
        let cups = [];
        let players = [];
        res.data.forEach((info) => {
          players.push(info.players);
          let cupObject = {
            cupName: info.cup_name,
            id: info.id,
          };
          cups.push(cupObject);
        });
        console.log(players);
        this.setState({
          cups,
          players,
          cupSelected: res.data[0].cup_name,
          winner: players[0][0],
          loser: players[0][1],
        });
      })
      .catch((err) => console.log(err));
  }

  handleDateChange = (date) => {
    this.setState({ date: date });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCupChange = (event) => {
    let cupIndex = -1;
    this.setState({ [event.target.name]: event.target.value });
    this.state.cups.forEach((cup, index) => {
      if (cup.cupName === event.target.value) {
        cupIndex = index;
      }
    });
    console.log(cupIndex);
    this.setState({
      winner: this.state.players[cupIndex][0],
      loser: this.state.players[cupIndex][1],
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { winner, loser, mapWins, mapLosses, date, cupSelected } = this.state;
    const game = {
      winner,
      loser,
      map_wins: mapWins,
      map_losses: mapLosses,
      date_played: date,
    };
    let id = 0;
    this.state.cups.forEach((cup, index) => {
      if (cup.cupName === this.state.cupSelected) {
        id = cup.id;
      }
    });
    axios
      .post(APIROUTE + "cups/add/game/" + id, game)
      .then(() => {
        console.log("game created");
      })
      .catch((err) => console.log(err));
    console.log("clicky cliky");
  };

  render() {
    const { winner, loser, mapWins, mapLosses } = this.state;
    const isInvalid = winner === loser || mapWins === "" || mapLosses === "";
    let cupSelectedIndex = 0;
    this.state.cups.forEach((cup, index) => {
      if (cup.cupName === this.state.cupSelected) {
        cupSelectedIndex = index;
      }
    });
    return (
      <div>
        <h1 className="header create-cup-header">Add Game Record</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <select
              name="cupSelected"
              value={this.state.cupSelected}
              onChange={this.handleCupChange}
            >
              {this.state.cups.map((cup) => (
                <option key={cup.cupName} value={cup.cupName}>
                  {cup.cupName}
                </option>
              ))}
            </select>
          </div>
          <div className="row">
            <div className="pr-1">
              <label className="select-label">Winner:</label>
              <select
                name="winner"
                value={this.state.winner}
                onChange={this.handleChange}
              >
                {this.state.players.length !== 0 &&
                  this.state.players[cupSelectedIndex].map((player) => (
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
                {this.state.players.length !== 0 &&
                  this.state.players[cupSelectedIndex].map((player) => (
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
