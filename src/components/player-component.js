import React, { Component } from "react";
import { APIROUTE } from "../constants/routes";
import axios from "axios";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerInfo: {},
      games: [],
    };
  }

  componentDidMount() {
    axios
      .get(APIROUTE + "players/" + this.props.match.params.id)
      .then((res) => {
        this.setState({ playerInfo: res.data.player, games: res.data.games });
      });
  }

  getClassBasedOnGameOutcome = (winner) => {
    let tableRowClassName = "lost-game";
    if (winner === this.props.match.params.id) {
      tableRowClassName = "won-game";
    }
    return tableRowClassName;
  };

  formatDate = (date) => {
    let formattedDatePlayed = new Date(date);
    return (
      formattedDatePlayed.getMonth() +
      1 +
      "/" +
      formattedDatePlayed.getDay() +
      "/" +
      formattedDatePlayed.getFullYear()
    );
  };

  render() {
    return (
      <div>
        <h1 className="player-name">{this.props.match.params.id}</h1>
        <h2 className="player-header">Overall</h2>
        <table className="standings-table">
          <thead>
            <tr>
              <th width="33%">Sets Won</th>
              <th width="33%">Sets Lost</th>
              <th width="33%">Map Record</th>
            </tr>
          </thead>
          <tbody className="player-table-row">
            <tr>
              <td>{this.state.playerInfo.set_wins}</td>
              <td>{this.state.playerInfo.set_losses}</td>
              <td>
                {this.state.playerInfo.map_wins} -{" "}
                {this.state.playerInfo.map_losses}
              </td>
            </tr>
          </tbody>
        </table>
        <h2 className="player-header">Matches</h2>
        <table className="player-table">
          <thead>
            <tr>
              <th width="25%">Winner</th>
              <th width="25%">Loser</th>
              <th width="25%">Map Record</th>
              <th width="25%">Date Played</th>
            </tr>
          </thead>
          {this.state.games.map((game) => (
            <tbody className="player-table-row" key={game._id}>
              <tr className={this.getClassBasedOnGameOutcome(game.winner)}>
                <td>{game.winner}</td>
                <td>{game.loser}</td>
                <td>
                  {game.map_wins} - {game.map_losses}
                </td>
                <td>{this.formatDate(game.date_played)}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    );
  }
}

export default Player;
