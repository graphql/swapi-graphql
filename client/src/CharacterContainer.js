import styled from "styled-components";
import CharacterCard from "./CharacterCard";

const StyledCardContainer = styled.div`
  position: absolute;
  height: 600px;
  width: 80%;
  margin: 75px 10% 0 10%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
`;

function CharacterContainer({ people }) {
  return (
    <StyledCardContainer>
      {people.map((person) => {
        return <CharacterCard person={person} key={person.name} />;
      })}
    </StyledCardContainer>
  );
}

export default CharacterContainer;
