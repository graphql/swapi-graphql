import React, { useState } from "react";
import styled from "styled-components";
import emptyStar from "./assets/empty_star.png";
import fullStar from "./assets/full_star.png";

const StyledCard = styled.div`
  position: relative;
  max-height: 300px;
  width: 20%;
  border: 2px solid;
  margin: 10px;
  padding: 5px;
`;

const StyledStar = styled.img`
  height: 50px;
  width: 50px;
  float: right;
`;

function CharacterCard({ person }) {
  const [isFavorited, toggleFavorited] = useState(false);
  if (!isFavorited && window.localStorage[person.name]) {
    toggleFavorited(true);
  }
  return (
    <StyledCard>
      <StyledStar
        alt="favorite star"
        src={
          isFavorited || window.localStorage[person.name] ? fullStar : emptyStar
        }
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
    </StyledCard>
  );
}

export default CharacterCard;
