import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "../views/defaultLayout";
import GuestLayout from "../views/guestLayout";
import Login from "../components/login";
import SignUp from "../components/signup";
import AddProduct from "../components/add_product";
import NotFound from "../components/notFound";
import Products from "../components/products";

const router = createBrowserRouter([
    {
        path : '/',
        element : <DefaultLayout />,
        children : [
            {
                path : '/',
                element : <Navigate to='/products' />
            },
            {
                path : '/addProduct',
                element : <AddProduct />
            },
            {
                path : '/products',
                element : <Products />
            },
            { 
                path : '/addProduct/:productId',
                element : <AddProduct />
            }
        ]
    },
    {
        path : '/',
        element : <GuestLayout />,
        children : [
            {
                path : '/login',
                element : <Login />
            },
            {
                path : '/signUp',
                element : <SignUp />
            }
        ]
    },
    {
        path : '*',
        element : <NotFound />
    }
])

export default router;