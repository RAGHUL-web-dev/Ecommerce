import Sidebar from "./Sidebar"
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, UpdateProduct as updateProductAction } from "../../actions/productActions";
import { orderDetail as orderDetailAction, updateOrder as updateOrderAction } from "../../actions/orderActions"
import { toast } from 'react-toastify'
import { clearError, createOrderUpdated } from "../../slices/orderSlice";
import { Link } from "react-router-dom";


export default function OrderUpdate(){
    
    
    const { loading, isOrderUpdated, error, orderDetail = [] } = useSelector(state => state.orderState);
    const {user = {}, orderItems = [], shippingInfo = {}, totalPrice = 0, paymentInfo = {}} = orderDetail;
    const isPaid = paymentInfo.status === "succeeded" ? true : false;
    const [ orderStatus, setOrderStatus] = useState("Processing")
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id: orderId } = useParams()

    const submitHandler = (e) => {
        e.preventDefault();
        const orderData = {};
        orderData.orderStatus = orderStatus;
        dispatch(updateOrderAction(orderId, orderData))
    }


    useEffect(() => {
        if (isOrderUpdated) {
            toast("Order updated successfully", {
                type: "success",
                position: "bottom-center",
                onOpen: () => dispatch(createOrderUpdated())
            });
            navigate('/admin/orders');
            return;
        }

        if (error) {
            toast.error(error, {
                position: "bottom-center",
                onOpen: () => dispatch(clearError())
            });
            return;
        }

        dispatch(orderDetailAction(orderId));
    }, [dispatch, isOrderUpdated, error, orderId, navigate]);

    useEffect(() => {
        if (orderDetail._id) {
            setOrderStatus(orderDetail.orderStatus)
        }
    }, [orderDetail])

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="row d-flex justify-content-around">
                            <div className="col-12 col-lg-8 mt-5 order-details">
                                <h1 className="my-5">Order # {orderDetail._id || 'N/A'}</h1>

                                <h4 className="mb-4">Shipping Info</h4>
                                <p><b>Name:</b> {user.name || 'Not provided'}</p>
                                <p><b>Phone:</b> {shippingInfo.phoneNo || 'Not provided'}</p>
                                <p className="mb-4">
                                    <b>Address:</b> {[
                                        shippingInfo.address,
                                        shippingInfo.city,
                                        shippingInfo.postalCode,
                                        shippingInfo.country
                                    ].filter(Boolean).join(', ') || 'Address not provided'}
                                </p>

                                <p><b>Amount:</b> ${orderDetail.totalPrice?.toFixed(2) || '0.00'}</p>

                                <hr />

                                <h4 className="my-4">Payment</h4>
                                <p className={orderDetail.paymentInfo?.status === "succeeded" ? "text-success" : "text-danger"}>
                                    <b>{orderDetail.paymentInfo?.status === "succeeded" ? "PAID" : "NOT PAID"}</b>
                                </p>

                                <h4 className="my-4">Order Status:</h4>
                                <p className={orderDetail.orderStatus?.includes('Delivered') ? "text-success" : "text-danger"}>
                                    <b>{orderDetail.orderStatus || 'Processing'}</b>
                                </p>

                                <h4 className="my-4">Order Items:</h4>
                                <hr />
                                <div className="cart-item my-1">
                                    {(orderDetail.orderItems || []).map((item, index) => (
                                        <div className="row my-5" key={index}>
                                            <div className="col-4 col-lg-2">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    height="45" 
                                                    width="65" 
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <div className="col-5 col-lg-5">
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </div>
                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p>${item.price?.toFixed(2)}</p>
                                            </div>
                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <p>{item.quantity} Piece(s)</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <hr />
                            </div>
                            <div className="col-12 col-lg-3 mt-5">
                                <h4 className="my-4">Order Status</h4>
                                <div className="form-group">
                                    <select className="form-control" onChange={(e) => setOrderStatus(e.target.value)}>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>
                                <button disabled={loading} onClick={submitHandler} className="btn btn-primary btn-block">Submit</button>
                            </div>
                        </div>
                    </Fragment>
                </div>
            </div>
        </div>
    )
}