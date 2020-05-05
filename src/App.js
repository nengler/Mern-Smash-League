import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Standings from "./components/standings-component"
import GameList from "./components/game-list-component"
import CreateGame from "./components/create-game-component"
import PlayerList from "./components/player-list-component"
import Player from "./components/player-component"
import CreatePlayer from "./components/create-player-component"

function App() {
  return (
    <div className="App">
      <Router>
      <Route path={["/", "/standings"]} exact component={Standings} />
      <Route path="/games" exact component={GameList} />
      <Route path="/games/create"  component={CreateGame} />
      <Route path="/players/" exact component={PlayerList} />
      <Route path="/players/:id" component={Player} />
      <Route path="/player/create" exact component={CreatePlayer} />
      </Router>
    </div>
  );
}

export default App;
