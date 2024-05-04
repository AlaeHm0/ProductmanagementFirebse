import React from "react"
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../helpers/context";
import { useFirebase } from "../helpers/firebaseConfig";
import 'firebase/compat/auth';
import { useAuthState } from "react-firebase-hooks/auth";
const auth = useFirebase.auth()
function DefaultLayout () {
    const { token, setToken } = useStateContext();
    const [authState] = useAuthState(auth) 
    if(!token){
        return <Navigate to='/login' />
    }
    
    const handleLogOut = async () => {
      try {
        await auth.signOut()
        setToken('')
      }catch(err){
        console.error(err)
      }
    }
  
  return (
    <>
      <nav className="navbar navbar-expand-sm p-3 mb-4"  style={{backgroundColor: "lightblue"}}>
        <div className="container-fluid">
          <span className="navbar-brand">{authState && authState.displayName}</span>
          <button className="navbar-toggler" type="button" data-bs-toggler="collapse" data-bs-target='#mynavbar'>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mynavbar">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to='/products' className="nav-link">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to='/addProduct'>Add Product</Link>
              </li>
            </ul>
            <div className="d-flex">
              <button className="btn btn-danger" onClick={handleLogOut}>Sign Out <i className="fa fa-right-from-bracket"></i></button>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  )
};

export default DefaultLayout;
