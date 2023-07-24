import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./index.css";
import GoBackComponent from '../../../../components/backLink/index'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductPublish = ({ token, apiUrl }) => {
  let history = useHistory();
  // const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  // const [file, setFile] = useState({});
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const handleTitle = (ev) => {
    setTitle(ev.target.value);
  };
  const handleDescription = (ev) => {
    setDescription(ev.target.value);
  };
  const handleBrand = (ev) => {
    setBrand(ev.target.value);
  };
  const handleCategory = (ev) => {
    console.log("category id :", ev.target.value);
    setCategory(ev.target.value);
  };
  const handleColor = (ev) => {
    setColor(ev.target.value);
  };
  const handleSize = (ev) => {
    setSize(ev.target.value);
  };
  const handleCondition = (ev) => {
    setCondition(ev.target.value);
  };
  const handleCity = (ev) => {
    setCity(ev.target.value);
  };
  const handlePrice = (ev) => {
    setPrice(ev.target.value);
  };

  const fetchCategoriesData = async () => {
    try {
      const path = `${apiUrl}/categories/admin`;
      const response = await axios.get(path);
      setCategories(response.data.docs);
    } catch (error) {
      console.log(error.message);
    }
  };
  const [shipping, setShipping] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const fetchParamsData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/parameters/users`);
      console.log("fetchParamsData :", response);
      if (response?.data?.counter) {
        const ship = response?.data?.docs.find(doc => doc.key == "shipping")
        const percent = response?.data?.docs.find(doc => doc.key == "percentage")
        if (ship && ship.value) setShipping(Number(ship?.value), true);
        if (percent && percent.value) setPercentage(Number(percent?.value), true);
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchCategoriesData();
  }, [apiUrl, token, setCategories]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      if (!title) {
        toast.info("Veuillez enter le titre du produit.", {
          position: toast.POSITION.TOP_CENTER
        });

        return;
      }
      if (!price) {
        toast.info("Veuillez enter le prix du produit.", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      if (price < 30) {
        toast.info("Veuillez enter un prix de produit superieure à 30dt.", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      if (!condition) {
        toast.info("Veuillez enter l'état du produit (Ex: Neuf)", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      if (!brand) {
        toast.info("Veuillez enter la marque du produit (ex: ZARA)", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      if (!size) {
        toast.info("Veuillez enter la taille du produit", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      if (!color) {
        toast.info("Veuillez enter le couleur du produit", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      if (!city) {
        toast.info("Veuillez enter l'emplacement du produit", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      if (!category) {
        toast.info("Veuillez enter la categorie du produit", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      const params = { title, description, price, condition, brand, size, color, city, category }
      const response = await axios.post(`${apiUrl}/offers/publish`, params);
      toast.success("Ajouté(e) avec succès.", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push(`edit/${response.data._id}`);
    } catch (error) {
      toast.error("Quelque chose s'est mal passé.", {
        position: toast.POSITION.TOP_CENTER
      });
      console.log(error.message);
    }
  };

  return token ? (
    <>
      <section className="publish-section">
        <div>
          <GoBackComponent />
          <h2>Vends ton article</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <div>
                <label>Titre</label>
                <input
                  type="text"
                  placeholder="ex : Chemise Sézane verte"
                  onChange={handleTitle}
                  value={title}
                />
              </div>

              <hr />

              <div>
                <label>Décris ton article</label>
                <textarea
                  placeholder="ex : porté quelquefois, taille correctement"
                  onChange={handleDescription}
                  value={description}
                ></textarea>
              </div>
            </fieldset>

            <fieldset>
              <div>
                <label>Catégorie</label>
                <select multiple={false}
                  placeholder="ex : Homme"
                  value={category}
                  onChange={(ev) => {
                    handleCategory(ev);
                  }}
                >
                  <option value="">choisissez une catégorie</option>
                  {categories?.length ? categories.map((s, i) => (
                    <option key={i} value={s._id}>{s.title}</option>
                  )) : null}
                </select>
              </div>
              <div>
                <label>Marque</label>
                <input
                  type="text"
                  placeholder="ex : Zara"
                  onChange={handleBrand}
                  value={brand}
                />
              </div>
              <div>
                <label>Taille</label>
                <input
                  type="text"
                  placeholder="ex : L / 42 / 12"
                  onChange={handleSize}
                  value={size}
                />
              </div>
              <div>
                <label>Couleur</label>
                <input
                  type="text"
                  placeholder="ex : Fuchsia"
                  onChange={handleColor}
                  value={color}
                />
              </div>
              <div>
                <label>État</label>
                <input
                  type="text"
                  placeholder="Indique l'état de ton article"
                  onChange={handleCondition}
                  value={condition}
                />
              </div>
              <div>
                <label>Lieu</label>
                <input
                  type="text"
                  placeholder="ex : Paris"
                  onChange={handleCity}
                  value={city}
                />
              </div>
            </fieldset>

            <fieldset>
              <div className="input-price">
                <label>Prix (minimum : 30dt)</label>
                <input
                  type="text"
                  placeholder="0,00 TND"
                  onChange={handlePrice}
                  value={price}
                />
              </div>
              {/* <div className="exchange">
                <div>
                  <input type="checkbox" />
                  <p>Je suis intéressé(e) par les échanges</p>
                </div>
              </div> */}
            </fieldset>
            {percentage || shipping ?
              <fieldset>
                {percentage ?
                  <div className="input-price">
                    <label>Frais Plateforme</label>
                    <input disabled={true}
                      type="text"
                      placeholder="0,00 TND"
                      value={percentage + '%'}
                    />
                  </div>
                  : null}
                {shipping ?
                  <div className="input-price">
                    <label>Frais livraison</label>
                    <input disabled={true}
                      type="text"
                      value={shipping + ' TND'}
                    />
                  </div>
                  : null}
              </fieldset>
              : null}
            <div className="submit-form">
              <input type="submit" value="Ajouter" />
            </div>
          </form>
        </div>
      </section>
    </>
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: { fromPublish: true },
      }}
    />
  );
};

export default ProductPublish;
