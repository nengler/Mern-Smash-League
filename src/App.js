import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Standings from "./components/standings-component";
import GameList from "./functions/game-list-function";
import CreateCups from "./containers/create-cups-container";
import Player from "./components/player-component";
import CreatePlayer from "./components/create-player-component";
import Navigation from "./components/navigation-component";
import {
  HOME,
  STANDINGS,
  GAMELIST,
  CUPS,
  CREATEPLAYER,
  PLAYER,
} from "./constants/routes";

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <div className="container">
          <Route path={[HOME, STANDINGS]} exact component={Standings} />
          <Route path={GAMELIST} exact component={GameList} />
          <Route path={CUPS} component={CreateCups} />
          <Switch>
            <Route path={CREATEPLAYER} exact component={CreatePlayer} />
            <Route path={PLAYER} component={Player} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
