import React, { useState, useEffect } from "react";
import "./index.css";

const OrderByProductStatus = ({ setStatusQuery, Statuses }) => {
  const [select, setSelect] = useState("");
  useEffect(() => {
    setStatusQuery(select);
  }, [select, setStatusQuery]);

  return (
    <div className="orderBy" >
      <select
        value={select}
        onChange={(ev) => {
          setSelect(ev.target.value);
        }}
      >
        <option value="">Trier par status</option>
        {Statuses?.length ? Statuses.map((s, i) => (
          <option key={i} value={s.value}>{s.label}</option>
        )) : null}
      </select>
    </div>
  );
};

export default OrderByProductStatus;
