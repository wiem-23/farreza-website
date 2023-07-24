import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { useHistory } from "react-router-dom";

// Components
import SearchBar from "../SearchBar";

// Icons & Images
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "../useRouter";
import Logo from "../../assets/img/logo.png";

const DashboardButtonStyle = { 'backgroundColor': 'black', 'color': "white" }
const PublishButtonStyle = { 'marginRight': '10px' }

const Header = ({ setUser, token, apiUrl, setMobileMenu, mobileMenu, setFilter, setCategoryFilter, categories }) => {
  let history = useHistory();

  const handleMobile = () => {
    if (mobileMenu) {
      setMobileMenu(false);
    } else {
      setMobileMenu(true);
    }
  };

  const handleClick = () => {
    setUser(null);
  };

  const asPath = useRouter(); // asPath or whatever from the router

  const handleCategory = async (ev) => {
    console.log("category :", ev);
    if (!ev) {
      setParentChildren([])
    } else {
      const foundParent = categories.find(x => x._id == ev && x.children?.length)
      if (foundParent) {
        setParentChildren(foundParent.children)
      }
    }
    setCategoryFilter(ev)
    if (asPath.pathname !== "/search") {
      history.push("/search")
    }
  }

  useEffect(() => {
  }, [asPath]);

  const [parentChildren, setParentChildren] = useState()

  const location = useLocation();
  return (
    <>
      <header>
        <div className="container">
          <div>
            <Link to="/" style={{ "textDecoration": "unset" }}>
              <img src={Logo} alt="logo" />
              {/* <p style={{
                "fontSize": "xx-large",
                "fontWeight": "bold",
                "paddingRight": "30px",
                "color": "black"
              }}>Farreza</p> */}
            </Link>
            {categories?.length && ["/", "/search"].includes(asPath.pathname) && !mobileMenu ? (
              <SearchBar setFilter={setFilter} />
            ) : null}
          </div>
          <div>
            {token ? (
              <div className="logout" onClick={handleClick}>
                Déconnexion
              </div>
            ) : (
              <Link to="/login" className="login-signup">
                S'inscrire | Se Connecter
              </Link>
            )}

            {/* <Link to={"/product/publish"}>
              <button style={PublishButtonStyle}>Vends tes articles</button>
            </Link> */}
            {token ? (
              <Link className="login-signup" to="/dashboard">
                <FontAwesomeIcon icon="bars" />
              </Link>) : null}
          </div>
          <FontAwesomeIcon
            onClick={handleMobile}
            className="menu-mobile"
            icon={mobileMenu ? "times" : "bars"}
          />
        </div>
        {categories?.length && ["/", "/search"].includes(asPath.pathname) && !mobileMenu ? (
          <ul className="sub-menu">
            <li className="sub-menu-item" onClick={() => handleCategory("")}>Voir tout</li>
            {categories.map((categ, i) => (
              <li key={"sub-menu-item" + i} className="sub-menu-item" onClick={() => handleCategory(categ._id)}>{categ?.title}</li>
            ))}
            {/* <li className="sub-menu-item" onClick={() => history.push("search")}>Boutique</li> */}
          </ul>
        )
          : null}
        {categories?.length && parentChildren?.length && ["/", "/search"].includes(asPath.pathname) && !mobileMenu ? (
          <ul className="sub-menu">
            {parentChildren.filter(x => x._id).map((categ, i) => (
              <li key={"sub-menu-item" + i} className="sub-menu-item" onClick={() => handleCategory(categ._id)}>{categ?.title}</li>
            ))}
          </ul>
        )
          : null}
      </header>
    </>
  );
};

export default Header;
