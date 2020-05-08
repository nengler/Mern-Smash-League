import React, { useState } from "react";
import axios from "axios";
import { APIROUTE } from "../constants/routes";

function CreateCupFunction() {
  const [cupName, setCupName] = useState("");
  const [cupType, setCupType] = useState("league");
  const isInvalid = cupName === "";

  const handleSubmit = (event) => {
    event.preventDefault();
    const cup = {
      cup_name: cupName,
      type: cupType,
    };
    axios
      .post(APIROUTE + "cups/add", cup)
      .then(() => setCupName(""))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div>
        <h1 className="header create-cup-header">Create New Cup</h1>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="pr-1">
              <label className="select-label">Cup Name:</label>
              <input
                value={cupName}
                onChange={(e) => setCupName(e.target.value)}
              />
            </div>
            <select
              value={cupType}
              onChange={(e) => setCupType(e.target.value)}
            >
              <option value="league">League</option>
              <option value="tournament">Tournament</option>
            </select>
            <div className="pl-1">
              <button className="button" disabled={isInvalid}>
                Create Cup
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCupFunction;
