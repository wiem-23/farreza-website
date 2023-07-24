import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";

// Components
import UserItem from "../../components/UserItem/index";

const User = ({ apiUrl }) => {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/${id}`);
        setUser(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [id]);

  return isLoading === true ? (
    <div className="loading">
      <Loader
        type="Oval"
        color="#5a93ce"
        height={100}
        width={100}
        timeout={99999}
      />{" "}
    </div>
  ) : (
    <>
      <section className="user-section">
        {/* <UserItem user={user} /> */}
        hello user
      </section>
    </>
  );
};

export default User;
