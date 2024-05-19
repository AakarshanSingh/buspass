import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Loader } from './';
import Logo from '../assets/logo.png';

const Header = styled.nav`
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  padding: 0 5%;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  overflow: hidden;
  position: sticky;
  top: 0;
`;

const NavImage = styled.img`
  height: 20px;
`;

const NavLogo = styled(Link)`
  font-size: 1.5rem;
  margin: 1rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
`;

const Hamburger = styled.div`
  display: none;
  position: absolute;
  top: 0.75rem;
  right: 0.5rem;
  flex-direction: column;
  justify-content: space-between;
  width: 2.25rem;
  height: 2rem;
  cursor: pointer;

  @media (max-width: 480px) {
    display: flex;
  }
`;

const HamburgerLines = styled.span`
  height: 0.4rem;
  width: 100%;
  background-color: black;
  border-radius: 0.2rem;
`;

const NavList = styled.ul`
  display: flex;

  @media (max-width: 480px) {
    display: none;
    flex-direction: column;
    width: 100%;
    margin-top: 60px;
    margin-right: 30%;
    ${(props) => (props.isOpen ? 'display: flex;' : '')}
  }
`;

const NavItem = styled.li`
  list-style: none;

  @media (max-width: 480px) {
    width: 100%;
    text-align: center;
  }
`;

const NavLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: black;
  padding: 0.5rem;
  margin: 0 0.5rem;
  border-radius: 0.5rem;

  &.active {
    background-color: yellow;
  }
`;

const UserProfile = styled.div`
  display: flex;
  gap: 10px;
`;

const ProfileImage = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50px;
  object-fit: contain;
`;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { authUser, logoutUser, loading } = useAppContext();

  return (
    <Header>
      <NavLogo to="/">
        <NavImage src={Logo} />
      </NavLogo>
      <Hamburger onClick={() => setMenuOpen(!menuOpen)}>
        <HamburgerLines />
        <HamburgerLines />
        <HamburgerLines />
      </Hamburger>
      <NavList isOpen={menuOpen}>
        {/* <NavItem>
          {authUser && <ProfileImage src={authUser?.userDetails?.photo} />}
        </NavItem> */}
        <NavItem>
          {authUser ? (
            <NavLink to="/dashboard">
              <UserProfile>
                <ProfileImage src={authUser?.userDetails?.photo} />
                {`Hello, ${authUser?.userDetails?.name}`}
              </UserProfile>
            </NavLink>
          ) : (
            <NavLink to="/about">About</NavLink>
          )}
        </NavItem>
        <NavItem>
          <NavLink to="/services">Services</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/contact">Contact</NavLink>
        </NavItem>
        <NavItem>
          {authUser ? (
            loading ? (
              <Loader />
            ) : (
              <NavLink onClick={logoutUser} to="/">
                Logout
              </NavLink>
            )
          ) : (
            <NavLink to="/auth">Login</NavLink>
          )}
        </NavItem>
      </NavList>
    </Header>
  );
};

export default Navbar;
