import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./index.css";

const GoBackComponent = () => {
    let history = useHistory();

    const goBack = async () => {
        console.log("Back");
        history.goBack()
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <p>
                <span onClick={() => goBack()} className="BackTextStyle">retour</span>
            </p>
        </div>
    );
};

export default GoBackComponent;
