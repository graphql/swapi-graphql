import { useState } from "react";
import styled from "styled-components";

const FavoritesList = ({ favorites }) => {
  return (
    <div>
      <ul>
        {favorites.map((name) => (
          <li>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;
