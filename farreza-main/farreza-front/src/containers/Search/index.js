import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./index.css";
// import { Link } from "react-router-dom";

// Components
import ProductItem from "../../components/ProductItem";
import OrderByPrice from "../../components/OrderByPrice";

const Search = ({ mobileMenu, offers, setOffers, apiUrl, filter, categoryFilter, setCategoryFilter, categories }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Nombre d'offres maximum par page
  const limit = 10;

  // State qui permet de donner le numéro de la page dynamiquement
  const [page, setPage] = useState(0);

  // State qui permet de calculer le nombre de page maximum
  const [pageMax, setPageMax] = useState(0);

  // State qui permet de trier par prix
  const [sort, setSort] = useState("");


  const [subscriptions, setSubscriptions] = useState([]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchOffers = async () => {
      try {
        const path = `${apiUrl}/offers?page=${page}&limit=${limit}&sort=${sort}${filter}&category=${categoryFilter}`
        const response = await axios.get(path);
        setOffers(response.data.offers);
        setPageMax(Math.ceil(Number(response.data.counter) / limit));

        setIsLoading(false);
      } catch (error) {
        console.error('fetch offers : error message :  ', error?.message)
      }
    };
    fetchOffers();
  }, [page, sort, filter, categoryFilter, apiUrl, setOffers]);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/subscriptions/users`
        );
        setSubscriptions(response?.data?.docs);
        console.log("getSubscriptions :", response?.data?.docs);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchSubs();
  }, [apiUrl]);

  return (
    <>
      {isLoading === true ? (
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
        <>
          <main>
            <div className="hero-banner">
              <span className="home-title">Fil d'actu </span>
            </div>
            {categories?.length ? (
              <div className="FilterByCategory">
                <select
                  value={categoryFilter}
                  onChange={(ev) => setCategoryFilter(ev.target.value)}>
                  <option value="">Voir Tout</option>
                  {
                    categories.map((s, i) => {
                      return (
                        <React.Fragment key={i}>
                          <option value={s._id}>- {s.title}</option>
                          {s?.children?.length ? s.children.map((sc, sci) => (
                            <option key={sci} value={sc._id}>-- {sc.title}</option>
                          )) : null}
                        </React.Fragment>
                      )
                    }
                    )
                  }

                </select>
              </div>
            ) : null}
            <OrderByPrice setSort={setSort} sortDocLabel={"Prix"} />
            <div className="products-section">
              <div className="products-container">
                <ProductItem offers={offers} apiUrl={apiUrl} />
              </div>
              <div className="product-pagination">
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
            </div>
          </main>
        </>
      )
      }
    </>
  );
};

export default Search;
