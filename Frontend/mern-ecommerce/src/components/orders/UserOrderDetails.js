import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { orderDetail as orderDetailAction } from "../../actions/orderActions";
import Loader from "../layouts/Loader";

export default function UserOrderDetails() {
    const { orderDetail, loading } = useSelector(state => state.orderState);
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(orderDetailAction(id));
    }, [dispatch, id]);

    if (loading) {
        return <Loader />;
    }

    if (!orderDetail) {
        return <div className="alert alert-info mt-5">Order not found</div>;
    }

    // Debug log to verify data structure
    console.log("Order Detail Data:", orderDetail);

    // Safely extract shipping info with defaults
    const shippingInfo = orderDetail.shippingInfo || {};
    const user = orderDetail.user || {};

    return (
        <Fragment>
            <div className="row d-flex justify-content-between">
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
            </div>
        </Fragment>
    );
}