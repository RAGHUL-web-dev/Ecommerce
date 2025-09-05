import './App.css';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetails from './components/product/ProductDetails';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // required!
import ProductSearch from './components/product/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import store from "./Store"
import { useEffect, useState } from 'react';
import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtecedRoute from './components/route/ProtecedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPasswod from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import axios from 'axios';
import Payment from './components/cart/Payment';
import {Elements} from "@stripe/react-stripe-js"
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/cart/OrderSuccess';
import UserOrders from './components/orders/UserOrders';
import UserOrderDetails from './components/orders/UserOrderDetails';
import Dashboard from './components/admin/Dashboard';
import { useSelector } from 'react-redux';
import ProductsList from './components/admin/ProductsList';
import NewProducts from './components/admin/NewProducts';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import OrderUpdate from './components/admin/OrderUpdate';
import UserList from './components/admin/UserLists';
import UpdateUser from './components/admin/UpdateUser';
import ReviewsList from './components/admin/ReviewsList';

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("")
  const {isAuthenticated} = useSelector(state => state.authState)
  useEffect(() => {
    store.dispatch(loadUser)
    async function getStripeApiKey() {
      const {data} = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey)
    }
    getStripeApiKey()
  }, [])
  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header/>
          <div className='container container-fluid"'>
            <ToastContainer theme='dark'/>
              <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/product/:id' element={<ProductDetails/>}/>
                <Route path='/search/:keyword' element={<ProductSearch/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/myprofile' element={<ProtecedRoute><Profile/></ProtecedRoute>}/>
                <Route path='/myprofile/update' element={<ProtecedRoute><UpdateProfile/></ProtecedRoute>}/>
                <Route path='/myprofile/update/passowrd' element={<ProtecedRoute><UpdatePassword/></ProtecedRoute>}/>
                <Route path='/password/Forgot' element={<ForgotPasswod/>}/>
                <Route path='/password/reset/:token' element={<ResetPassword/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/shipping' element={<ProtecedRoute><Shipping/></ProtecedRoute>}/>
                <Route path='/order/confirm' element={<ProtecedRoute><ConfirmOrder/></ProtecedRoute>}/>
                <Route path='/order/success' element={<ProtecedRoute><OrderSuccess/></ProtecedRoute>}/>
                <Route path='/orders' element={<ProtecedRoute><UserOrders/></ProtecedRoute>}/>
                <Route path='/order/:id' element={<ProtecedRoute><UserOrderDetails/></ProtecedRoute>}/>
                
                { stripeApiKey && <Route path='/payment' element={<ProtecedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements></ProtecedRoute>}/> }

              </Routes>
          </div>
          <Routes>
            <Route path='/admin/dashboard' element={<ProtecedRoute isAdmin={true}><Dashboard/></ProtecedRoute>}/>
            <Route path='/admin/products' element={<ProtecedRoute isAdmin={true}><ProductsList/></ProtecedRoute>}/>
            <Route path='/admin/products/create' element={<ProtecedRoute isAdmin={true}><NewProducts/></ProtecedRoute>}/>
            <Route path='/admin/product/:id' element={<ProtecedRoute isAdmin={true}><UpdateProduct/></ProtecedRoute>}/>
            <Route path='/admin/orders' element={<ProtecedRoute isAdmin={true}><OrderList/></ProtecedRoute>}/>
            <Route path='/admin/order/:id' element={<ProtecedRoute isAdmin={true}><OrderUpdate/></ProtecedRoute>}/>
            <Route path='/admin/users' element={<ProtecedRoute isAdmin={true}><UserList/></ProtecedRoute>}/>
            <Route path='/admin/user/:id' element={<ProtecedRoute isAdmin={true}><UpdateUser/></ProtecedRoute>}/>
            <Route path='/admin/reviews' element={<ProtecedRoute isAdmin={true}><ReviewsList /></ProtecedRoute>}/>
          </Routes>
          <Footer/>
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
