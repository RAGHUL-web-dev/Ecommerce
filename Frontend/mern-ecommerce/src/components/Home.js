import React, { Fragment, useEffect, useState } from "react";
import UrlName from "./layouts/UrlName";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import Products from "./product/Products";
import { toast ,ToastPosition} from "react-toastify";
import ReactPaginate from "react-paginate";
// import "./paginate.css";
import "./Home.css"


export default function Home () {

    const dispatch = useDispatch();
    const { products, loading, error, productCount, resPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if(error){
            return toast.error(error, {
                position : "bottom-center"
            })
        }
        dispatch(getProducts(null, null, null, null, currentPage + 1, resPerPage))
    }, [error, currentPage])

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    
    return (
        <Fragment>
            {loading ? <Loader/> : 
                <Fragment>
                    <UrlName title={"products"}/>
                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Products col={3} key={product._id} product={product}/>
                            ))}
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