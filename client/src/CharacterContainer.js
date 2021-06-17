import { useQuery, gql } from "@apollo/client";

const GET_CHARACTERS = gql`
  query GetPeople {
    allPeople(first: 100) {
      people {
        name
      }
    }
  }
`;

function CharacterContainer() {
  const { loading, error, data } = useQuery(GET_CHARACTERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return data.allPeople.people.map((person) => {
    return <div key={person.name}>{person.name}</div>;
  });
}

export default CharacterContainer;
