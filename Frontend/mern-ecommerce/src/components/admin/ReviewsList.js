import { useDispatch, useSelector } from "react-redux";
import { 
  MDBTable, 
  MDBTableHead, 
  MDBTableBody,
  MDBBtn
} from 'mdb-react-ui-kit';
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { clearError } from "../../slices/userSlice";
import Sidebar from "./Sidebar";
import Loader from "../layouts/Loader";
import { deleteReview, getReviews } from "../../actions/productActions";
import { clearReviewsDeleted } from "../../slices/productSlice";

export default function ReviewsList() {
  const { reviews = [], loading = true, error, isReviewDeleted } = useSelector(state => state.productState);
  const [productId, setProductId] = useState("");
  const dispatch = useDispatch();

  const [deletingId, setDeletingId] = useState(null); // to track which review is deleting

  const handleDeleteReview = (e, id) => {
    e.preventDefault(); 
    setDeletingId(id); // mark button as disabled
    dispatch(deleteReview(productId, id));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getReviews(productId));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onOpen: () => dispatch(clearError())
      });
    }

    if (isReviewDeleted) {
      toast.success("Review deleted successfully", {
        position: "bottom-center",
        onOpen: () => dispatch(clearReviewsDeleted())
      });
      dispatch(getReviews(productId));
      setDeletingId(null); // reset disabled state
    }
  }, [dispatch, error, isReviewDeleted]);

  if (loading) return <Loader />;

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar/>
      </div>
      <div className="col-12 col-md-10">
        <div className="col-12 col-md-10">
          <h1 className="my-4">Review List</h1>
          <div className="row justify-content-center mt-5">
            <div className="col-5">
              <form onSubmit={submitHandler}>
                <div className="form-group">
                  <label>Product Id</label>
                  <input 
                    type="text" 
                    onChange={e => setProductId(e.target.value)} 
                    value={productId} 
                    className="form-control" 
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block py-2">Search</button>
              </form>
            </div>
          </div>
          <Fragment>
            <MDBTable responsive striped bordered hover className="mt-5">
              <MDBTableHead>
                <tr>
                  <th>ID</th>
                  <th>Rating</th>
                  <th>User</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {reviews.map(review => (
                  <tr key={review._id}>
                    <td>{review._id}</td>
                    <td>{review.rating}</td>
                    <td>{review.user?.name || "Unknown"}</td>
                    <td>{review.comment}</td>
                    <td>
                      <MDBBtn
                        color="danger"
                        size="sm"
                        className="ml-2"
                        onClick={(e) => handleDeleteReview(e, review._id)}
                        disabled={deletingId === review._id}
                      >
                        {deletingId === review._id 
                          ? <i className="fa fa-spinner fa-spin"></i> 
                          : <i className="fa fa-trash"></i>
                        }
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
