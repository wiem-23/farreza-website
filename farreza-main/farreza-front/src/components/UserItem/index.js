import React from "react";
import { useHistory } from "react-router-dom";
import "./index.css";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserItem = ({ user }) => {
  let history = useHistory();

  return (
    <>
      <div className="user-product">
        {user.product_pictures.length === 0 ? (
          <div className="one-picture">
            <img src={user.img} alt="" />
          </div>
        ) : user.product_pictures.length === 1 ? (
          <div className="one-picture">
            <img src={user.product_pictures[0].url} alt="" />
          </div>
        ) : (
          <div className="some-pictures">
            {user.product_pictures.map((picture, index) => {
              return <img key={index} src={picture.url} alt="" />;
            })}
          </div>
        )}
        <div>
          <div className="user">
            <p> {user.product_price} TND</p>

            <hr />

            {user.product_details.map((item, index) => {
              const keys = Object.keys(item);

              return (
                <div key={index} className="user-description">
                  <p>{keys[0]}</p>
                  <p>{item[keys[0]]}</p>
                </div>
              );
            })}

            <hr />

            <div className="product-description">
              <p>{user.product_name}</p>
              <p>{user.product_description}</p>
            </div>
            <button
              onClick={() => {
                history.push("/payment/" + offer._id, {
                  price: user.product_price,
                  name: user.product_name,
                  description: user.product_details[0].MARQUE,
                  picture: user?.img,
                });
              }}
            >
              Acheter
            </button>
          </div>
          <div className="user-description">
            <p>
              {user.owner.account.avatar && (
                <img src={user.owner.account.avatar.url} alt="" />
              )}
            </p>
            <div>
              <p>{user.owner.account.username}</p>
              <div className="rating">
                <FontAwesomeIcon icon="star" />
                <FontAwesomeIcon icon="star" />
                <FontAwesomeIcon icon="star" />
                <FontAwesomeIcon icon="star" />
                <FontAwesomeIcon icon="star" />
              </div>
            </div>
            <FontAwesomeIcon icon={"chevron-right"} />
          </div>
          {/* <div>
            <p className="cgv">
              Le droit de rétractation (article L. 221-18 du code de la
              consommation) et la garantie légale de conformité (article L.
              217-4 et suivants du même code) ne sont pas applicables à votre
              transaction. La garantie des vices cachés (article 1641 et
              suivants du code civil) est toutefois applicable.Vous pouvez
              également consulter les dispositions relatives au droit des
              obligations et à la responsabilité civile. Dans tous les cas, si
              vous payez via Vinted, votre achat est couvert par la Protection
              Acheteurs.
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default UserItem;
