import { useQuery, gql } from "@apollo/client";
import CharacterCard from "./CharacterCard";

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

  return data.allPeople.people.map((person) => {
    return <CharacterCard person={person} key={person.name} />
  });
}

export default CharacterContainer;
