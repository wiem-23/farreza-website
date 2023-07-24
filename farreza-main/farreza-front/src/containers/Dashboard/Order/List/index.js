import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import Moment from 'moment';
import OrderByPrice from "../../../../components/OrderByPrice";
import OrderByProductStatus from "../../../../components/OrderByProductStatus";
import GoBackComponent from '../../../../components/backLink/index'

import "./index.css";


const OrderList = ({ token, apiUrl, userRole }) => {

    const STATUS_CONST = {
        'awaiting': 'AWAITING',
        'canceled': 'CANCELED',
        'payed': 'PAYED',
        'closed': 'CLOSED',
    };

    const Statuses = [
        { value: STATUS_CONST.awaiting, label: "En Attente" },
        { value: STATUS_CONST.canceled, label: "Annuler" },
        { value: STATUS_CONST.payed, label: "Payé" },
        { value: STATUS_CONST.closed, label: "Fermer" },
    ];

    let history = useHistory();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(true);

    // Nombre d'offres maximum par page
    const limit = 10;

    // State qui permet de donner le numéro de la page dynamiquement
    const [page, setPage] = useState(0);
    // State qui regroupe dans un tableau toutes les offres issues de la recherche filtrée
    const [docs, setDocs] = useState([]);
    // State qui permet de filtrer la recherche
    const [filter, setFilter] = useState("");
    // State qui permet de calculer le nombre de page maximum
    const [pageMax, setPageMax] = useState(0);

    // State qui permet de trier par prix
    const [sort, setSort] = useState("");
    const [docStatusQuery, setStatusQuery] = useState("");

    const handlePageClick = (event) => {
        setPage(event.selected + 1);
    };

    var heading = [
        'Image',
        'Titre',
        'Prix de Produit',
        'Montant Total',
        'Date Création',
        'Status',
        'Actions'
    ];

    const fetchData = async () => {
        try {
            console.log("history?.location?.pathname :", history?.location?.pathname);
            const isDeleted = history?.location?.pathname.includes("deleted")
            const path = `${apiUrl}/orders/admin?enabled=${isDeleted ? false : true}&page=${page}&limit=${limit}&type=${params?.type ? params.type : 'offers'}&sort=${sort}&order_status=${docStatusQuery}${filter}`;
            const response = await axios.get(path);
            setDocs(response.data.docs);
            setPageMax(Math.ceil(Number(response.data.counter) / limit));
            setIsLoading(false);
            console.log("orders :", docs);
        } catch (error) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, [page, sort, docStatusQuery, filter, apiUrl, setDocs]);

    const getProductStatus = (order_status) => {
        switch (order_status) {
            case STATUS_CONST.canceled: return "Annuler";
            case STATUS_CONST.closed: return "Fermer";
            case STATUS_CONST.payed: return "Payé";
            case STATUS_CONST.awaiting:
            default: return "En Attente";
        }
    }
    const editDoc = (productId, type = "offers") => {
        const path = `/commandes/edit/${type}/${productId}`
        history.push(path)
    }
    const deleteProduct = async (productId) => {
        const path = `${apiUrl}/orders/update/${productId}`;
        const response = await axios.put(path, { order_status: STATUS_CONST.canceled });
        console.log("delete response : ", response);
        await fetchData()
    }
    return token ? (
        isLoading === true ? (
            <div className="loading-home">
                <Loader
                    type="Oval"
                    color="#5a93ce"
                    height={100}
                    width={100}
                    timeout={99999}
                />
            </div>
        ) : (
            <div className="container">
                <section className="publish-section">
                    <div>
                        <GoBackComponent />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ 'marginBottom': 'unset' }}>Liste des commandes</h2>
                        </div>
                        <div className="file-select list" >
                            <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row-reverse" }}>
                                <OrderByProductStatus setStatusQuery={setStatusQuery} Statuses={Statuses} />
                                {docs?.length ? (<>
                                    <OrderByPrice setSort={setSort} sortDocLabel={"Prix"} />
                                </>) : ""}
                            </div>

                            {docs?.length ? (<>
                                <table className="commande-table">
                                    <thead>
                                        <tr>
                                            {heading.map((head, index) => <th key={'heading-' + index}>{head}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {docs.map((doc, index) => (
                                            <tr key={'body' + index}>
                                                <td width="10%">
                                                    {doc?.img ?
                                                        <img className="listimg" src={apiUrl + '/documents/' + doc.img} />
                                                        : "x"
                                                    }
                                                </td>
                                                <td>{doc?.product_name}</td>
                                                <td>{doc?.product_price}</td>
                                                <td>{doc?.amount}</td>
                                                <td>{Moment(doc?.createdAt).format('DD-MM-YYYY')}</td>
                                                <td>{getProductStatus(doc?.order_status)}</td>
                                                <td>
                                                    {userRole == "ADMIN" ? (
                                                        <button className="actionButton editButton" onClick={() => editDoc(doc?._id, doc?.type)}>Modifier</button>
                                                    ) : null}
                                                    {userRole == "VENDOR" && STATUS_CONST.canceled != doc?.order_status && STATUS_CONST.awaiting == (doc?.order_status) ? (
                                                        <button className="actionButton deleteButton" onClick={() => deleteProduct(doc?._id)}>Annuler</button>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table></>) : "Pas encore de données"}
                            {docs.map((doc, index) => (
                                <div className="mobile-commande-list-card" key={'body' + index}>
                                    <div className="card-img" width="10%">
                                        {doc?.img ?
                                            <img className="listimg" src={apiUrl + '/documents/' + doc.img} />
                                            : "x"
                                        }
                                    </div>
                                    <div className="card-info">
                                        <div className="product-name">{doc?.product_name}</div>
                                        <div> <span className="card-label">Prix: </span> {doc?.product_price}TND</div>
                                        <div><span className="card-label">Date: </span>{Moment(doc?.product_date).format('DD-MM-YYYY')}</div>
                                        <div><span className="card-label">Utilisateur: </span>{doc?.owner?.account?.username}</div>
                                        <div><span className="card-label">Status: </span>{getProductStatus(doc?.product_status)}</div>
                                        <div className="mobile-card-footer">
                                            <button className="actionButton editButton" onClick={() => editDoc(doc?._id)}>Modifier</button>
                                            <button className="actionButton deleteButton" onClick={() => deleteProduct(doc?._id)}>Supprimer</button>
                                        </div>
                                    </div>
                                </div>))}


                        </div>
                        {docs?.length ?
                            <div className="pages">
                                <div className="pages">
                                    <ReactPaginate
                                        previousLabel={page == 0 ? "" : "PREV"}
                                        nextLabel={docs?.length >= limit ? "NEXT" : ""}
                                        pageCount={pageMax}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages"}
                                        activeClassName={"active"}
                                    />
                                </div>
                            </div>
                            : null}
                    </div>
                </section>
            </div>)
    ) : (
        <Redirect
            to={{
                pathname: "/login",
                state: { fromPublish: true },
            }}
        />
    );
};

export default OrderList;
