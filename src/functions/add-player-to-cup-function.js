import React, { useState, useEffect } from "react";
import axios from "axios";
import { APIROUTE } from "../constants/routes";

function AddPlayerToCup() {
  const [cups, setCups] = useState([]);
  const [cupSelected, setCupSelected] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerSelected, setPlayerSelected] = useState("");
  const [playersAvailableToAdd, setplayersAvailableToAdd] = useState([]);

  async function fetchPlayers() {
    axios.get(APIROUTE + "players").then((res) => {
      setPlayers(
        res.data.map((player) => {
          return player.username;
        })
      );
    });
  }

  async function fetchCups() {
    console.log("init");
    axios.get(APIROUTE + "cups/notSorted").then((res) => {
      console.log(res);
      setCups(res.data);
      if (cupSelected === "") {
        setCupSelected(res.data[0].cup_name);
      }
    });
  }

  function getPlayersNotInCup() {
    console.log("called");
    let cupIndex = -1;
    cups.forEach((cup, index) => {
      if (cup.cup_name === cupSelected) {
        cupIndex = index;
        return;
      }
    });
    if (cupIndex !== -1) {
      let playersInCup = cups[cupIndex].players;
      let playersAllowedToJoinCup = [];
      players.forEach((player) => {
        if (playersInCup.indexOf(player) === -1) {
          playersAllowedToJoinCup.push(player);
        }
      });
      setplayersAvailableToAdd(playersAllowedToJoinCup);
      let firstPlayerSelected = playersAllowedToJoinCup[0];
      if (firstPlayerSelected === undefined) {
        firstPlayerSelected = "";
      }
      setPlayerSelected(firstPlayerSelected);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let player = { username: players[players.indexOf(playerSelected)] };
    let cupId = null;
    cups.forEach((cup, index) => {
      if (cup.cup_name === cupSelected) {
        cupId = cup.id;
        return;
      }
    });
    axios
      .post(APIROUTE + "cups/add/player/" + cupId, player)
      .then((res) => fetchCups())
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchPlayers();
    fetchCups();
  }, []);

  useEffect(() => {
    getPlayersNotInCup();
  }, [cups, cupSelected]);

  const isDisabled = playerSelected === "";

  return (
    <div>
      <h1 className="header create-cup-header">Add Player</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="pr-1">
            <label>Cup</label>
            <select
              value={cupSelected}
              onChange={(e) => setCupSelected(e.target.value)}
            >
              {cups.map((cup) => (
                <option key={cup.cup_name} value={cup.cup_name}>
                  {cup.cup_name}
                </option>
              ))}
            </select>
          </div>
          <div className="pl-1">
            <label>Player</label>

            <select
              value={playerSelected}
              onChange={(e) => setPlayerSelected(e.target.value)}
            >
              {playersAvailableToAdd.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button disabled={isDisabled} className="button">
          Add Player
        </button>
      </form>
    </div>
  );
}

export default AddPlayerToCup;
