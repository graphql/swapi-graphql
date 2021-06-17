import { useQuery, gql } from "@apollo/client";

const GET_CHARACTERS = gql`
  query GetPeople {
    allPeople {
      people {
        name
        birthYear
        gender
        homeworld {
          name
        }
        species {
          name
        }
      }
    }
  }
`;

function CharacterContainer() {
  const { loading, error, data } = useQuery(GET_CHARACTERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  console.log(data);
  return data.allPeople.people.map((person) => {
    return (
      <div>
        <p>Name: {person.name}</p>
        <p>Birth Year: {person.birthYear}</p>
        <p>Gender: {person.gender}</p>
        <p>Home World: {person.homeworld === null ? 'UNKNOWN': person.homeworld.name}</p>
        <p>Species: {person.species === null ? 'UNKNOWN': person.species.name}</p>
        <br/>
      </div>
    );
  });
}

export default CharacterContainer;
