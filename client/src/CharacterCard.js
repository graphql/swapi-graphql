import emptyStar from "./assets/empty_star.png";
import fullStar from "./assets/full_star.png";

function CharacterCard({person}) {
  return (
    <div>
      <img src={emptyStar} alt="empty star" />
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
