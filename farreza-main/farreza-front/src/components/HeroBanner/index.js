import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

// Images
// import Banner from "../../assets/img/banner.jpeg";
// import Banner from "../../assets/img/coverbg.jpg";
import Banner from "../../assets/img/banner.png";
import Tear from "../../assets/img/tear.svg";

const HeroBanner = () => {
  return (
    <>
      <section className="hero-banner">
        <img src={Banner} alt="" />
        {/* <div>
          <h1>Prêts à faire du tri dans vos placards ?</h1>
          <Link to="/product/publish">
            <button>Commencer à vendre</button>
          </Link>
        </div> */}
        {/* <div>
          <img src={Tear} alt="" />
        </div> */}
      </section>

      {/* <div className="mobile-description" style={{alignItems:'center'}}>
        <h1>Prêts à faire du tri dans vos placards ?</h1>
        <Link to="/product/publish">
          <button>Commencer à vendre</button>
        </Link> */}
        {/* <p>Découvrir comment ça marche</p> */}
      {/* </div> */}
    </>
  );
};

export default HeroBanner;
