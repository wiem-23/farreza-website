import React from "react";
import { Link } from "react-router-dom";

import "./index.css";

const DashboardButtonStyle = { 'backgroundColor': 'black', 'color': "white", 'border': '1px solid', borderColor: 'black' }
const PublishButtonStyle = { 'marginBottom': '20px' }

const MobileMenu = ({ token, setMobileMenu, setUser }) => {
  const handleClick = () => {
    setMobileMenu(false);
    setUser(null);
  };

  const handleMenu = () => {
    setMobileMenu(false);
  };

  return (
    <>
      <section className="mobile-menu">
        <div className="container">
          <div>
            {token ? (
              <div className="logout" onClick={handleClick}>
                Déconnexion
              </div>
            ) : (
              <Link to="/login" onClick={handleMenu}>
                <div className="login-btn">S'inscrire | Se Connecter</div>
              </Link>
            )}

            {/* <Link to="/product/publish" onClick={handleMenu}>
              <button style={PublishButtonStyle}>Vends tes articles</button>
            </Link> */}

            {token ? (
              <Link to="/dashboard" onClick={handleMenu}>
                <div className="login-signup">Dashbord</div>
              </Link>) : null}
          </div>
        </div>
      </section>
    </>
  );
};

export default MobileMenu;
