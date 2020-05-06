import React, { Component } from "react";
import axios from "axios";
import { APIROUTE } from "../constants/routes";

class CreatePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {
    const { username } = this.state;
    const user = {
      username,
    };
    axios.post(APIROUTE + "players/add", user).then(() => {
      console.log("player created");
      this.setState({ username: "" });
    });
  };

  render() {
    const { username } = this.state;
    const isInvalid = username === "";
    return (
      <div>
        <h1 className="header create-player-header">Create New Player</h1>
        <div className="row">
          <div className="pr-1">
            <label className="select-label">Username:</label>
            <input
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </div>
          <div className="pl-1">
            <button
              className="button"
              disabled={isInvalid}
              onClick={() => this.handleSubmit()}
            >
              Create Player
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatePlayer;
