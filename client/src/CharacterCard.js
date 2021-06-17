import React, { useState } from "react";
import emptyStar from "./assets/empty_star.png";
import fullStar from "./assets/full_star.png";

function CharacterCard({ person }) {
  const [isFavorited, toggleFavorited] = useState(false);
  if (!isFavorited && window.localStorage[person.name]) {
    toggleFavorited(true);
  }
  return (
    <div>
      <img
        alt="favorite star"
        src={isFavorited || window.localStorage[person.name] ? fullStar : emptyStar}
        onClick={() => {
          if (!isFavorited) {
            window.localStorage.setItem(person.name, person);
          } else {
            window.localStorage.removeItem(person.name);
          }
          toggleFavorited(!isFavorited);
        }}
      />
      <p>Name: {person.name}</p>
      <p>Birth Year: {person.birthYear}</p>
      <p>Gender: {person.gender}</p>
      <p>
        Home World:{" "}
        {person.homeworld === null ? "UNKNOWN" : person.homeworld.name}
      </p>
      <p>
        Species: {person.species === null ? "UNKNOWN" : person.species.name}
      </p>
      <br />
    </div>
  );
}

export default CharacterCard;
