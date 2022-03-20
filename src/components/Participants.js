import React from "react";
import "../stylesheets/Participants.css";

function Participants({ players, room }) {
  return (
    <div className="participants-wrapper">
      <h3>{room}</h3>
      <strong>Players online: {players.length}</strong>
      <ul className="player-container">
        {players.map((player) => (
          <li className="player" key={player}>
            {player}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Participants;
