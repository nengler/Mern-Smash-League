import React, { Component } from "react";
import axios from "axios";
import { APIROUTE } from "../constants/routes";

class Standings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cupInformation: [],
      cupSelectedIndex: 0,
    };
  }

  componentDidMount() {
    axios.get(APIROUTE + "cups").then((res) => {
      this.setState({
        cupInformation: res.data,
      });
    });
  }

  handlePlayerRouting = (playerName) => {
    this.props.history.push("/players/" + playerName);
  };

  changeCup = (newCupIndex) => {
    this.setState({ cupSelectedIndex: newCupIndex });
    console.log(this.state.cupInformation[this.state.cupSelectedIndex].players);
  };

  render() {
    return (
      <div>
        <div className="cups">
          {this.state.cupInformation.map((cup, index) => (
            <button
              className="button"
              key={cup.cup_name}
              onClick={() => this.changeCup(index)}
            >
              {cup.cup_name}
            </button>
          ))}
        </div>
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
            {this.state.cupInformation.length !== 0 &&
              this.state.cupInformation[
                this.state.cupSelectedIndex
              ].players.map((player, index) => (
                <tr
                  key={player._id}
                  onClick={() => this.handlePlayerRouting(player.username)}
                >
                  <td>{index}</td>
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
/*
            
 */
