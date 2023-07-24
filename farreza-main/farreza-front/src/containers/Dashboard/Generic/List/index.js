import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Loader from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import OrderByPrice from "../../../../components/OrderByPrice";
import GoBackComponent from '../../../../components/backLink'

import "./index.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const GenericList = ({
    token,
    apiUrl,
    routeName,
    sortDocLabel,
    label,
    callToAction,
    pricing,
    ownerDetail,
    KeyValue,
    WithoutcallToAction,
    WithoutSort,
    iswishlist,
}) => {
    let history = useHistory();

    const [isLoading, setIsLoading] = useState(true);

    // Nombre de documents maximum par page
    const limit = 10;

    // State qui permet de donner le numéro de la page dynamiquement
    const [page, setPage] = useState(0);
    // State qui regroupe dans un tableau toutes les documents issues de la recherche filtrée
    const [docs, setDocs] = useState([]);
    // State qui permet de filtrer la recherche
    const [filter, setFilter] = useState("");
    // State qui permet de calculer le nombre de page maximum
    const [pageMax, setPageMax] = useState(0);

    // State qui permet de trier par prix
    const [sort, setSort] = useState("");

    const handlePageClick = (event) => {
        setPage(event.selected + 1);
    };

    var heading = [
        'Image',
        'Titre',
        pricing ? 'Prix' : null,
        ownerDetail ? 'Email' : null,
        ownerDetail ? 'Username' : null,
        ownerDetail ? 'Numéro de téléphone' : null,
        KeyValue ? 'Clé' : null,
        KeyValue ? 'Valeur' : null,
        routeName === "categories" ? "parent" : null,
        'Actions'
    ];

    const fetchData = async () => {
        try {
            const path = `${apiUrl}/${routeName}/admin?page=${page}&limit=${limit}&sort=${sort}${filter}`;
            const response = await axios.get(path);
            setDocs(response.data.docs);
            setPageMax(Math.ceil(Number(response.data.counter) / limit));
            setIsLoading(false);
            console.log("docs :", docs);
        } catch (error) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, [page, sort, filter, apiUrl, setDocs]);

    const getDocStatus = (docs_tatus) => {
        switch (docs_tatus) {
            case true: return "Publique";
            case false: default: return "Privée";
        }
    }
    const editDoc = (docId) => {
        const path = `/${routeName}/edit/${docId}`
        history.push(path)
    }
    const visitDoc = (docId) => {
        const path = `/offer/${docId}`
        history.push(path)
    }
    const deleteDoc = async (docId) => {
        const path = `${apiUrl}/${routeName}/delete/${docId}`;
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
                            <h2 style={{ 'marginBottom': 'unset' }}>{label}</h2>
                            {!WithoutcallToAction ?
                                <button className="actionButton editButton" onClick={() => history.push('publish')}>{callToAction}</button>
                                : null}
                        </div>
                        <div className="file-select list" >
                            {docs?.length ?
                                (<>
                                    {!WithoutSort ? (
                                        <OrderByPrice setSort={setSort} sortDocLabel={sortDocLabel} />
                                    ) : null}
                                    <table className="reclamations-table">
                                        <thead>
                                            <tr>
                                                {heading.filter(h => h).map((head, index) => <th key={'heading-' + index}>{head}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {docs.map((doc, index) => (
                                                <tr key={'body' + index}>
                                                    <td width="10%">

                                                        {(!iswishlist && doc?.img) || (iswishlist && doc?.offer?.img) ?
                                                            <img className="listimg" src={apiUrl + '/documents/' + (!iswishlist ? doc?.img : doc?.offer?.img)} />
                                                            : "N/A"
                                                        }
                                                    </td>
                                                    <td>{!iswishlist ? doc?.title : doc?.offer?.title}</td>
                                                    {pricing ? (
                                                        <td>{doc?.price} TND</td>
                                                    ) : null}
                                                    {ownerDetail ? (
                                                        <>
                                                            <td>{doc?.owner?.email} TND</td>
                                                            <td>{doc?.owner?.account?.username}</td>
                                                            <td>{doc?.owner?.account?.phone}</td>
                                                        </>
                                                    ) : null}
                                                    {KeyValue ? (
                                                        <>
                                                            <td>{doc?.key}</td>
                                                            <td>{doc?.value}</td>
                                                        </>
                                                    ) : null}
                                                    {routeName === "categories" ? (
                                                        <td>
                                                            {doc?.parentId?.title ? doc?.parentId?.title : "X"}
                                                        </td>
                                                    ) : null}
                                                    <td>
                                                        {!iswishlist ? (
                                                            <>
                                                                <button className="actionButton editButton mobile-btn" onClick={() => editDoc(doc?._id)}>Modifier</button>
                                                                {!KeyValue ?
                                                                    <button className="actionButton deleteButton mobile-btn" onClick={() => deleteDoc(doc?._id)}>Supprimer</button>
                                                                    : null}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <input className="actionButton editButton mobile-btn" type="button" onClick={() => visitDoc(doc?.offer?._id)} value="Visiter" />
                                                                <button className="actionButton deleteButton mobile-btn" onClick={() => deleteDoc(doc?._id)}>Supprimer</button>
                                                            </>

                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </>) : "Pas encore de données"}
                            {docs.map((doc, index) => (
                                <div className="mobile-reclamation-list-card" key={'body' + index}>
                                    <div className="card-img" width="10%">
                                        {doc?.img ?
                                            <img className="listimg" src={apiUrl + '/documents/' + doc.img} />
                                            : "x"
                                        }
                                    </div>
                                    <div className="card-info">
                                        <div className="product-name">{doc?.product_name}</div>
                                        {doc?.owner?.email ? <div> <span className="card-label">Email: </span> {doc?.owner?.email}</div> : null}
                                        {doc?.title ? <div> <span className="card-label">Title: </span> {doc?.title}</div> : null}
                                        {doc?.owner?.account?.username ? <div><span className="card-label">Username: </span>{doc?.owner?.account?.username}</div> : null}
                                        {doc?.owner?.account?.phone ? <div><span className="card-label">Téléphone: </span>{doc?.owner?.account?.phone}</div> : null}
                                        <div className="mobile-card-footer">
                                            <button className="actionButton editButton" onClick={() => editDoc(doc?._id)}>Modifier</button>
                                            <button className="actionButton deleteButton" onClick={() => deleteDoc(doc?._id)}>Supprimer</button>
                                        </div>
                                    </div>
                                </div>))}
                        </div>
                        {docs?.length ?
                            (<>
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
                            </>) : null}
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

export default GenericList;
