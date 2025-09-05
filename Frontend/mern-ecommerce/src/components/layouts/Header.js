// import { Link } from "react-router-dom"
// import Search from "./Search"
// import { useSelector } from "react-redux"
// import Dropdown from 'react-bootstrap/Dropdown';
// import Image from 'react-bootstrap/Image';


// export default function Header (){

//     const {isAuthenticated, user} =  useSelector(state => state.authState)
    
//     return (
//         <nav className="navbar row">
//             <div className="col-12 col-md-3">
//                 <div className="navbar-brand">
//                     <Link to='/'>
//                         <img width="150px" src="/images/logo.png" />
//                     </Link>
//                 </div>
//             </div>

//             <div className="col-12 col-md-6 mt-2 mt-md-0">
//                 <Search/>
//             </div>

//             <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
//                 {isAuthenticated ? (
//                     <Dropdown className="d-inline">
//                         <Dropdown.Toggle variant="default text-white pr-5" id="dropdown-basic">
//                             <figure className="avatar avatar-nav">
//                                 <Image width="50px" src={user.avatar??'/default_avatar_img.png'}/>
//                             </figure>
//                             <span>{user.name}</span>
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu>
//                             <Dropdown.Item className="text-danger">Logout</Dropdown.Item>
//                         </Dropdown.Menu>
//                     </Dropdown> )
//                     : 
//                     <Link to="/login" className="btn" id="login_btn">Login</Link>
//                 }

//                 <span id="cart" className="ml-3">Cart</span>
//                 <span className="ml-1" id="cart_count">2</span>
//             </div>
//         </nav>
//     )
// }


import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { logoutUser } from "../../actions/userActions";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Header() {
    const { isAuthenticated, user } = useSelector(state => state.authState);
    const {items:cartItems} = useSelector(state => state.cartState)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = () => {
        dispatch(logoutUser)
    }

    // useEffect(() => {
    //     if(!isAuthenticated){
    //         toast.success("loggedout successfully", {
    //             type : 'success',
    //             position : 'bottom-center'
    //         })
    //     }
    // }, [isAuthenticated, dispatch])
    
    return (
        <nav className="navbar row">
            <div className="col-12 col-md-3">
                <div className="navbar-brand">
                    <Link to='/'>
                        <h1>Shop Now</h1>
                    </Link>
                </div>
            </div>

            <div className="col-12 col-md-6 mt-2 mt-md-0">
                <Search/>
            </div>

            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                {isAuthenticated ? 
                    <Dropdown className="d-inline">
                        <Dropdown.Toggle variant="default text-white pr-5" id="dropdown-basic">
                            <figure className="avatar avatar-nav">
                                <Image 
                                    width="50px" 
                                    src={user.avatar ?? '/images/defaultImage.png'}
                                    alt="avatar"
                                    roundedCircle
                                />
                            </figure>
                            <span>{user.name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            { user.role === "admin" && <Dropdown.Item as="button" className="text-dark" onClick={() => {navigate('/admin/dashboard')}}>
                                Dashboard
                            </Dropdown.Item> }
                            <Dropdown.Item as="button" className="text-dark" onClick={() => {navigate('/myprofile')}}>
                                Profile
                            </Dropdown.Item>
                            <Dropdown.Item as="button" className="text-dark" onClick={() => {navigate('/orders')}}>
                                Orders
                            </Dropdown.Item>
                            <Dropdown.Item as="button" className="text-danger" onClick={logoutHandler}>
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    : 
                    <Link to="/login" className="btn" id="login_btn">Login</Link>
                }

                <Link to="/cart" style={{textDecoration:"none"}}><span id="cart" className="ml-3">Cart</span></Link>
                <span className="ml-1" id="cart_count">{cartItems.length}</span>
            </div>
        </nav>
    );
}