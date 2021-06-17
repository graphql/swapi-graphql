import SearchBar from "./SearchBar";

function Header({ updateSearch }) {
  return (
    <div>
      <span>Star Wars Characters</span>
      <SearchBar updateSearch={updateSearch} />
    </div>
  );
}

export default Header;
