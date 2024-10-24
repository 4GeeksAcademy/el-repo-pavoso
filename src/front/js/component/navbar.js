import React, {useContext} from "react";
import { Link } from "react-router-dom";
import LoginForm from "./loginForm";
import { Context } from '../store/appContext'

export const Navbar = () => {
  const {store,actions}=useContext(Context)
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				
        {store.accessToken?
          <div className="ml-auto">
            <Link to="/demo">
              <button className="btn btn-primary">User info</button>
            </Link>
            <button onClick={()=>actions.logoutUser()} className="btn btn-primary ms-3">Logout</button>
          </div>:
          <div className="nav-item dropdown">
              <button className="btn btn-primary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Login
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <LoginForm />
              </div>
          </div>
        }
			</div>
		</nav>
	);
};
