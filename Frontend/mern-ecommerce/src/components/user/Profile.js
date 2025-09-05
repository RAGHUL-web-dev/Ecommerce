import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

export default function Profile(){
    

    const {user} = useSelector(state => state.authState)
    return (
         <div className="row justify-content-around mt-5 user-info">
            <div className="col-12 col-md-3">
                <figure className='avatar avatar-profile'>
                    <img className="rounded-circle img-fluid" src={user.avatar ?? '/images/defaultImage.png'} alt='' />
                </figure>
                <Link to='/myprofile/update' href="#" id="edit_profile" className="btn btn-primary btn-block my-5">
                    Edit Profile
                </Link>
            </div>
     
            <div className="col-12 col-md-5">
                 <h4>Full Name</h4>
                 <p>{user.name}</p>
     
                 <h4>Email Address</h4>
                 <p>{user.email}</p>

                 <h4>Account Created</h4>
                 <p>{String(user.createdAt).substring(2, 10)}</p>

                 <Link to="/orders" href="javascript;" className="btn btn-danger btn-block mt-5">
                    My Orders
                </Link>

                <Link to='/myprofile/update/passowrd' className="btn btn-primary btn-block mt-3">
                    Change Password
                </Link>
            </div>
        </div>
    )
}