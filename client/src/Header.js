import styled from 'styled-components';
import SearchBar from "./SearchBar";

const StyledHeader = styled.div`
  height: 60px;
  border-bottom: 2px solid;
  text-align: center;
`;

const StyledTitle = styled.span`
  font-weight: 600;
  font-family: Helvetica;
  font-size: 20px;
`;

function Header({ updateSearch }) {
  return (
    <StyledHeader>
      <StyledTitle>Star Wars Characters</StyledTitle>
      <SearchBar updateSearch={updateSearch} />
    </StyledHeader>
  );
}

export default Header;
