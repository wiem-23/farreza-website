import React, { useState, useEffect } from "react";
import "./index.css";

const OrderByPrice = ({ setSort, sortDocLabel }) => {
  const [select, setSelect] = useState("");
  useEffect(() => {
    setSort(select);
  }, [select, setSort]);

  return (
    <div className="orderBy">
      <select
        value={select}
        onChange={(ev) => {
          setSelect(ev.target.value);
        }}
      >
        <option value="">Trier par {sortDocLabel}</option>
        <option value="asc">{sortDocLabel} croissant</option>
        <option value="desc">{sortDocLabel} décroissant</option>
      </select>
    </div>
  );
};

export default OrderByPrice;
