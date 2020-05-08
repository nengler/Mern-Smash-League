import React, { Component } from "react";
import { APIROUTE } from "../constants/routes";
import axios from "axios";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerInfo: {},
      gamesFilteredByCup: [],
      statsFilteredByCup: [],
      cupsPlayerIsIn: [],
      cupSelectedIndex: 0,
      isDoneLoading: false,
    };
  }

  componentDidMount() {
    axios
      .get(APIROUTE + "cups/player/" + this.props.match.params.id)
      .then((res) => {
        this.setState({
          playerInfo: res.data.overallPlayerStats,
          gamesFilteredByCup: res.data.filteredGames,
          statsFilteredByCup: res.data.playerStatsArray,
          cupsPlayerIsIn: res.data.cupsPlayerIsIn,
          isDoneLoading: true,
        });
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

  getClassName = (cupIndex) => {
    let labelClassName = "not-selected-label";
    if (cupIndex === this.state.cupSelectedIndex) {
      labelClassName = "selected-label";
    }
    return labelClassName;
  };

  handleCupChange = (cupIndex) => {
    this.setState({ cupSelectedIndex: cupIndex });
  };

  render() {
    return (
      <div className="player">
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

        {this.state.isDoneLoading && (
          <div>
            <h2 className="player-header pt-2">Stats By Cup</h2>
            <div className="label-checkboxes player-checkbox">
              {this.state.cupsPlayerIsIn.map((cup, index) => (
                <label
                  htmlFor={cup}
                  key={cup}
                  className={this.getClassName(index)}
                >
                  {cup}
                  <input
                    onChange={() => this.handleCupChange(index)}
                    type="checkbox"
                    name="cup-selection"
                    id={cup}
                    checked={index === this.state.cupSelectedIndex}
                  ></input>
                </label>
              ))}
            </div>
            <div className="cup-stats">
              <div className="player-cup-stats">
                <ul className="player-cup-info">
                  <li>
                    <b>Sets Won: </b>
                    {
                      this.state.statsFilteredByCup[this.state.cupSelectedIndex]
                        .set_wins
                    }
                  </li>
                  <li>
                    <b>Sets Lost: </b>
                    {
                      this.state.statsFilteredByCup[this.state.cupSelectedIndex]
                        .set_losses
                    }
                  </li>
                  <li>
                    <b>Map Record: </b>
                    {
                      this.state.statsFilteredByCup[this.state.cupSelectedIndex]
                        .map_wins
                    }{" "}
                    -{" "}
                    {
                      this.state.statsFilteredByCup[this.state.cupSelectedIndex]
                        .map_losses
                    }
                  </li>
                </ul>
              </div>
              <div className="player-cup-games">
                <table className="standings-table player-table">
                  <thead>
                    <tr>
                      <th width="25%">Winner</th>
                      <th width="25%">Loser</th>
                      <th width="25%">Map Record</th>
                      <th width="25%">Date Played</th>
                    </tr>
                  </thead>
                  {this.state.gamesFilteredByCup[
                    this.state.cupSelectedIndex
                  ].map((game) => (
                    <tbody className="player-table-row" key={game._id}>
                      <tr
                        className={this.getClassBasedOnGameOutcome(game.winner)}
                      >
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
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Player;

/*          {this.state.games.map((game) => (
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
          ))}*/
