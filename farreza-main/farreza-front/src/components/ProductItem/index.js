import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

const ProductItem = ({ offers, apiUrl }) => {
  return offers.map((item, index) => {
    const offerId = item._id;
    return (
      <Link className="home-product" key={index} to={`/offer/${offerId}`}>
        <div className="home-product-item">
          <div>
            {/* {item.owner.account.avatar && (
              <img src={item.owner.account.avatar.url} alt="" />
            )} */}
            {/* <p>{item.owner.account.username}</p> */}
          </div>
          <img src={apiUrl + '/documents/' + item?.img} alt="" />
          <div className="product-price">
            <p>{item.product_price} TND</p>
          </div>
          <p>{item?.category?.title}</p>
          <p>{item.product_details[1].TAILLE}</p>
          <p>{item.product_details[0].MARQUE}</p>
          <p>{item?.category?.title}</p>
        </div>
      </Link>
    );
  });
};

export default ProductItem;
