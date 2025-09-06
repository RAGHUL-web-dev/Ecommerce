import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import Products from "../product/Products";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap.css';

export default function ProductSearch() {
    const dispatch = useDispatch();
    const { products, loading, error, productCount, resPerPage } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(0);
    const [price, setPrice] = useState([1, 1000]);
    const [priceChange, setPriceChange] = useState([1, 1000]);
    const [category, setCategory] = useState("");
    const [rating, setRating] = useState(0);
    const { keyword } = useParams();

    const categories = [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ];

    // Build query parameters
    const buildQueryParams = () => {
        const params = {
            page: currentPage + 1
        };

        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (rating > 0) params.rating = rating;
        if (priceChange[0] > 1) params['price[gte]'] = priceChange[0];
        if (priceChange[1] < 1000) params['price[lte]'] = priceChange[1];

        return params;
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "bottom-center"
            });
        }
        
        const queryParams = buildQueryParams();
        console.log("Dispatching with params:", queryParams);
        dispatch(getProducts(queryParams));
    }, [dispatch, error, currentPage, keyword, category, rating, priceChange]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleCategoryClick = (selectedCategory) => {
        console.log("Category selected:", selectedCategory);
        setCategory(selectedCategory === category ? "" : selectedCategory);
        setCurrentPage(0); // Reset to first page when filter changes
    };

    const handlePriceChange = (newPrice) => {
        setPrice(newPrice);
    };

    const handlePriceChangeComplete = (newPrice) => {
        setPriceChange(newPrice);
        setCurrentPage(0);
    };

    const clearFilters = () => {
        setPrice([1, 1000]);
        setPriceChange([1, 1000]);
        setCategory("");
        setRating(0);
        setCurrentPage(0);
    };

    return (
        <Fragment>
            {loading ? <Loader/> : 
                <Fragment>
                    <h1 id="products_heading">
                        {keyword ? `Search Results for "${keyword}"` : 'All Products'}
                    </h1>
                    
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {/* Filters Sidebar */}
                            <div className="col-12 col-md-3 mb-5">
                                <div className="card">
                                    <div className="card-header">
                                        <h5>Filters</h5>
                                        <button 
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={clearFilters}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    
                                    <div className="card-body">
                                        {/* Price Filter */}
                                        <div className="mb-4">
                                            <h6>Price Range</h6>
                                            <Slider
                                                range
                                                min={1}
                                                max={1000}
                                                value={price}
                                                onChange={handlePriceChange}
                                                onAfterChange={handlePriceChangeComplete}
                                                marks={{
                                                    1: '$1',
                                                    500: '$500',
                                                    1000: '$1000'
                                                }}
                                                handleRender={(renderProps) => (
                                                    <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                                        <div {...renderProps.props}></div>
                                                    </Tooltip>
                                                )}
                                            />
                                            <div className="text-center mt-2">
                                                ${price[0]} - ${price[1]}
                                            </div>
                                        </div>

                                        {/* Category Filter */}
                                        <div className="mb-4">
                                            <h6>Categories</h6>
                                            <div className="list-group">
                                                <button
                                                    type="button"
                                                    className={`list-group-item list-group-item-action ${!category ? 'active' : ''}`}
                                                    onClick={() => handleCategoryClick("")}
                                                >
                                                    All Categories
                                                </button>
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        type="button"
                                                        className={`list-group-item list-group-item-action ${category === cat ? 'active' : ''}`}
                                                        onClick={() => handleCategoryClick(cat)}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Rating Filter */}
                                        <div className="mb-4">
                                            <h6>Minimum Rating</h6>
                                            <div className="btn-group-vertical w-100">
                                                {[0, 1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        className={`btn ${rating === star ? 'btn-primary' : 'btn-outline-primary'}`}
                                                        onClick={() => {
                                                            setRating(star);
                                                            setCurrentPage(0);
                                                        }}
                                                    >
                                                        {star === 0 ? 'Any Rating' : `${star}+ Stars`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            <div className="col-12 col-md-9">
                                {/* Filter Summary */}
                                <div className="mb-3 p-3 bg-light rounded">
                                    <small className="text-muted">
                                        Showing {products?.length || 0} of {productCount} products
                                        {category && ` in ${category}`}
                                        {rating > 0 && ` with ${rating}+ stars`}
                                        {(priceChange[0] > 1 || priceChange[1] < 1000) && 
                                            ` priced $${priceChange[0]} - $${priceChange[1]}`
                                        }
                                    </small>
                                </div>

                                {/* Products */}
                                <div className="row">
                                    {products && products.length > 0 ? (
                                        products.map(product => (
                                            <Products col={4} key={product._id} product={product}/>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center py-5">
                                            <h4>No products found</h4>
                                            <p>Try adjusting your filters or search terms</p>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={clearFilters}
                                            >
                                                Clear All Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pagination */}
                    {productCount > 0 && productCount > resPerPage && (
                        <div className="d-flex justify-content-center mt-5">
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={"..."}
                                pageCount={Math.ceil(productCount / resPerPage)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                activeClassName={"active"}
                                forcePage={currentPage}
                            />
                        </div>
                    )}
                </Fragment>
            }
        </Fragment>
    );
}