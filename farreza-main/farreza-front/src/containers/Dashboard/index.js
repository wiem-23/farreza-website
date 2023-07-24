import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./index.css";

const Dashboard = ({ token, apiUrl, userRole }) => {

    let history = useHistory();
    const ParentRoutes = [
        { name: "Articles Déposés", route: "/product", roles: ["ADMIN"] },
        //  { name: "Mes Articles", route: "/product", roles: ["VENDOR"] },
        { name: "Commandes Articles", route: "/commandes/offers", roles: ["ADMIN"] },
        { name: "Mes Commandes Articles", route: "/commandes/offers", roles: ["VENDOR"] },
        { name: "Commandes Abonnements", route: "/commandes/subscriptions", roles: ["ADMIN"] },
        // { name: "Mes Commandes Abonnements", route: "/commandes/subscriptions", roles: ["VENDOR"] },
        { name: "Abonnements", route: "/subscriptions", roles: ["ADMIN"] },
        { name: "Transactions Déposées", route: "/transactions", roles: ["ADMIN"] },
        // { name: "Mes Transactions", route: "/transactions", roles: ["VENDOR"] },
        { name: "Favoris", route: "/wishs", roles: ["VENDOR"] },
        { name: "Marques", route: "/brands", roles: ["ADMIN"] },
        { name: "Categories", route: "/categories", roles: ["ADMIN"] },
        { name: "Reclamations Déposées", route: "/reclamations", roles: ["ADMIN"] },
        { name: "Mes Reclamations", route: "/reclamations", roles: ["VENDOR"] },
        { name: "Parametres", route: "/parameters", roles: ["ADMIN"] },
        // { name: "Couleurs", route: "/colors", roles: ["ADMIN"] }
    ]
    const [selctedRoutes, setSelctedRoutes] = useState([]);
    useEffect(async () => {
        console.log("userRole : ", userRole);
        if (userRole) {
            setSelctedRoutes(ParentRoutes.filter(x => x.roles.includes(userRole)))
        }
    }, [userRole]);

    const handleSubmit = async (index) => {
        try {
            console.log("index : ", index);
            if (index >= 0) {
                const path = `${selctedRoutes[index].route}/list`
                console.log("path :", path);
                history.push(path)
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return token ? (
        <>
            <section className="publish-section">
                <div>
                    <div style={{ display: 'flex' }}>
                        <p>Dashboard</p>
                    </div>
                    {selctedRoutes.map((route, index) => {
                        return (
                            <div key={index} className="file-select" onClick={() => handleSubmit(index)}>
                                <div className="dashed-preview-without">
                                    <h1>{route.name}</h1>
                                </div>
                            </div>
                        )

                    })}
                </div>
            </section>
        </>
    ) : (
        <Redirect
            to={{
                pathname: "/login",
                state: { fromDashboard: true },
            }}
        />
    );
};

export default Dashboard;
