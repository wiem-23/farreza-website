import React, { useEffect, useState } from "react";
import { Redirect, useParams, useLocation } from "react-router-dom";
import "./index.css";
import Loader from "react-loader-spinner";

// Components
import CheckoutForm from "../../components/CheckoutForm/index";
import axios from "axios";

// Public key Stripe
// const stripePromise = loadStripe("pk_test_CieWhqtX2Xf0XCCjZoguJXCW00qWycdip1");

const Payment = ({ apiUrl }) => {
  const location = useLocation();

  const [doc, setDoc] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { routeName, id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("id :", id, apiUrl);
        const response = await axios.get(`${apiUrl}/${routeName}/${id}`);
        if (response?.data?.response) {
          setDoc(response?.data?.response);
        } else {
          setDoc(response.data);
        }
        console.log("doc : ", response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="payment">
      {location.state ?
        isLoading === true ? (
          <div className="loading">
            <Loader
              type="Oval"
              color="#5a93ce"
              height={100}
              width={100}
              timeout={99999}
            />{" "}
          </div>
        ) : (<>
          <CheckoutForm
            apiUrl={apiUrl}
            routeName={routeName}
            docId={doc?._id}
            price={doc?.product_price || doc?.price}
            name={doc?.product_name || doc?.title}
            description={doc?.product_description || doc?.description}
            picture={doc?.img}
          />

        </>
        ) : (
          <Redirect to="/" />
        )}
    </section>
  );
};

export default Payment;
