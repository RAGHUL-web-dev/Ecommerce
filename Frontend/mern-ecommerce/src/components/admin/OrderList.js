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
import { clearError, createOrderDeleted } from "../../slices/orderSlice";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import Loader from "../layouts/Loader";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions";

export default function OrderList(){
  const { adminOrders = [], loading = true, error, isOrderDeleted } = useSelector(state => state.orderState);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onOpen: () => dispatch(clearError())
      });
    }

    if (isOrderDeleted) {
      toast.success("Order deleted successfully", {
        position: "bottom-center",
        onOpen: () => dispatch(createOrderDeleted())
      });
    }

    dispatch(adminOrdersAction());
  }, [dispatch, error, isOrderDeleted]);

  if (loading) return <Loader />;

  const filteredOrders = adminOrders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.user && order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar/>
      </div>
      <div className="col-12 col-md-10">
        <div className="col-12 col-md-10">
          <h1 className="my-4">Order List</h1>
          <Fragment>
            <MDBRow className='mt-4 mb-3'>
              <MDBCol size='12' md='6'>
                <MDBInput
                  label='Search Orders'
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
                  <th>Number of Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.orderItems?.length || 0}</td>
                    <td>${order.totalPrice}</td>
                    <td> <p style={{color: order.orderStatus.includes("Processing") ? "red" : "green"}}>{order.orderStatus}</p></td>
                    <td>
                      <Link to={`/admin/order/${order._id}`} className="btn btn-primary btn-sm">
                        <i className="fa fa-edit"></i>
                      </Link>
                      <MDBBtn 
                        color="danger" 
                        size="sm" 
                        className="ml-2"
                        onClick={(e) => deleteHandler(e, order._id)}
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
