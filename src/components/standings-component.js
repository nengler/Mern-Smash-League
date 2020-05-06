import React, { Component } from "react";
import axios from "axios";
import { APIROUTE } from "../constants/routes";

class Standings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
    };
  }

  componentDidMount() {
    axios.get(APIROUTE + "players").then((res) => {
      this.setState({ players: res.data });
    });
  }

  handlePlayerRouting = (playerName) => {
    this.props.history.push("/players/" + playerName);
  };

  render() {
    return (
      <div>
        <h1 className="header">Standings</h1>
        <table className="standings-table">
          <thead>
            <tr>
              <th>Place</th>
              <th>Name</th>
              <th>Sets Won</th>
              <th>Sets Lost</th>
              <th>Map Record</th>
            </tr>
          </thead>
          <tbody>
            {this.state.players.map((player, index) => (
              <tr
                key={player._id}
                onClick={() => this.handlePlayerRouting(player.username)}
                className="table-body"
              >
                <td>{index + 1}</td>
                <td>{player.username}</td>
                <td>{player.set_wins}</td>
                <td>{player.set_losses}</td>
                <td>
                  {player.map_wins} - {player.map_losses}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Standings;
