import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./index.css";
import GoBackComponent from '../../../../components/backLink/index'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const GenericPublish = ({
  token,
  apiUrl,
  routeName,
  label,
  pricing,
  describing,
}) => {
  let history = useHistory();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const handleTitle = (ev) => {
    setTitle(ev.target.value);
  };
  const handlePrice = (ev) => {
    setPrice(ev.target.value);
  };
  const handleDescription = (ev) => {
    setDescription(ev.target.value);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const result = await axios.post(`${apiUrl}/${routeName}/publish`, { title, description, price: price ? Number(price) : null });
      toast.success("Ajouté(e) avec succès.", {
        position: toast.POSITION.TOP_CENTER
      });
      console.log("result :", result);
      if (result && result.data && result.data.response && result.data.response._id) {
        history.push(`edit/${result.data.response._id}`);
      } else {
        toast.error("Quelque chose s'est mal passé.", {
          position: toast.POSITION.TOP_CENTER
        });
        console.error("something went wrong", result);
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  return  (
    <>
      <section className="publish-section">
        <div>
          <GoBackComponent />
          <h2>votre commande est validée et la livraison se fera dans un délai maximum de 3 jours.</h2>
          
        </div>
      </section>
    </>
  
  )
};

export default GenericPublish;