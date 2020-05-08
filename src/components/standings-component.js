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
    axios.get(APIROUTE + "cups/leagues").then((res) => {
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

  getClassName = (cupIndex) => {
    let labelClassName = "not-selected-label";
    if (cupIndex === this.state.cupSelectedIndex) {
      labelClassName = "selected-label";
    }
    return labelClassName;
  };

  handleChange = (index) => {
    this.setState({ cupSelectedIndex: index });
  };

  render() {
    return (
      <div>
        <h1 className="header standings-header">League Standings</h1>
        <div className="standings-checkbox label-checkboxes">
          {this.state.cupInformation.map((cup, index) => (
            <label
              htmlFor={cup.cup_name}
              key={cup.cup_name}
              className={this.getClassName(index)}
            >
              {cup.cup_name}
              <input
                onChange={() => this.handleChange(index)}
                type="checkbox"
                name="cup-selection"
                id={cup.cup_name}
                checked={index === this.state.cupSelectedIndex}
              ></input>
            </label>
          ))}
        </div>
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
/*
            
 */
