function SearchBar() {
  return (
    <form>
      <label>Search: </label>
      <input type="text" placeholder="Search for a character" id="search"></input>
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
