import { Fragment, useEffect } from "react";
import { 
  MDBTable, 
  MDBTableHead, 
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBSpinner
} from 'mdb-react-ui-kit';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userOrders as userOrdersActions } from "../../actions/orderActions";

export default function UserOrders() {
    const { userOrders = [], loading } = useSelector(state => state.orderState);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userOrdersActions());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <MDBSpinner className="me-2" />
                Loading your orders...
            </div>
        );
    }

    if (userOrders.length === 0) {
        return (
            <div className="alert alert-info mt-5">
                You haven't placed any orders yet.
            </div>
        );
    }

    return (
        <Fragment>
            <MDBRow className='mt-5'>
                <MDBCol>
                    <h1>My Orders</h1>
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
                    {userOrders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.orderItems?.length || 0}</td>
                            <td>${order.totalPrice?.toFixed(2) || '0.00'}</td>
                            <td style={{
                                color: order.orderStatus?.includes('Delivered') 
                                    ? 'green' 
                                    : 'red'
                            }}>
                                {order.orderStatus || 'Processing'}
                            </td>
                            <td>
                                <Link 
                                    to={`/order/${order._id}`} 
                                    className="btn btn-primary btn-sm"
                                >
                                    <i className="fa fa-eye"></i> View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </Fragment>
    );
}   