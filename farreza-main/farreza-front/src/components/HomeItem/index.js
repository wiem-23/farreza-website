import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

const ProductItem = ({ docs, apiUrl, routeName }) => {
  return docs.map((item, index) => {
    const docId = item._id;
    return (
      <Link className="subscription" key={index} to={`/subscriptions/detail/${docId}`}>
        <div className="home-item">
          <img src={apiUrl + '/documents/' + item?.img} alt="" />
          <div className="product-price">
            <p>{item?.title}</p>
          </div>
          <div className="product-price">
            <p>{item?.price} TND</p>
          </div>
        </div>
      </Link>
    );
  });
};

export default ProductItem;
