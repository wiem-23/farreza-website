import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Cookies from "js-cookie";
import "./App.css";

// Containers
import Home from "./containers/Home";
import Search from "./containers/Search";
import Payment from "./containers/Payment";
import Item from "./containers/Item";
import Dashboard from "./containers/Dashboard";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
//Product
import ProductPublish from "./containers/Dashboard/Product/Publish";
import ProductList from "./containers/Dashboard/Product/List";
import ProductEdit from "./containers/Dashboard/Product/Edit";
//Brand
import GenericPublish from "./containers/Dashboard/Generic/Publish";
import GenericList from "./containers/Dashboard/Generic/List";
import GenericEdit from "./containers/Dashboard/Generic/Edit";
// Components
import Header from "./components/Header";

// Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSearch,
  faTimes,
  faStar,
  faChevronRight,
  faBars,
  faCaretDown,
  faUpload,
  faChevronLeft,
  faShieldAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import MobileMenu from "./components/MobileMenu";
import axios from "axios";
import OrderList from "./containers/Dashboard/Order/List";
import OrderEdit from "./containers/Dashboard/Order/Edit";
import GeneralConditions from "./containers/Conditions";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

library.add(
  faSearch,
  faTimes,
  faStar,
  faChevronRight,
  faBars,
  faCaretDown,
  faUpload,
  faChevronRight,
  faChevronLeft,
  faShieldAlt,
  faInfoCircle
);

function App() {
  const [token, setToken] = useState(Cookies.get("tokenUser") || null);

  // Modal du menu mobile
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userRole, setUserRole] = useState("");

  // State qui regroupe dans un tableau toutes les offres issues de la recherche filtrée
  const [offers, setOffers] = useState([]);

  // State qui permet de filtrer la recherche
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // API du backend
  // /const apiUrl = "https://farreza.com:5000";
  const apiUrl = "http://127.0.0.1:4000";

  const setUser = (tokenToSet) => {
    if (tokenToSet) {
      Cookies.set("tokenUser", tokenToSet, { expires: 20 });
      setToken(tokenToSet);
    } else {
      Cookies.remove("tokenUser");
      setToken(null);
    }
  };
  const fetchUserRole = async () => {
    try {
      const path = `${apiUrl}/user/role`;
      const result = await axios.get(path)
      console.log("result :", result.data)
      if (result?.data?.role) {
        console.log("result.data.role :", result.data.role);
        setUserRole(result.data.role)
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }

  useEffect(async () => {
    window.process = {
      ...window.process,
    };
    console.log("window.process :", window.process);
  }, []);

  useEffect(async () => {
    console.log("token : ", token);
    if (token) {
      await fetchUserRole()
    }
  }, [token]);

  const [categories, setCategories] = useState([]);
  const fetchCategoriesData = async () => {
    try {
      const path = `${apiUrl}/categories/admin/parent`;
      const response = await axios.get(path);
      setCategories(response.data.docs);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchCategoriesData();
  }, [apiUrl, token, setCategories]);

  return (
    <>
      <Router>
        <Header
          setUser={setUser}
          token={token}
          setMobileMenu={setMobileMenu}
          mobileMenu={mobileMenu}
          apiUrl={apiUrl}
          setFilter={setFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
        />

        {mobileMenu && (
          <MobileMenu
            token={token}
            setMobileMenu={setMobileMenu}
            setUser={setUser}
          />
        )}

        <Switch>
          <Route path="/cgu">
            <GeneralConditions />
          </Route>
          <Route path="/search">
            <Search
              offers={offers}
              setOffers={setOffers}
              filter={filter}
              setCategoryFilter={setCategoryFilter}
              categoryFilter={categoryFilter}
              apiUrl={apiUrl}
              categories={categories}
              mobileMenu={mobileMenu}
            />
          </Route>
          <Route path="/offer/:id">
            <Item apiUrl={apiUrl} routeName={"offers"} />
          </Route>
          <Route path="/subscriptions/detail/:id">
            <Item apiUrl={apiUrl} routeName={"subscriptions"} />
          </Route>
          <Route path="/payment/:routeName/:id">
            {token ? <Payment apiUrl={apiUrl} /> : <Redirect to="/login" />}
          </Route>
          <Route path="/signup">
            <SignUp setUser={setUser} apiUrl={apiUrl} />
          </Route>
          <Route path="/login">
            <Login setUser={setUser} setUserRole={setUserRole} apiUrl={apiUrl} />
          </Route>
          {/* Product Routes */}
          <Route exact path="/product/publish">
            <ProductPublish token={token} apiUrl={apiUrl} />
          </Route>
          <Route exact path="/offers/edit/:id">
            <ProductEdit token={token} apiUrl={apiUrl} userRole={userRole} />
          </Route>
          <Route exact path="/product/edit/:id">
            <ProductEdit token={token} apiUrl={apiUrl} userRole={userRole} />
          </Route>
          <Route exact path="/product/list">
            <ProductList token={token} apiUrl={apiUrl} />
          </Route>
          <Route exact path="/product/pending/list">
            <ProductList token={token} apiUrl={apiUrl} />
          </Route>
          <Route exact path="/product/deleted/list">
            <ProductList token={token} apiUrl={apiUrl} />
          </Route>
          {/* Product Routes */}

          {/* Brand Routes */}
          <Route exact path="/brands/publish">
            <GenericPublish token={token} apiUrl={apiUrl} label={"Marque"} routeName={"brands"} />
          </Route>
          <Route exact path="/brands/edit/:id">
            <GenericEdit token={token} apiUrl={apiUrl} label={"Marque"} routeName={"brands"} />
          </Route>
          <Route exact path="/brands/list">
            <GenericList token={token} apiUrl={apiUrl} label={"Liste des Marques"} callToAction={"Ajouter Marque"} routeName={"brands"} sortDocLabel={"Titre"} />
          </Route>
          {/* Brand Routes */}
          {/* Category Routes */}
          <Route exact path="/categories/publish">
            <GenericPublish token={token} apiUrl={apiUrl} label={"Categorie"} routeName={"categories"} />
          </Route>
          <Route exact path="/categories/edit/:id">
            <GenericEdit token={token} apiUrl={apiUrl} label={"Categorie"} routeName={"categories"} />
          </Route>
          <Route exact path="/categories/list">
            <GenericList token={token} apiUrl={apiUrl} label={"Liste des categories"} callToAction={"Ajouter categorie"} routeName={"categories"} sortDocLabel={"Titre"} />
          </Route>
          {/* Category Routes */}
          {/* Color Routes */}
          <Route exact path="/colors/publish">
            <GenericPublish token={token} apiUrl={apiUrl} label={"Couleur"} routeName={"colors"} />
          </Route>
          <Route exact path="/colors/edit/:id">
            <GenericEdit token={token} apiUrl={apiUrl} label={"Couleur"} routeName={"colors"} />
          </Route>
          <Route exact path="/colors/list">
            <GenericList token={token} apiUrl={apiUrl} label={"Liste des couleurs"} callToAction={"Ajouter couleur"} routeName={"colors"} sortDocLabel={"Titre"} />
          </Route>
          {/* Color Routes */}
          {/* Wishlist Routes */}
          <Route exact path="/wishs/list">
            <GenericList token={token} apiUrl={apiUrl} label={"Wishlist"} WithoutcallToAction={true} WithoutSort={true} iswishlist={true} routeName={"wishs"} />
          </Route>
          {/* Wishlist Routes */}
          {/* Parameter Routes */}
          <Route exact path="/parameters/edit/:id">
            <GenericEdit token={token} apiUrl={apiUrl} label={"Parametre"} routeName={"parameters"} KeyValue={true} />
          </Route>
          <Route exact path="/parameters/list">
            <GenericList
              token={token}
              apiUrl={apiUrl}
              label={"Liste des parametres"}
              callToAction={"Ajouter un parametre"}
              routeName={"parameters"}
              sortDocLabel={"Titre"}
              KeyValue={true}
              WithoutcallToAction={true}
            />
          </Route>
          {/* Parameter Routes */}
          {/* Reclamation Routes */}
          <Route exact path="/reclamations/publish">
            <GenericPublish token={token} apiUrl={apiUrl} label={"Reclamation"} routeName={"reclamations"} describing={true} ownerDetail={true} />
          </Route>
          <Route exact path="/reclamations/edit/:id">
            <GenericEdit token={token} apiUrl={apiUrl} label={"Reclamation"} routeName={"reclamations"} describing={true} ownerDetail={true} />
          </Route>
          <Route exact path="/reclamations/list">
            <GenericList
              token={token}
              apiUrl={apiUrl}
              label={"Liste des reclamations"}
              callToAction={"Ajouter une reclamation"}
              routeName={"reclamations"}
              sortDocLabel={"Titre"}
              ownerDetail={true}
            />
          </Route>
          {/* Reclamation Routes */}
          {/* transaction Routes */}
          <Route exact path="/transactions/publish">
            <GenericPublish token={token} apiUrl={apiUrl} label={"Transaction"} routeName={"transactions"} pricing={true} />
          </Route>
          <Route exact path="/transactions/edit/:id">
            <GenericEdit token={token} apiUrl={apiUrl} label={"Transaction"} routeName={"transactions"} pricing={true} />
          </Route>
          <Route exact path="/transactions/list">
            <GenericList
              token={token}
              apiUrl={apiUrl}
              label={"Liste des transactions"}
              callToAction={"Ajouter une transaction"}
              routeName={"transactions"}
              sortDocLabel={"Titre"}
              pricing={true}
            />
          </Route>
          {/* transaction Routes */}
          {/* Subscription Routes */}
          <Route exact path="/subscriptions/publish">
            <GenericPublish token={token} apiUrl={apiUrl} label={"Abonnement"} routeName={"subscriptions"} pricing={true} describing={true} />
          </Route>
          <Route exact path="/subscriptions/edit/:id">
            <GenericEdit token={token} apiUrl={apiUrl} label={"Abonnement"} routeName={"subscriptions"} pricing={true} describing={true} />
          </Route>
          <Route exact path="/subscriptions/list">
            <GenericList
              token={token}
              apiUrl={apiUrl}
              label={"Liste des abonnements"}
              callToAction={"Ajouter un abonnement"}
              routeName={"subscriptions"}
              sortDocLabel={"Titre"}
              pricing={true}
            />
          </Route>
          {/* Subscription Routes */}
          {/* Order Routes */}
          <Route exact path="/commandes/:type/list">
            <OrderList token={token} apiUrl={apiUrl} userRole={userRole} />
          </Route>
          <Route exact path="/commandes/edit/:type/:id">
            <OrderEdit token={token} apiUrl={apiUrl} userRole={userRole} label={"Modifier ta Commande"} routeName={"orders"} />
          </Route>
          {/* Order Routes */}
          <Route exact path="/dashboard">
            <Dashboard token={token} apiUrl={apiUrl} userRole={userRole} />
          </Route>
          <Route path="/">
            <Home
              offers={offers}
              setOffers={setOffers}
              filter={filter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              apiUrl={apiUrl}
              categories={categories}
            />
          </Route>
        </Switch>
      </Router>
      <ToastContainer closeButton={false} position="bottom-right" />
    </>
  );
}

export default App;
