import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { HOME, GAMELIST, CREATEGAME, CREATEPLAYER } from "../constants/routes";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSandwichOpen: false,
    };
  }

  handleSandwichClick = () => {
    this.setState((prevState) => ({
      isSandwichOpen: !prevState.isSandwichOpen,
    }));
  };

  handleSandwichNavLinkClick = () => {
    this.setState({ isSandwichOpen: false });
  };

  render() {
    return (
      <div className="nav">
        <div className="nav-big">
          <NavLink
            exact
            to={HOME}
            className="nav-item"
            activeClassName="active-nav-item"
          >
            Home
          </NavLink>
          <NavLink
            exact
            to={GAMELIST}
            className="nav-item"
            activeClassName="active-nav-item"
          >
            Games
          </NavLink>
          <NavLink
            exact
            to={CREATEGAME}
            className="nav-item"
            activeClassName="active-nav-item"
          >
            Create Game
          </NavLink>
          <NavLink
            exact
            to={CREATEPLAYER}
            className="nav-item"
            activeClassName="active-nav-item"
          >
            Create Player
          </NavLink>
        </div>
        <div className="nav-small">
          <button
            className="button nav-button"
            onClick={() => this.handleSandwichClick()}
          >
            Menu
          </button>
          {this.state.isSandwichOpen && (
            <div className="open-sandwich">
              <ul>
                <li>
                  <NavLink
                    exact
                    to={HOME}
                    className="nav-item"
                    activeClassName="active-nav-item"
                    onClick={() => this.handleSandwichNavLinkClick()}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    to={GAMELIST}
                    className="nav-item"
                    activeClassName="active-nav-item"
                    onClick={() => this.handleSandwichNavLinkClick()}
                  >
                    Games
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    to={CREATEGAME}
                    className="nav-item"
                    activeClassName="active-nav-item"
                    onClick={() => this.handleSandwichNavLinkClick()}
                  >
                    Create Game
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    to={CREATEPLAYER}
                    className="nav-item"
                    activeClassName="active-nav-item"
                    onClick={() => this.handleSandwichNavLinkClick()}
                  >
                    Create Player
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Navigation;
