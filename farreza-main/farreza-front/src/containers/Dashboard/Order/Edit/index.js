import React, { useState, useEffect } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import "./index.css";
import GoBackComponent from '../../../../components/backLink/index'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const OrderEdit = ({ token, apiUrl, userRole, routeName, label }) => {

    const STATUS_CONST = {
        'awaiting': 'AWAITING',
        'canceled': 'CANCELED',
        'closed': 'CLOSED',
        'payed': 'PAYED',
    };

    const Statuses = [
        { value: STATUS_CONST.awaiting, label: "En Attente" },
        { value: STATUS_CONST.canceled, label: "Annuler" },
        { value: STATUS_CONST.payed, label: "Payé" },
        { value: STATUS_CONST.closed, label: "Fermer" },
    ];

    let history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [preview, setPreview] = useState("");
    const [title, setTitle] = useState("");
    const [file, setFile] = useState({});
    const [adress, setAdress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [city, setCity] = useState("");
    const [price, setPrice] = useState("");
    const [order_status, setStatus] = useState("");
    const [doc, setDoc] = useState([]);
    const [shipping, setShipping] = useState(0);
    const [percentage, setPercentage] = useState(0);
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
    const handleTitle = (ev, init = false) => {
        setTitle(init ? ev : ev.target.value);
    };
    const handleZipCode = (ev, init = false) => {
        setZipCode(init ? ev : ev.target.value);
    };
    const handleAdress = (ev, init = false) => {
        setAdress(init ? ev : ev.target.value);
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
    const fetchData = async () => {
        try {
            console.log(params); // 👉️ {userId: '4200'}
            if (params.id) {
                const response = await axios.get(`${apiUrl}/${routeName}/${params.id}`);
                if (response.status >= 200 && response.status < 300) {
                    setDoc(response?.data?.response);
                    console.log("response?.data :", response?.data?.response);
                    handleTitle(response?.data?.response?.product_name, true);
                    handlePrice(response?.data?.response?.product_price, true);
                    handleStatus(response?.data?.response?.order_status, true);
                    if (response?.data?.response?.img) {
                        setPreview(`${apiUrl}/documents/${response?.data?.response?.img}`, true);
                    }

                    handleZipCode(response?.data?.response?.zipCode, true);
                    handleAdress(response?.data?.response?.adress, true);
                    handleCity(response?.data?.response?.city, true);
                    console.log("doc :", doc);
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
        fetchParamsData();
    }, [apiUrl, setDoc]);


    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const data = {
                order_status
            }
            console.log("params.id:", params.id);
            const result = await axios.put(`${apiUrl}/${routeName}/update/${params.id}`, data);
            toast.success("Modifié(e) avec succès.", {
                position: toast.POSITION.TOP_CENTER
            });
            console.log("result :", result);
        } catch (error) {
            toast.error("Quelque chose s'est mal passé.", {
                position: toast.POSITION.TOP_CENTER
            });
            console.log(error.message);
        }
    };

    const editProduct = (productId, type = "offers") => {
        const path = `/${type}/edit/${productId}`
        history.push(path)
    }

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
                        <h2>{label}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="file-select">
                                <div className="dashed-preview-image">
                                    <img className="img-overflow" src={preview} alt="pré-visualisation" />
                                </div>
                            </div>
                            <fieldset>
                                <div>
                                    <label>Titre</label>
                                    <input disabled
                                        type="text"
                                        placeholder="ex : Chemise Sézane verte"
                                        onChange={handleTitle}
                                        value={title}
                                    />
                                    {params?.type == "offers" ? (
                                        <input className="actionButton editButton" type="button" onClick={() => editProduct(doc?.productId, doc?.type)} value="Visiter" />
                                    ) : null}
                                </div>
                            </fieldset>
                            <fieldset>
                                <div>
                                    <h2>Acheteur</h2>
                                </div>
                                <div>
                                    <label>Username</label>
                                    <input disabled
                                        type="text"
                                        value={doc?.buyer?.account?.username}
                                    />
                                </div>
                                <div>
                                    <label>Nom Complet</label>
                                    <input disabled
                                        type="text"
                                        value={doc?.buyerName}
                                    />
                                </div>
                                <div>
                                    <label>Numéro de téléphone 1 </label>
                                    <input disabled
                                        type="text"
                                        value={doc?.buyer?.account?.phone}
                                    />
                                </div>
                                <div>
                                    <label>Numéro de téléphone 2 </label>
                                    <input disabled
                                        type="text"
                                        value={doc?.buyerPhone}
                                    />
                                </div>
                                <div>
                                    <label>Adresse</label>
                                    <textarea disabled
                                        placeholder="ex : porté quelquefois, taille correctement"
                                        onChange={handleAdress}
                                        value={adress}
                                    ></textarea>
                                </div>
                                <div>
                                    <label>Ville</label>
                                    <input disabled
                                        type="text"
                                        placeholder="ex : Tunis"
                                        onChange={handleCity}
                                        value={city}
                                    />
                                </div>
                                <div>
                                    <label>Code Postal</label>
                                    <input disabled
                                        type="text"
                                        placeholder="ex : 1001"
                                        onChange={handleZipCode}
                                        value={zipCode}
                                    />
                                </div>
                            </fieldset>
                            {params?.type == "offers" ? (
                                <fieldset>
                                    <div>
                                        <h2>Vendeur</h2>
                                    </div>
                                    <div>
                                        <label>Username </label>
                                        <input disabled
                                            type="text"
                                            value={doc?.owner?.account?.username}
                                        />
                                    </div>
                                    <div>
                                        <label>Email </label>
                                        <input disabled
                                            type="text"
                                            value={doc?.owner?.email}
                                        />
                                    </div>
                                    <div>
                                        <label>Numéro de téléphone</label>
                                        <input disabled
                                            type="text"
                                            value={doc?.owner?.account?.phone}
                                        />
                                    </div>
                                </fieldset>
                            ) : null}
                            <fieldset>
                                <div>
                                    <h2>Frais</h2>
                                </div>
                                <div className="input-price">
                                    <label>Prix</label>
                                    <input disabled
                                        type="text"
                                        placeholder="0,00 TND"
                                        value={price}
                                    />
                                </div>
                                {/* {params?.type == "offers" ? (
                                    <>
                                        <div className="input-price">
                                            <label>Frais plateforme ({doc?.percentage * 100} %)</label>
                                            <input disabled
                                                type="text"
                                                value={(doc?.percentage * price).toFixed(2)}
                                            />
                                        </div>
                                        <div>
                                            <label>Frais de livraison</label>
                                            <input disabled
                                                type="text"
                                                value={doc?.shipping}
                                            />
                                        </div>
                                    </>
                                ) : null} */}
                                <div  >
                                    <label>Frais Total</label>
                                    <input disabled
                                        type="text"
                                        value={doc?.amount}
                                    />
                                </div>
                            </fieldset>

                            {userRole == "ADMIN" ?
                                <fieldset>
                                    <div className="orderBy" style={{ 'width': '60%' }}>
                                        <label>Statut</label>
                                        <select value={order_status}
                                            onChange={handleStatus}>
                                            <option value="">Trier par status</option>
                                            {Statuses?.length ? Statuses.map((s, i) => (
                                                <option key={i} value={s.value}>{s.label}</option>
                                            )) : null}
                                        </select>
                                    </div>
                                </fieldset>
                                : null}
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

export default OrderEdit;