import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./index.css";
import Loader from "react-loader-spinner";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ItemDetail = ({ doc, apiUrl, routeName }) => {
  let history = useHistory();

  const [updateGalleryIsLoading, setUpdateGalleryIsLoading] = useState(true);
  const [uploadCoverImageIsLoading, setUploadCoverImageIsLoading] = useState(true);
  useEffect(() => {
    console.log("useEffect : index : itemdetail");
    let imageExists = null
    if (doc && doc?.product_pictures && doc?.product_pictures?.length) {
      imageExists = doc?.product_pictures.some(x => x.includes(doc.img))
      if (!imageExists) {
        doc?.product_pictures.unshift(doc.img)
      }
    }
    setUpdateGalleryIsLoading(false)
    setUploadCoverImageIsLoading(false)
  }, [doc, apiUrl]);

  const changeCoverImage = (picture) => {
    setUploadCoverImageIsLoading(true)
    if (doc && picture) {
      doc.img = picture
      console.log("img :", doc?.img);
      console.log("picture :", picture);
      setTimeout(() => {
        setUploadCoverImageIsLoading(false)
        console.log(" uploadCoverImageIsLoading : ", uploadCoverImageIsLoading);
      }, 1000);
    }
  }

  const addToFavorite = async () => {
    const result = await axios.post(`${apiUrl}/wishs/publish`, { offer: doc?._id })
    toast.success("Ajouté(e) avec succès.", {
      position: toast.POSITION.TOP_CENTER
    });
    history.push("/wishs/list");
  }
  return (
    <>
      <div className="offer-product">
        <div className="product-image-container">
          <div className="one-picture">
            {!uploadCoverImageIsLoading ?
              <img style={{ "objectFit": "contain", "alignContent": "center", "textAlign": "center" }} src={apiUrl + '/documents/' + doc?.img} alt="" />
              :
              <div className="loading-item">
                <Loader
                  type="Oval"
                  color="#5a93ce"
                  height={100}
                  width={100}
                  timeout={99999}
                />
              </div>
            }
          </div>
          {routeName == "offers" ?
            <div >
              {!updateGalleryIsLoading ?
                ((doc && doc?.product_pictures && doc?.product_pictures?.length) ? (
                  <div className="dashed-preview-image" style={{ "overflow": "auto" }}>
                    {doc?.product_pictures.map((picture, index) => {
                      return <img style={{ "cursor": "pointer" }} onClick={() => changeCoverImage(picture)} key={index} src={apiUrl + '/documents/' + picture} alt="" />;
                    })}
                  </div>
                ) : null)
                :
                <div className="loading-home">
                  <Loader
                    type="Oval"
                    color="#5a93ce"
                    height={100}
                    width={100}
                    timeout={99999}
                  />{" "}
                </div>
              }
            </div>
            : null}

        </div>
        <div>
          <div className="offer article-details">
            <p> {doc?.product_price || doc?.price} TND</p>
            <p>{doc?.category?.title ? doc?.category?.title : null}</p>
            <hr />
            {doc?.product_details ? doc?.product_details.map((item, index) => {
              const keys = Object.keys(item);
              if (keys[0] != "EMPLACEMENT") {
                return (
                  <div key={index} className="offer-description">
                    <p>{keys[0]}</p>
                    <p>{item[keys[0]]}</p>
                  </div>
                );
              } else {
                return null
              }
            }) : null}
            {doc?.product_name ? <hr /> : null}
            <div className="product-description">
              <p>{doc?.product_name || doc?.title}</p>
              <p>{doc?.product_description || doc?.description}</p>
            </div>
            <button className="submitButton"
              onClick={() => {
                history.push(`/payment/${routeName}/${doc?._id}`, {
                  price: doc?.product_price,
                  name: doc?.product_name,
                  description: routeName == "offers" ? doc?.product_details[0]?.MARQUE : "",
                  picture: doc?.img,
                });
              }}
            >
              Acheter
            </button>
            <button onClick={() => addToFavorite()} className="wishButton">Ajouter aux Favoris</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
