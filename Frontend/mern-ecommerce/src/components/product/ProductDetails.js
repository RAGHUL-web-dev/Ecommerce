import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fragment } from "react/jsx-runtime";
import { createReview, getProduct } from "../../actions/productActions";
import { useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import { Carousel } from 'react-responsive-carousel';
import { toast } from "react-toastify";
import { addCartItem } from "../../actions/cartActions";
import {Modal} from 'react-bootstrap';
import { createReviewSubmitted, clearError } from "../../slices/productSlice";
import ProductReview from "./ProductReview";


export default function ProductDetails(){
    const dispatch = useDispatch()
    const { id } = useParams()
    const { product = {}, loading, isReviewSubmitted, error} = useSelector((state) => state.productState) 
    const { user } = useSelector(state => state.authState)
    const [qunatity, setQuantity] = useState(1)
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const increaseQty = () => {
        const count = document.querySelector('.count')
        if(product.stock ==1 && count.valueAsNumber >= product.stock){
            return;
        }

        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }

    const decreaseQty = () => {
        const count = document.querySelector('.count')
        if(count.valueAsNumber === 1){
            return;
        }

        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }

    const onCLickHandler = () => {
        if(product.stock===0){
            toast("Product is out of stock", {
                type : 'error',
                position : 'bottom-center'
            })
        }
        
    }

    const submitHandler = () => {
        const formData = new FormData()
        formData.append('rating', rating)
        formData.append('comment', comment)
        formData.append('productId', id)
        dispatch(createReview(formData))
    }

    useEffect(() => {

        if(isReviewSubmitted){
            handleClose()
            toast.success("Review added successfully", {
                type : 'success',
                position : 'bottom-center',
                onOpen : () => dispatch(createReviewSubmitted())
            })
        }

        if(error){
            toast.error(error, {
                type : "error",
                position : "bottom-center",
                onOpen : () => dispatch(clearError())
            })
        }

        if(!product._id || isReviewSubmitted){
            dispatch(getProduct(id))
        }


        dispatch(getProduct(id))
    }, [dispatch, id, isReviewSubmitted, error])
    return(
        <Fragment>
           {loading ? <Loader/> : 
            <Fragment>
                <div className="row f-flex justify-content-around">
                    <div className="col-12 col-lg-5 img-fluid" id="product_image">

                        {Array.isArray(product.images) && product.images.length > 0 && (
                            <div className="product-carousel">
                                <Carousel
                                showArrows={true}
                                showThumbs={true}
                                showStatus={false}
                                showIndicators={true}
                                infiniteLoop={true}
                                autoPlay={true}
                                interval={4000}
                                stopOnHover={true}
                                swipeable={true}
                                emulateTouch={true}
                                dynamicHeight={false}
                                transitionTime={700}
                                >
                                {product.images.map((image) => (
                                    <div key={image._id} className="carousel-image-container">
                                    <img
                                        src={image.image}
                                        alt={product.name}
                                        className="carousel-image"
                                    />
                                    </div>
                                ))}
                                </Carousel>
                            </div>
                        )}

                        
                    </div>

                    <div className="col-12 col-lg-5 mt-5">
                        <h3>{product.name}</h3>
                        <p id="product_id">Product # {product._id}</p>

                        <hr/>

                        <div className="rating-outer">
                            <div className="rating-inner" style={{width : `${product.ratings/5*100}%`}}></div>
                        </div>
                        <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                        <hr/>

                        <p id="product_price">${product.price}</p>
                        <div className="stockCounter d-inline">
                            <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                            <input type="number" className="form-control count d-inline" value={qunatity} readOnly />

                            <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                        </div>
                        <button type="button" id="cart_btn"  onClick={() => {dispatch(addCartItem(product._id, qunatity))

                            toast("Product is added to the cart successfully", {
                                type : "success",
                                position : "bottom-center"
                            })
                        }} className="btn btn-primary d-inline ml-4">Add to Cart</button>

                        <hr/>

                        <p>Status: <span className={product.stock > 0 ? "greenColor" : "redColor"} id="stock_status">{product.stock > 0 ? "In Stock" : "OutOf Stock"}</span></p>

                        <hr/>

                        <h4 className="mt-2">Description:</h4>
                        <p>{product.description}</p>
                        <hr/>
                        <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                        { user ? 
                            <button onClick={handleShow} id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                        Submit Your Review
                            </button> :
                            <div className="alert alert-danger mt-5 rounded">
                                Login to Post Review
                            </div>
                        }
                

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Submit Review</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ul className="stars" >
                                    {
                                        [1, 2, 3, 4, 5].map((star) => (
                                            <li style={{listStyle : "none"}} value={star} onClick={() => setRating(star)} className={`star ${star<=rating?'orange' : ""}`} onMouseOver={(e) => e.target.classList.add("yellow")} onMouseOut={(e) => e.target.classList.remove("yellow")}><i className="fa fa-star"></i></li>
                                        ))
                                    }
                                
                                </ul>
                                <textarea  onChange={(e) => setComment(e.target.value)} name="review" id="review" className="form-control mt-3"></textarea>
                                <button disabled={loading} onClick={submitHandler} className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                            </Modal.Body>
                            {/* <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                                Save Changes
                            </Button>
                            </Modal.Footer> */}
                        </Modal>
                    </div>

                </div>
                {product.reviews && product.reviews.length > 0 ? 
                    <ProductReview reviews={product.reviews}/> : null
                }
            </Fragment>
           } 
        </Fragment>

    
    )
}