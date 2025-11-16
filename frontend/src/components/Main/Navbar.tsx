import { Link } from 'react-router-dom';
import './Navbar.css';
import { AuthenticatedUser } from '../../types';
import logo from '../../assets/logo_web3.png'

interface NavbarProps {
  authenticatedUser: AuthenticatedUser | undefined;
  clearUser: () => void;
}

const Navbar = ({ authenticatedUser, clearUser }: NavbarProps) => {
  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='nav-links'>
          <Link to="/" className='nav-button'>HOME</Link>
          <Link to="/articles" className='nav-button'>ALL ARTICLES</Link>
        </div>
        
        <img src={logo} alt="Logo" className="nav-logo" />
        
        <div className='nav-links'>
          {!authenticatedUser ? (
            <Link to="/login" className='nav-button'>LOGIN</Link>
          ) : (
            <button onClick={clearUser} className='nav-button logout-btn'>
              LOGOUT ({authenticatedUser.username})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;