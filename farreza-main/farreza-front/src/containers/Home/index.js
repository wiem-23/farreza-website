import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./index.css";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Components
import ProductItem from "../../components/ProductItem";
import HomeItem from "../../components/HomeItem";
import OrderByPrice from "../../components/OrderByPrice";
import HeroBanner from "../../components/HeroBanner/index";

const Home = ({ offers, setOffers, apiUrl, filter, categoryFilter, setCategoryFilter, categories }) => {
  let history = useHistory();

  const [isLoading, setIsLoading] = useState(true);

  // Nombre d'offres maximum par page
  const limit = 16;

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

  const handleCategoryMobile = (categoryId) => {
    setCategoryFilter(categoryId)
    history.push("/search")
  }

  return (
    <>
      <HeroBanner />
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
            {subscriptions?.length ?
              (<>
                <div style={{ width: '100%', marginTop: '10px' }}>
                  <span className="home-title">Abonnements</span>
                </div>
                <div className="subscriptions">
                  <HomeItem docs={subscriptions} apiUrl={apiUrl} routeName="subscriptions" />
                </div>
              </>
              ) : null}
            <div style={{ width: '100%', marginTop: '10px' }}>
              <span className="home-title category-title">Catégories</span>
              <div className="categories-container">
                {categories?.length ? categories.map((categ, i) => (
                  <React.Fragment key={"index-categ" + i}>
                    <div onClick={() => handleCategoryMobile(categ._id)} className="category-content" >
                      <div className="category-img">
                        <img src={apiUrl + '/documents/' + categ?.img} />
                      </div>
                      <span className="category-name">{categ?.title}</span>
                    </div>
                  </React.Fragment>
                )) : null}
              </div>
            </div>
            {/* <div style={{ width: '100%', marginTop: '10px' }}>
              <span className="home-title">Nouvelle Arrivage </span>
            </div>
            <div className="orderBy">
              <Link className="order-by-login-signup" to="/search">
                Voir Tout</Link>
            </div> */}
            <div className="products-section">
              <div className="products-container">
                <ProductItem offers={offers} apiUrl={apiUrl} />
              </div>
            </div>
          </main>
        </>
      )
      }
    </>
  );
};

export default Home;
