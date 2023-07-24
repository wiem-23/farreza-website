import React, { useState, useEffect } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import "./index.css";
import GoBackComponent from '../../../../components/backLink/index'
import { PromisePool } from '@supercharge/promise-pool'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProductEdit = ({ token, apiUrl, userRole }) => {
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState({});
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [product_status, setStatus] = useState("");
  const [offer, setOffer] = useState([]);
  const [routeName, setRouteName] = useState("offers");

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategoriesData = async () => {
    try {
      const path = `${apiUrl}/categories/admin`;
      const response = await axios.get(path);
      setCategories(response.data.docs);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchCategoriesData();
  }, [apiUrl, token, setCategories]);
  //Params
  const params = useParams();

  const handleFile = async (file) => {
    setFile(file)
    const formData = new FormData()
    formData.append("document", file, file.name)
    const path = `${apiUrl}/documents/upload/${routeName}/${params.id}`;
    const config = { headers: { "Content-Type": "multipart/form-data" } }
    const result = await axios.post(path, formData, config)
    console.log("result : ", result);
  };

  const [product_pictures, setProductPictures] = useState([]);
  const [files, setFiles] = useState([]);
  const handleMultipleFiles = async (arrayOfFiles) => {
    setUploadGalleryIsLoading(true)
    console.log("files : ", arrayOfFiles);
    if (arrayOfFiles?.length) {
      setFiles(arrayOfFiles)
      const filesArray = [...arrayOfFiles]
      const arrLength = filesArray?.length + product_pictures?.length
      if (arrLength > 8) {
        toast.info("Le nombre de photos ne doit pas dépasser 8.", {
          position: toast.POSITION.TOP_CENTER
        });
        setUploadGalleryIsLoading(false)
        return
      }
      await PromisePool
        .for(filesArray)
        .process(async f => {
          const formData = new FormData()
          formData.append("document", f, f.name)
          const path = `${apiUrl}/documents/upload/${routeName}/${params.id}?multiple=true`;
          const config = { headers: { "Content-Type": "multipart/form-data" } }
          const result = await axios.post(path, formData, config)
            .catch(err => {
              console.error("error : PromisePool : post : catch ", err)
              if (err.code == 10) {
                /* Checking if the number of photos is greater than 8. If it is, it will display an error
                message and set the loading state to false. */
                toast.info("Le nombre de photos ne doit pas dépasser 8.", {
                  position: toast.POSITION.TOP_CENTER
                });
                setUploadGalleryIsLoading(false)
                return
              }
            })
          if (result?.data?.product_pictures?.length) {
            console.log("result?.data?.product_pictures : ", result?.data?.product_pictures);
            setProductPictures(current => {
              console.log("current : ", current);
              console.log("result?.data?.product_pictures : ", result?.data?.product_pictures);
              let arr = [...current, ...result?.data?.product_pictures]
              arr = arr.map(x => {
                if (x.includes("/documents/")) {
                  x = x.split("/documents/")[1]
                }
                return x
              })
              console.log("arr : ", arr);
              let set = [...new Set(arr)]
              console.log("set : ", set);
              return set
            })
          }
          console.log("result : ", result);
        }).finally(() => setUploadGalleryIsLoading(false))
    }
  };
  const [uploadGalleryIsLoading, setUploadGalleryIsLoading] = useState(false);
  const deleteProductPicture = async (index) => {
    console.log("deleteProductPicture :")
    setUploadGalleryIsLoading(true)
    let imgId = product_pictures[index]
    console.log("imgId : ", imgId)
    if (imgId) {
      if (imgId.includes("/documents/")) {
        imgId = imgId.split("/documents/")[1]
      }
      console.log("imgId :", imgId)
      product_pictures.splice(index, 1)
      const path = `${apiUrl}/documents/${imgId}?product=${offer._id}`;
      const result = await axios.delete(path)
        .catch(err => {
          setUploadGalleryIsLoading(false)
        })
      setProductPictures(product_pictures)
      setTimeout(() => {
        setUploadGalleryIsLoading(false)
        console.log(" uploadGalleryIsLoading : ", uploadGalleryIsLoading);
      }, 500);

    } else {
      setUploadGalleryIsLoading(false)
    }
  }
  const handleTitle = (ev, init = false) => {
    setTitle(init ? ev : ev.target.value);
  };
  const handleCategory = (ev, init = false) => {
    console.log("category id :", ev.target.value);
    setCategory(init ? ev : ev.target.value);
  };
  const handleDescription = (ev, init = false) => {
    setDescription(init ? ev : ev.target.value);
  };
  const handleBrand = (ev, init = false) => {
    setBrand(init ? ev : ev.target.value);
  };
  const handleColor = (ev, init = false) => {
    setColor(init ? ev : ev.target.value);
  };
  const handleSize = (ev, init = false) => {
    setSize(init ? ev : ev.target.value);
  };
  const handleCondition = (ev, init = false) => {
    setCondition(init ? ev : ev.target.value);
  };
  const handleCity = (ev, init = false) => {
    setCity(init ? ev : ev.target.value);
  };
  const handlePrice = (ev, init = false) => {
    setPrice(init ? ev : ev.target.value);
  };
  const handleStatus = (ev, init = false) => {
    setStatus(init ? ev : ev.target.value);
  };

  const goBackToList = () => {
    setIsLoading(false);
    const path = `/product/list`
    history.push(path)
  }

  const fetchData = async () => {
    try {
      console.log(params); // 👉️ {userId: '4200'}
      if (params.id) {
        const response = await axios.get(`${apiUrl}/${routeName}/${params.id}`);
        if (response.status >= 200 && response.status < 300) {
          setOffer(response?.data);
          handleTitle(response?.data?.product_name, true);
          setCategory(response?.data?.category?._id);
          handleDescription(response?.data?.product_description, true);
          handlePrice(response?.data?.product_price, true);
          handleStatus(response?.data?.product_status, true);
          if (response?.data?.img) {
            setPreview(`${apiUrl}/documents/${response?.data?.img}`, true);
          }
          if (response?.data?.product_pictures?.length) {
            const arrayOfFiles = response?.data?.product_pictures.map(img => `${apiUrl}/documents/${img}`)
            console.log("arrayOfFiles :", arrayOfFiles);
            setProductPictures(arrayOfFiles)
          }

          //Set brand
          /*
          0: {MARQUE: 'zara'}
          1: {TAILLE: 'XL'}
          2: {ETAT: 'neuf'}
          3: {COULEUR: 'Noir'}
          4: {EMPLACEMENT: 'Paris'}
          */
          handleBrand(response?.data?.product_details[0]?.MARQUE, true);
          handleSize(response?.data?.product_details[1]?.TAILLE, true);
          handleCondition(response?.data?.product_details[2]?.ETAT, true);
          handleColor(response?.data?.product_details[3]?.COULEUR, true);
          handleCity(response?.data?.product_details[4]?.EMPLACEMENT, true);
          console.log("offer :", offer);
          setIsLoading(false);
        } else {
          goBackToList()
        }
      } else {
        goBackToList()
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, [apiUrl, setOffer]);


  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {

      const data = {
        title,
        description,
        price,
        brand,
        category,
        condition,
        size,
        color,
        city,
        product_status
      }
      console.log("params.id:", params.id);
      const result = await axios.put(`${apiUrl}/${routeName}/update/${params.id}`, data);
      toast.success("Modifié(e) avec succès.", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/product/list");
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
            <h2>Modifier ton article</h2>
            <form onSubmit={handleSubmit}>
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
                    <div className="input-design-default" style={{height : "55px!important"}}>
                      <label htmlFor="file" className="label-file">
                        <span className="input-sign">+</span>
                        <span>photo principale</span>
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
              {/* number2 */}
              {!uploadGalleryIsLoading ?
                <div className="file-select">
                  <div className="dashed-preview-without">
                    <div className="input-design-default">
                      <label htmlFor="files" className="label-file">
                        <span className="input-sign">+</span>
                        <span>Galerie</span>
                      </label>
                      <input
                        id="files"
                        type="file"
                        multiple={true}
                        className="input-file"
                        onChange={(event) => {
                          handleMultipleFiles(event.target.files);
                        }}
                      />
                    </div>
                  </div>
                  {product_pictures?.length ?
                    <div className="dashed-preview-image" style={{ "overflow": "auto" }}>
                      {product_pictures.map((img, index) => (
                        <React.Fragment key={index}>
                          <img className="img-overflow" src={img.includes("document") ? img : apiUrl + "/documents/" + img} alt="pré-visualisation" />
                          <div
                            className="remove-img-button"
                            onClick={() => {
                              deleteProductPicture(index)
                            }}
                          >
                            X
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    : null}
                </div>
                : (
                  <div className="file-select">
                    <div className="dashed-preview-image">
                      <div className="loading">
                        <Loader
                          type="Oval"
                          color="#5a93ce"
                          height={100}
                          width={100}
                          timeout={99999}
                        />{" "}
                      </div>
                    </div>
                  </div>

                )}
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
                    onChange={handleCategory}
                  >
                    <option value="">choisissez une catégorie</option>
                    {categories?.length ? categories.map((s, i) => (
                      <option key={i} value={s._id}>{s?.parentId?.title ? s?.parentId?.title + ':' : null} {s.title}</option>
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
                <hr />
                <div>
                  <label>Taille</label>
                  <input
                    type="text"
                    placeholder="ex : L / 42 / 12"
                    onChange={handleSize}
                    value={size}
                  />
                </div>

                <hr />

                <div>
                  <label>Couleur</label>
                  <input
                    type="text"
                    placeholder="ex : Fuchsia"
                    onChange={handleColor}
                    value={color}
                  />
                </div>

                <hr />

                <div>
                  <label>État</label>
                  <input
                    type="text"
                    placeholder="Indique l'état de ton article"
                    onChange={handleCondition}
                    value={condition}
                  />
                </div>

                <hr />

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
              </fieldset>
              {userRole == "ADMIN" ?
                <fieldset>
                  <div className="orderBy" style={{ 'width': '60%' }}>
                    <label>Statut</label>
                    <select value={product_status}
                      onChange={handleStatus}>
                      <option value="AWAITING">En attente</option>
                      <option value="ACCEPTED">Accepté</option>
                      <option value="REJECTED">Rejeté</option>
                      <option value="DELIVERY">En cours de Livraison</option>
                      <option value="DELIVERED">Livré</option>
                    </select>
                  </div>
                </fieldset>
                : null}
              {/* <fieldset>
                <div className="input-exchange">
                  <label>Échange</label>
                  <div className="exchangeEdit">
                    <input type="checkbox" />
                    <p>Je suis intéressé(e) par les échanges</p>
                  </div>
                </div>
              </fieldset> */}
              {/* <p className="cgu">
                Un vendeur professionnel se présentant comme un consommateur ou un
                non-professionnel sur Vinted encourt les sanctions prévues à
                l'article L 132-2 du code de la consommation.
              </p> */}
              <div className="submit-form">
                <input type="submit" value="Confirmer" />
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

export default ProductEdit;