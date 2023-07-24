import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import "./index.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = ({ setUser, setUserRole, apiUrl }) => {
  let history = useHistory();
  const location = useLocation();
  const fromPublish = location.state?.fromPublish ? true : false;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmail = (ev) => {
    setEmail(ev.target.value);
  };

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/user/login`, {
        email: email,
        password: password,
      });

      if (response.data.token && response.data.role) {
        const token = response.data.token;
        const role = response.data.role;
        setUser(token);
        setUserRole(role);
        console.log("role : ", role);
        toast.success("Connecté(e) avec succès.", {
          position: toast.POSITION.TOP_CENTER
        });
        history.push(fromPublish ? "/product/publish" : "/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Veuillez entrer des informations valides.", {
        position: toast.POSITION.TOP_CENTER
      });
      setError(error.response.data.message || error.response.data.error);
    }
  };
  return (
    <>
      <section className="login-form">
        <div className="container">
          <h2>Se connecter</h2>
          <form onSubmit={handleSubmit}>
            <input
              className={error !== "" ? "input-error" : "input-modal"}
              type="email"
              onChange={handleEmail}
              value={email}
              placeholder="Adresse email"
            />
            <input
              className={error !== "" ? "input-error" : "input-modal"}
              type="password"
              onChange={handlePassword}
              value={password}
              placeholder="Mot de passe"
            />
            <input type="submit" value="Se connecter" />
          </form>
          <div>
            <Link className="signup-text" to="/signup">
              Pas encore de compte ? Inscris-toi !
            </Link>
          </div>
          <div>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
