import { useQuery, gql } from "@apollo/client";
import CharacterContainer from "./CharacterContainer";
import Header from "./Header";

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

const searchCharacters = (characters, query) => {
  if (!query) {
    return characters;
  }
  return characters.filter((char) => {
    const name = char.name.toLowerCase();
    return name.includes(query.toLowerCase());
  });
};

function App() {
  const { loading, error, data } = useQuery(GET_CHARACTERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return (
    <div className="App">
      <Header searchCharacters={searchCharacters} />
      <CharacterContainer people={data.allPeople.people} />
    </div>
  );
}

export default App;
