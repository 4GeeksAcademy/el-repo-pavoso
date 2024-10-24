import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";

export const Demo = () => {
	const { store, actions } = useContext(Context);
  const navigate=useNavigate()

  useEffect(()=>{
    if(store.accessToken){
      actions.userInfo()
    }else{
      navigate("/login")
    }
  },[store.accessToken])

	return (
		<div className="container">
			<ul className="list-group">
				<p>{JSON.stringify(store.userInfo)}</p>
			</ul>
			<br />
			<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</div>
	);
};
