import React, { useState, useEffect } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import "./index.css";
import GoBackComponent from '../../../../components/backLink/index'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const GenericEdit = ({
  token,
  apiUrl,
  routeName,
  label,
  pricing,
  describing,
  KeyValue,
}) => {
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState({});
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [enabled, setEnabled] = useState();
  const [doc, setDoc] = useState([]);

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategoriesData = async () => {
    try {
      const path = `${apiUrl}/categories/admin/parent?from=${doc._id}`;
      const response = await axios.get(path);
      setCategories(response.data.docs);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchCategoriesData();
  }, [apiUrl, token, setCategories, doc._id]);
  //Params
  const params = useParams();

  const handleTitle = (ev, init = false) => {
    setTitle(init ? ev : ev.target.value);
  };
  const handleCategory = (ev, init = false) => {
    console.log("category id :", ev.target.value);
    console.log("category id == '':", ev.target.value == "");
    if (ev.target.value == "") {
      setCategory(null)
    } else {
      setCategory(init ? ev : ev.target.value);
    }
  };
  const handlePrice = (ev, init = false) => {
    setPrice(init ? ev : ev.target.value);
  };
  const handleValue = (ev, init = false) => {
    setValue(init ? ev : ev.target.value);
  };
  const handleDescription = (ev, init = false) => {
    setDescription(init ? ev : ev.target.value);
  };
  const handleFile = async (file) => {
    setFile(file)
    const formData = new FormData()
    formData.append("document", file, file.name)
    const path = `${apiUrl}/documents/upload/${routeName}/${params.id}`;
    const config = { headers: { "Content-Type": "multipart/form-data" } }
    const result = await axios.post(path, formData, config)
    toast.success("Telechargé avec succès.", {
      position: toast.POSITION.TOP_CENTER
    });
    console.log("result : ", result);
  };
  const handleEnabled = (ev, init = false) => {
    setEnabled(init ? ev : ev.target.value);
  };

  const goBackToList = () => {
    console.log("goBackToList");
    setIsLoading(false);
    const path = `/${routeName}/list`
    history.push(path)
  }

  const fetchData = async () => {
    try {
      console.log("fetchData :", params);
      console.log(params); // 👉️ {id: '4200'}
      if (params.id) {
        const path = `${apiUrl}/${routeName}/${params.id}`;
        const response = await axios.get(path);
        if (response.status >= 200 && response.status < 300) {
          console.log(response?.data.response);
          setDoc(response?.data.response);
          handleTitle(response?.data?.response?.title, true);
          if (routeName === "categories") {
            setCategory(response?.data?.response?.parentId);
          }
          if (pricing) {
            handlePrice(response?.data?.response?.price, true);
          }
          if (describing) {
            handleDescription(response?.data?.response?.description, true);
          }
          if (KeyValue) {
            handleValue(response?.data?.response?.value, true);
          }
          handleEnabled(response?.data?.response?.enabled, true);
          if (response?.data?.response?.img) {
            setPreview(`${apiUrl}/documents/${response?.data?.response?.img}`, true);
          }
          console.log("doc :", doc);
          setIsLoading(false);
        } else {
          console.log("not found");
          goBackToList()
        }
      } else {
        console.log("parameter not found");
        goBackToList()
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    console.log("useEffect :");
    fetchData();
  }, [apiUrl, setDoc]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {

      if (!title) {
        toast.info("Veuillez enter le titre du produit.", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      if (pricing && !price) {
        toast.info("Veuillez enter le prix du produit.", {
          position: toast.POSITION.TOP_CENTER
        });
        return;
      }
      if (KeyValue && (!doc?.key || !value)) {
        console.log("Parametre non trouver");
        return;
      }
      let data = { title, enabled, price, description, value }
      if (routeName === "categories") {
        data['parentId'] = category
      }
      console.log("data :", data);
      console.log("params.id:", params.id);
      const path = `${apiUrl}/${routeName}/update/${params.id}`
      const result = await axios.put(path, data);
      if (routeName == "transactions") {
        toast.success("Envoyé(e) avec succès.", {
          position: toast.POSITION.TOP_CENTER
        });
      } else {
        toast.success("Modifié(e) avec succès.", {
          position: toast.POSITION.TOP_CENTER
        });
      }
      history.push(`/${routeName}/list`)
      console.log("result :", result);
    } catch (error) {
      toast.error("Quelque chose s'est mal passé.", {
        position: toast.POSITION.TOP_CENTER
      });
      console.log(error.message);
    }
  };

  return token ? (
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
    ) : (
      <>
        <section className="publish-section">
          <div>
            <GoBackComponent />
            <h2>Modifier {label}</h2>
            {/* <div style={{ display: 'flex' }}> */}
            {/* </div> */}
            <form onSubmit={handleSubmit}>
              {!KeyValue ? (
                <div className="file-select">
                  {preview ? (
                    <div className="dashed-preview-image">
                      <img className="img-overflow" src={preview} alt="pré-visualisation" />
                      <div
                        className="remove-img-button"
                        onClick={() => {
                          setPreview("");
                        }}
                      >
                        X
                      </div>
                    </div>
                  ) : (
                    <div className="dashed-preview-without">
                      <div className="input-design-default">
                        <label htmlFor="file" className="label-file">
                          <span className="input-sign">+</span>
                          <span>Ajoute une photo</span>
                        </label>
                        <input
                          id="file"
                          type="file"
                          className="input-file"
                          onChange={(event) => {
                            handleFile(event.target.files[0]);
                            setPreview(URL.createObjectURL(event.target.files[0]));
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
              <fieldset>
                <div>
                  <label>Titre</label>
                  <input
                    type="text" disabled={KeyValue}
                    placeholder="ex : Chemise Sézane verte"
                    onChange={handleTitle}
                    value={title}
                  />
                </div>
              </fieldset>
              {routeName === "categories" ? (
                <fieldset>
                  <div>
                    <label>Catégorie Mère</label>
                    <select multiple={false}
                      placeholder="ex : Homme"
                      value={category}
                      onChange={handleCategory}>
                      <option value=""> -- </option>
                      {categories?.length ? categories.map((s, i) => (
                        <option key={i} value={s._id}>{s.title}</option>
                      )) : null}
                    </select>
                  </div>
                </fieldset>
              ) : null}
              {pricing ? (
                <fieldset>
                  <div>
                    <label>Prix</label>
                    <input
                      type="number"
                      placeholder="ex : 30"
                      onChange={handlePrice}
                      value={price}
                    />
                  </div>
                </fieldset>
              ) : null}
              {describing ? (
                <fieldset>
                  <div>
                    <label>Description</label>
                    <textarea
                      placeholder="Veuillez entrer votre description"
                      onChange={handleDescription}
                      value={description}
                    ></textarea>
                  </div>
                </fieldset>
              ) : null}
              {KeyValue ? (
                <>
                  <fieldset>
                    <div>
                      <label>Clé</label>
                      <input
                        type="text" disabled
                        value={doc?.key}
                      />
                    </div>
                  </fieldset>
                  <fieldset>
                    <div>
                      <label>Valeur</label>
                      <input
                        type="number"
                        onChange={handleValue}
                        value={value}
                      />
                    </div>
                  </fieldset>

                </>
              ) : null}
              <div className="submit-form">
                {routeName == "transactions" ?
                  <input type="submit" value="Envoyer" />
                  : <input type="submit" value="Confirmer" />}
              </div>
            </form>
          </div>
        </section>
      </>
    )
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: { fromPublish: true },
      }}
    />
  );
};

export default GenericEdit;
