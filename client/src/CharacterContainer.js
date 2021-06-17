import CharacterCard from "./CharacterCard";

function CharacterContainer({ people }) {
  return people.map((person) => {
    return <CharacterCard person={person} key={person.name} />;
  });
}

export default CharacterContainer;
