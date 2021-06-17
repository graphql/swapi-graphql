import SearchBar from "./SearchBar";

function Header({ searchCharacters }) {
  return (
    <div>
      <span>Star Wars Characters</span>
      <SearchBar searchCharacters={searchCharacters} />
    </div>
  );
}

export default Header;
