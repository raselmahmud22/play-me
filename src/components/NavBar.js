import {
  BsFillPlayCircleFill,
  BsHouse,
  BsSearch,
  BsStar,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
function NavBar() {
  return (
    <nav className="ms-md-0 ms-lg-0 ms-5">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className={`nav-link ${styles.NavLink}`} to="/">
              <BsHouse className="me-2" />
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={`nav-link ${styles.NavLink}`} to="favorites">
              <BsStar className="me-2" />
              Favorites
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={`nav-link ${styles.NavLink}`} to="playlist">
              <BsFillPlayCircleFill className="me-2" />
              Playlist
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={`nav-link ${styles.NavLink} ${styles.active}`} to="search">
              <BsSearch className="me-2" />
              Search
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
