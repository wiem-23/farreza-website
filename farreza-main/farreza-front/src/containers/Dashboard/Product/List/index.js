import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Loader from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import Moment from 'moment';
import OrderByPrice from "../../../../components/OrderByPrice";
import OrderByProductStatus from "../../../../components/OrderByProductStatus";
import GoBackComponent from '../../../../components/backLink/index'

import "./index.css";


const ProductList = ({ token, apiUrl }) => {

    const STATUS_CONST = {
        'awaiting': 'AWAITING',
        'accepted': 'ACCEPTED',
        'rejected': 'REJECTED',
        'delivery': 'DELIVERY',
        'delivered': 'DELIVERED'
    };
    const Statuses = [
        { value: STATUS_CONST.awaiting, label: "En attente" },
        { value: STATUS_CONST.accepted, label: "Accepté" },
        { value: STATUS_CONST.rejected, label: "Rejeté" },
        { value: STATUS_CONST.delivery, label: "En cours de Livraison" },
        { value: STATUS_CONST.delivered, label: "Livré" }
    ];

    let history = useHistory();

    const [isLoading, setIsLoading] = useState(true);

    // Nombre d'offres maximum par page
    const limit = 10;

    // State qui permet de donner le numéro de la page dynamiquement
    const [page, setPage] = useState(0);
    // State qui regroupe dans un tableau toutes les offres issues de la recherche filtrée
    const [offers, setOffers] = useState([]);
    // State qui permet de filtrer la recherche
    const [filter, setFilter] = useState("");
    // State qui permet de calculer le nombre de page maximum
    const [pageMax, setPageMax] = useState(0);

    // State qui permet de trier par prix
    const [sort, setSort] = useState("");
    const [StatusQuery, setStatusQuery] = useState("");

    const handlePageClick = (event) => {
        setPage(event.selected + 1);
    };

    var heading = [
        'Image',
        'Titre',
        'Prix',
        'Catégorie',
        'Date Création',
        'Propriétaire',
        'Status',
        'Actions'
    ];

    const fetchData = async () => {
        try {
            console.log("history?.location?.pathname :", history?.location?.pathname);
            // const isPending = history?.location?.pathname.includes("pending")
            const isDeleted = history?.location?.pathname.includes("deleted")
            // console.log("isPending: ", isPending);
            // const path = `${apiUrl}/offers/admin?enabled=${isDeleted ? false : true}&product_status=${isPending}&page=${page}&limit=${limit}&sort=${sort}&product_status=${StatusQuery}${filter}`;
            const path = `${apiUrl}/offers/admin?enabled=${isDeleted ? false : true}&page=${page}&limit=${limit}&sort=${sort}&product_status=${StatusQuery}${filter}`;
            const response = await axios.get(path);
            setOffers(response.data.offers);
            setPageMax(Math.ceil(Number(response.data.counter) / limit));
            setIsLoading(false);
            console.log("offers :", offers);
        } catch (error) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, [page, sort, StatusQuery, filter, apiUrl, setOffers]);

    const getProductStatus = (product_status) => {
        switch (product_status) {
            case "ACCEPTED": return "Accepté";
            case "REJECTED": return "Rejeté";
            case "DELIVERY": return "En cours de livraison";
            case "DELIVERED": return "Livré";
            case "AWAITING":
            default: return "En Attente";
        }
    }
    const editProduct = (productId) => {
        const path = `/offers/edit/${productId}`
        history.push(path)
    }
    const deleteProduct = async (productId) => {
        const path = `${apiUrl}/offers/delete/${productId}`;
        const response = await axios.delete(path);
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
                            <h2 style={{ 'marginBottom': 'unset' }}>Liste articles</h2>
                            <button className="actionButton editButton" onClick={() => history.push('publish')}>Ajouter Article</button>
                        </div>
                        <div className="file-select list" >
                            <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row-reverse" }}>
                                <OrderByProductStatus setStatusQuery={setStatusQuery} Statuses={Statuses} />
                                {offers?.length ? (<>
                                    <OrderByPrice setSort={setSort} sortDocLabel={"Prix"} />
                                </>) : ""}
                            </div>

                            {offers?.length ? (<>
                                <table className="desktop-article-list">
                                    <thead>
                                        <tr>
                                            {heading.map((head, index) => <th key={'heading-' + index}>{head}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {offers.map((product, index) => (
                                            <tr key={'body' + index}>
                                                <td width="10%">
                                                    {product?.img ?
                                                        <img className="listimg" src={apiUrl + '/documents/' + product.img} />
                                                        : "x"
                                                    }
                                                </td>
                                                <td>{product?.product_name}</td>
                                                <td>{product?.product_price}</td>
                                                <td>{product?.category?.title || 'Autre'}</td>
                                                <td>{Moment(product?.product_date).format('DD-MM-YYYY')}</td>
                                                <td>{product?.owner?.account?.username}</td>
                                                <td>{getProductStatus(product?.product_status)}</td>
                                                <td>
                                                    <button className="actionButton editButton" onClick={() => editProduct(product?._id)}>Modifier</button>
                                                    <button className="actionButton deleteButton" onClick={() => deleteProduct(product?._id)}>Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table></>)
                                : "Pas encore de données"
                            }



                            {offers?.length ? (<div className="mobile-article-list" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {offers.map((product, index) => (
                                    <div className="mobile-article-list-card" key={'body' + index}>
                                        <div className="card-img" width="10%">
                                            {product?.img ?
                                                <img className="listimg" src={apiUrl + '/documents/' + product.img} />
                                                : "x"
                                            }
                                        </div>
                                        <div className="card-info">
                                            <div className="product-name">{product?.product_name}</div>
                                            <div> <span className="card-label">Prix: </span> {product?.product_price}TND</div>
                                            <div><span className="card-label">Date: </span>{Moment(product?.product_date).format('DD-MM-YYYY')}</div>
                                            <div><span className="card-label">Utilisateur: </span>{product?.owner?.account?.username}</div>
                                            <div><span className="card-label">Status: </span>{getProductStatus(product?.product_status)}</div>
                                            <div className="mobile-card-footer">
                                                <button className="actionButton editButton" onClick={() => editProduct(product?._id)}>Modifier</button>
                                                <button className="actionButton deleteButton" onClick={() => deleteProduct(product?._id)}>Supprimer</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>)
                                : "Pas encore de données"}
                        </div>
                        {offers?.length ?
                            <div className="pages">
                                <div className="pages">
                                    <ReactPaginate
                                        previousLabel={page == 0 ? "" : "PREV"}
                                        nextLabel={offers?.length >= limit ? "NEXT" : ""}
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

export default ProductList;
