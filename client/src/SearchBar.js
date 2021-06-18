import styled from "styled-components";

const StyledButton = styled.button`
  background-image: linear-gradient(to bottom, #01144d, #afb3bd);
  color: white;
  border-radius: 3px;
  &:hover {
    cursor: pointer;
    background-image: linear-gradient(to top, #01144d, #afb3bd);
  }
`;

function SearchBar({ updateSearch }) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>Search: </label>
      <input
        type="text"
        placeholder="Search for a character"
        id="search"
        name="s"
        onChange={() => {
          updateSearch(document.getElementById("search").value);
        }}
      ></input>
      <StyledButton
        type="button"
        onClick={() => {
          updateSearch(document.getElementById("search").value);
        }}
      >
        Search
      </StyledButton>
    </form>
  );
}

export default SearchBar;
