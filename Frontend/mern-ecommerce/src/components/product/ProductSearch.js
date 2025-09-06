import React, { Fragment, useEffect, useState } from "react";
import UrlName from "../layouts/UrlName"
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import Products from "../product/Products";
import { toast ,ToastPosition} from "react-toastify";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
// import "./paginate.css";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap.css'


export default function ProductSearch () {

    

    const dispatch = useDispatch();
    const { products, loading, error, productCount, resPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(0);
    const [price, setPrice] = useState([1, 1000])
    const [priceChange, setPriceChnage] = useState(price)
    const [category, setCategory] = useState(null)
    const [rating, setRating] = useState(0)
    const {keyword} = useParams()
    const categories = [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'Headphones',
        'food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]

    useEffect(() => {
        if(error){
            return toast.error(error, {
                position : "bottom-center"
            })
        }
        dispatch(getProducts(keyword, priceChange, category, rating, currentPage + 1))
    }, [error, dispatch, currentPage, keyword, priceChange, category, rating])

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    
    return (
        <Fragment>
            {loading ? <Loader/> : 
                <Fragment>
                    <UrlName title={"products"}/>
                    <h1 id="products_heading">Searched Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            <div className="col-6 col-md-3 mb-5 mt-5">
                                {/* pirce filter */}
                                <div className="px-5" onMouseUp={() => setPriceChnage(price)}>
                                    <Slider
                                        range={true}
                                        marks={
                                            {
                                                1 : "$1",
                                                1000 : "$1000"
                                            }
                                        }
                                        min = {1}
                                        max = {1000}
                                        defaultValue={price}
                                        onChange={(price) => {
                                            setPrice(price)
                                        }}
                                        handleRender={
                                            renderProps => {
                                                return (
                                                    <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                                        
                                                        <div{...renderProps.props}></div>
                                                    </Tooltip>
                                                )
                                            }
                                        }
                                    />
                                </div>
                                <hr className="my-5"/>
                                {/* category filter */}
                                <div className="mt-5">
                                    <h3 className="mb-3">Categories</h3>
                                    <ul className="pl-0">
                                        <li 
                                            style={{
                                                cursor: "pointer",
                                                listStyleType: "none",
                                                fontWeight: !category ? 'bold' : 'normal',
                                                color: !category ? '#3BB77E' : 'inherit',
                                                padding: "5px 0",
                                                borderLeft: !category ? "3px solid #3BB77E" : "none"
                                            }}
                                            onClick={() => setCategory(null)}
                                        >
                                            All Categories
                                        </li>
                                        {categories.map(cat =>
                                            <li 
                                                style={{
                                                    cursor: "pointer", 
                                                    listStyleType: "none",
                                                    fontWeight: category === cat ? 'bold' : 'normal',
                                                    color: category === cat ? '#3BB77E' : 'inherit',
                                                    padding: "5px 0",
                                                    borderLeft: category === cat ? "3px solid #3BB77E" : "none",
                                                    transition: "all 0.3s ease"
                                                }} 
                                                key={cat} 
                                                onClick={() => setCategory(category === cat ? null : cat)} // Toggle category
                                            >
                                                {cat}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <hr className="my-5"/>
                                {/* ratings filter */}
                                <div className="mt-5">
                                    <h3 className="mb-3">Ratings</h3>
                                    <ul className="pl-0">
                                        {[5, 4, 3, 2, 1].map(star => 
                                            <li style={{cursor:"pointer", listStyleType:"none"}} key={star} onClick={() => {setRating(star)}}>
                                                <div className="rating-outer">
                                                    <div className="rating-inner" style={{width : `${star*20}%`}}></div>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-6 col-md-8 ">
                                <div className="row">
                                    {products && products.map(product => (
                                        <Products col={4} key={product._id} product={product}/>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </section>

                    {productCount > 0 && productCount > resPerPage? 
                    <div className="d-flex justify-content center mt-5">
                        <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={Math.ceil(productCount / resPerPage)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={2}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            activeClassName={"active"}
                            forcePage={currentPage}
                        />
                    </div> : null}
                </Fragment>
            }
        </Fragment>
    )
}