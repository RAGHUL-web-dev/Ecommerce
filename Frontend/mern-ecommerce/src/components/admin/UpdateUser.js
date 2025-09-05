import { useState, useEffect } from "react";
import { getUser,  updateUser } from "../../actions/userActions";
import { clearUpdatedUser, clearError } from "../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Fragment } from "react";


export default function UpdateUser(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("")
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id: userId } = useParams()

    const { loading, isUserUpdated, error, user } = useSelector(state => state.userState);
    const { user : authUser } = useSelector(state => state.authState)


    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name)
        formData.append('email', email)
        formData.append('role', role)
        dispatch(updateUser(userId, formData))
    }

    const roles = [
        "Admin",
        "User"
    ]

    useEffect(() => {
        if (isUserUpdated) {
            toast("User Details updated successfully", {
                type: "success",
                position: "bottom-center",
                onOpen: () => dispatch(clearUpdatedUser())
            });
            navigate('/admin/users');
            return;
        }

        if (error) {
            toast.error(error, {
                position: "bottom-center",
                onOpen: () => dispatch(clearError())
            });
            return;
        }

        dispatch(getUser(userId));
    }, [dispatch, isUserUpdated, error, userId, navigate]);


    useEffect(() => {
        if (user._id) {
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
        }
    }, [user])

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                                <h1 className="mb-4">Update User Details</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Email</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="form-control"
                                    id="category_field"
                                    disabled={user._id === authUser._id} // disable for self-admin
                                >
                                    <option value="">Select</option>
                                    {roles.map((r, i) => (
                                        <option key={i} value={r}>{r}</option>
                                    ))}
                                </select>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'UPDATE'}
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </div>
    )
}