import React, { useState, useEffect } from "react";
import axios from "axios";
import { APIROUTE } from "../constants/routes";

function GameList() {
  let [games, setGames] = useState([]);
  let [cups, setCups] = useState([]);
  let [cupSelectedIndex, setCupSelectedIndex] = useState(0);

  function fetchData() {
    console.log("fetchin");
    axios.get(APIROUTE + "cups/games/get").then((res) => {
      setGames(res.data.gamesSortedByCup);
      setCups(res.data.cupNames);
    });
  }

  function formatDate(date) {
    let formattedDatePlayed = new Date(date);
    return (
      formattedDatePlayed.getMonth() +
      1 +
      "/" +
      formattedDatePlayed.getDay() +
      "/" +
      formattedDatePlayed.getFullYear()
    );
  }

  function getClassName(cupIndex) {
    let labelClassName = "not-selected-label";
    if (cupIndex === cupSelectedIndex) {
      labelClassName = "selected-label";
    }
    return labelClassName;
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="header">Games By Cup</h2>
      <div className="game-checkbox label-checkboxes">
        {cups.map((cup, index) => (
          <label htmlFor={cup} key={cup} className={getClassName(index)}>
            {cup}
            <input
              onChange={(e) => setCupSelectedIndex(index)}
              type="checkbox"
              name="cup-selection"
              id={cup}
              checked={index === cupSelectedIndex}
            ></input>
          </label>
        ))}
      </div>
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
          {games.length !== 0 &&
            games[cupSelectedIndex].map((game) => (
              <tr key={game._id}>
                <td>{game.winner}</td>
                <td>{game.loser}</td>
                <td>
                  {game.map_wins} - {game.map_losses}
                </td>
                <td>{formatDate(game.date_played)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default GameList;
