import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";

// Components
import ItemDetail from "../../components/ItemDetail/index";

const Item = ({ apiUrl, routeName }) => {
  const [doc, setDoc] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${routeName}/${id}`);
        if (response) {
          if (response?.data?.response) {
            setDoc(response.data.response);
          } else {
            setDoc(response.data);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, apiUrl]);

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
      <section className="offer-section">
        <ItemDetail doc={doc} apiUrl={apiUrl} routeName={routeName} />
      </section>
    </>
  );
};

export default Item;
