import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import LoginForm from "../component/loginForm";

export const Login = props => {

	return (
		<div className="jumbotron">
			<LoginForm />
		</div>
	);
};

Single.propTypes = {
	match: PropTypes.object
};
