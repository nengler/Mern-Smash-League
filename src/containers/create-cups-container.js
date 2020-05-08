import React, { useState, useEffect } from "react";
import CreateGame from "../components/create-game-component";
import CreateCupFunction from "../functions/create-cup-function";
import AddPlayerToCup from "../functions/add-player-to-cup-function";

function getClassName(labelName, buttonSelected) {
  let labelClassName = "not-selected-label";
  if (buttonSelected === labelName) {
    labelClassName = "selected-label";
  }
  return labelClassName;
}

function CreateCups() {
  const [buttonSelected, setButtonSelected] = useState("create-cup");
  return (
    <div>
      <div className="create-cup label-checkboxes">
        <label
          htmlFor="create-cup"
          className={getClassName("create-cup", buttonSelected)}
        >
          Create Cup
          <input
            onChange={() => setButtonSelected("create-cup")}
            type="checkbox"
            name="page-selection"
            id="create-cup"
            checked={buttonSelected === "create-cup"}
          />
        </label>
        <label
          htmlFor="add-player"
          className={getClassName("add-player", buttonSelected)}
        >
          Add player To Cup
          <input
            onChange={() => setButtonSelected("add-player")}
            type="checkbox"
            name="page-selection"
            id="add-player"
            checked={buttonSelected === "add-player"}
          />
        </label>
        <label
          htmlFor="add-game"
          className={getClassName("add-game", buttonSelected)}
        >
          Add Game To Cup
          <input
            type="checkbox"
            name="page-selection"
            id="add-game"
            checked={buttonSelected === "add-game"}
            onChange={() => setButtonSelected("add-game")}
          />
        </label>
      </div>
      {buttonSelected === "create-cup" && <CreateCupFunction />}
      {buttonSelected === "add-player" && <AddPlayerToCup />}
      {buttonSelected === "add-game" && <CreateGame />}
    </div>
  );
}

export default CreateCups;
