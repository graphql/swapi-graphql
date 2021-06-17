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
      <button type="button" onClick={() => {
          updateSearch(document.getElementById("search").value);
        }}>Search</button>
    </form>
  );
}

export default SearchBar;
