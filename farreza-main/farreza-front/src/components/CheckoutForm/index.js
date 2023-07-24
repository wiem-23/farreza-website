import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutForm = ({ apiUrl, routeName, docId, price, name, picture, description }) => {

  const fetchParamsData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/parameters/users`);
      console.log("fetchParamsData :", response);
      if (response?.data?.counter) {
        const ship = response?.data?.docs.find(doc => doc.key == "shipping")
        const percent = response?.data?.docs.find(doc => doc.key == "percentage")
        if (ship && ship.value) setShipping(Number(ship?.value), true);
        if (percent && percent.value) setPercentage(Number(percent?.value), true);
        console.log("shipping :", shipping);
        console.log("price :", price);
        console.log("price :", percentage);
        setTotal(routeName == "offers" ? Number(ship.value + price) : price);

      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchParamsData();
  }, [apiUrl]);
  const history = useHistory();
  // const stripe = useStripe();
  // const elements = useElements();
  const [success, setSuccess] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [adress, setAdress] = useState("");
  const [phone, setPhone] = useState("");
  const [shipping, setShipping] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [total, setTotal] = useState(0);


  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      if (!buyerName || !routeName || !docId || !phone || !zipCode || !city || !adress) {
        toast.info("Merci de remplir tous les champs.", {
          position: toast.POSITION.TOP_CENTER
        })
        return
      }
      const body = {
        productId: docId,
        type: routeName,
        buyerName,
        zipCode,
        buyerPhone: phone,
        city,
        adress
      }
      const response = await axios.post(`${apiUrl}/orders/publish`, body);
      if (response.data.status === "succeeded") {
        setSuccess(true);
        toast.success("Votre commande est en cours ! Veuillez ajouter une transaction.", {
          position: toast.POSITION.TOP_CENTER
        });

        history.push("/transactions/publish");
      }
    } catch (error) {
      toast.error("Quelque chose s'est mal passé.", {
        position: toast.POSITION.TOP_CENTER
      });
      console.log(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <fieldset>
          <div>
            <p className="title">Commande</p>
            <div className="order">
              <div>
                <div>
                  <img src={apiUrl + '/documents/' + picture} alt="" />
                </div>
                <div>
                  <p>{name}</p>
                  {description ?
                    <p className="order-description">{description}</p>
                    : null}
                </div>
              </div>
              <div>
                {/* <p>{price} TND</p> */}
                <p>{total} TND</p>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset style={{ flexFlow: 'wrap' }}>
          <div>
            <input type="text" placeholder="Nom complet" onChange={(ev) => setBuyerName(ev.target.value)} value={buyerName} />
            <input type="text" placeholder="Numéro de téléphone" onChange={(ev) => setPhone(ev.target.value)} value={phone} />
          </div>
          <div>
            <input type="text" placeholder="Code postal" onChange={(ev) => setZipCode(ev.target.value)} value={zipCode} />
            <input type="text" placeholder="Ville" onChange={(ev) => setCity(ev.target.value)} value={city} />
          </div>
          <div style={{ 'width': '100%' }}>
            <input style={{ 'width': '100%' }} type="text" placeholder="Adresse" onChange={(ev) => setAdress(ev.target.value)} value={adress} />
          </div>
        </fieldset>
      </div>
      <div>
        <fieldset className="fieldset-resume">
          <div className="resume">
            <p>Résumé de la commande</p>
            <div>
              <p>Prix du produit</p>
              {/* <p>{price} TND</p> */}
              <p>{price} TND</p>
            </div>
            {routeName == "offers" ? (
              <>
                <div>
                  <p>Frais de livraison</p>
                  <p>{shipping} TND</p>
                </div>
              </>
            ) : null}
          </div>
          <div className="checkout">
            <div>
              <p>Total</p>
              <p>{total} TND</p>
            </div>
            <div>
              <button type="submit">Valider</button>
              <div className="secure-paiement">
                {routeName == "offers" ?
                  <>
                    <FontAwesomeIcon icon={faShieldAlt} />
                    <p>Paiement à la livraison.</p>
                  </>
                  : null}
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </form>
  );
};

export default CheckoutForm;
