import React, { Component } from "react";
import axios from "axios";
import { APIROUTE } from "../constants/routes";

class GameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
    };
  }

  componentDidMount() {
    axios.get(APIROUTE + "games/").then((res) => {
      this.setState({ games: res.data });
    });
  }

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
        <h2 className="header">All Games</h2>
        <table className="standings-table">
          <thead>
            <tr>
              <th width="25%">Winner</th>
              <th width="25%">Loser</th>
              <th width="25%">Map Record</th>
              <th width="25%">Date</th>
            </tr>
          </thead>
          <tbody>
            {this.state.games.map((game) => (
              <tr key={game._id}>
                <td>{game.winner}</td>
                <td>{game.loser}</td>
                <td>
                  {game.map_wins} - {game.map_losses}
                </td>
                <td>{this.formatDate(game.date_played)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default GameList;
