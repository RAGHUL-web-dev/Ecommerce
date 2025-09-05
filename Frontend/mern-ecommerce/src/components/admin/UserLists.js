import { useDispatch, useSelector } from "react-redux";
import { 
  MDBTable, 
  MDBTableHead, 
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput
} from 'mdb-react-ui-kit';
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { clearError, clearDeltedUser } from "../../slices/userSlice";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import Loader from "../layouts/Loader";
import { deleteUser, getUsers} from "../../actions/userActions";

export default function UserList(){
    const { users=[], loading = true, error, isUserDeleted } = useSelector(state => state.userState);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteUser(id));
    };

    useEffect(() => {
        if (error) {
        toast.error(error, {
            position: "bottom-center",
            onOpen: () => dispatch(clearError())
        });
        }

        if (isUserDeleted) {
        toast.success("User deleted successfully", {
            position: "bottom-center",
            onOpen: () => dispatch(clearDeltedUser())
        });
        }

        dispatch(getUsers());
    }, [dispatch, error, isUserDeleted]);

    if (loading) return <Loader />;

    const filteredUsers = users.filter(user =>
        user._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar/>
      </div>
      <div className="col-12 col-md-10">
        <div className="col-12 col-md-10">
          <h1 className="my-4">Users List</h1>
          <Fragment>
            <MDBRow className='mt-4 mb-3'>
              <MDBCol size='12' md='6'>
                <MDBInput
                  label='Search Users'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type='text'
                  className='w-100'
                />
              </MDBCol>
            </MDBRow>

            <MDBTable responsive striped bordered hover>
              <MDBTableHead>
                <tr>
                  <th>Order ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {filteredUsers.map(user => (
                  <tr key={users._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Link to={`/admin/user/${user._id}`} className="btn btn-primary btn-sm">
                        <i className="fa fa-edit"></i>
                      </Link>
                      <MDBBtn 
                        color="danger" 
                        size="sm" 
                        className="ml-2"
                        onClick={(e) => deleteHandler(e, user._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </MDBBtn>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </Fragment>
        </div>
      </div>
    </div>
  );
}