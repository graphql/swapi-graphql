import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import CharacterContainer from "./CharacterContainer";
import Header from "./Header";
import FavoritesList from "./FavoritesList";

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
  let [search, updateSearch] = useState("");

  let faves = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    faves.push(window.localStorage.key(i));
  }

  let [favorites, changeFavorites] = useState(faves);
  const { loading, error, data } = useQuery(GET_CHARACTERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  let people = searchCharacters(data.allPeople.people, search);
  people = people.slice().sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const handleFavoriteChange = (addOrRemove, person) => {
    let favList = favorites.slice();
    if (addOrRemove === "add") {
      favList.push(person.name);
      changeFavorites(favList);
    } else {
      favList.splice(favList.indexOf(person.name), 1);
      changeFavorites(favList);
    }
  };

  return (
    <div className="App">
      <Header updateSearch={updateSearch} />
      <CharacterContainer
        people={people}
        handleFavoriteChange={handleFavoriteChange}
        favorites={favorites}
        changeFavorites={changeFavorites}
      />
      <FavoritesList favorites={favorites} />
    </div>
  );
}

export default App;
