import { useDispatch, useSelector } from "react-redux"
import { 
  MDBTable, 
  MDBTableHead, 
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBSpinner,
  MDBBtn ,
  MDBInput
} from 'mdb-react-ui-kit';
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { clearError, clearProductDeleted } from "../../slices/productSlice";
import { getAdminProducts, deletProduct } from "../../actions/productActions";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layouts/Loader";


export default function ProductsList(){

    const {products=[], loading=true, error} = useSelector(state => state.productsState);
    const { isProductDeleted, error : productError} = useSelector(state => state.productState);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('');

    const deleteHandler = (e, id) => {
        e.target.disabled = true
        dispatch(deletProduct(id))
    }
    
    useEffect(() => {
        if(error || productError){
            toast(error, {
                type : "error",
                position : "bottom-center",
                onOpen : () => { dispatch(clearError())}
            })
            return 
        }

        if(isProductDeleted){
            toast("product deleted successfully", {
                type : "success",
                position : "bottom-center",
                onOpen : () => dispatch(clearProductDeleted())
            })
            return ;
            
        }
        
        
        dispatch(getAdminProducts())
    }, [dispatch, error, isProductDeleted])

    if (loading) {
       <Loader/>
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar/>
            </div>
            <div className="col-12 col-md-10">
                <div className="col-12 col-md-10">
                <h1 className="my-4">Products List</h1>
                    <Fragment>
            
                    <MDBRow className='mt-4 mb-3'>
                        <MDBCol size='12' md='6'>
                        <MDBInput
                            label='Search Products'
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
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                        {filteredProducts.map(product => (
                            <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                                <Link
                                to={`/admin/product/${product._id}`}
                                className="btn btn-primary btn-sm"
                                >
                                <i className="fa fa-edit"></i>
                                </Link>
                                <MDBBtn onClick={(e) => deleteHandler(e, product._id)} className="btn btn-danger py-1 px-2 ml-2">
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
        
    )
}