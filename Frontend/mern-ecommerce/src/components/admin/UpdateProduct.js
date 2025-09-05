import Sidebar from "./Sidebar"
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, UpdateProduct as updateProductAction } from "../../actions/productActions";
import { toast } from 'react-toastify'
import { clearError, clearProductUpdated } from "../../slices/productSlice";

export default function UpdateProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imagesCleared, setImagesCleared] = useState(false);
    const [imagesPreview, setImagesPreview] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id: productId } = useParams()

    const { loading, isProductUpdated, error, product } = useSelector(state => state.productState);

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

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState == 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, file])
                }
            }

            reader.readAsDataURL(file)
        })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name)
        formData.append('price', price)
        formData.append('stock', stock)
        formData.append('description', description)
        formData.append('seller', seller)
        formData.append('category', category)
        images.forEach(image => {
            formData.append('images', image)
        })
        formData.append("imagesCleared", imagesCleared)
        dispatch(updateProductAction(productId, formData))
    }

    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([])
        setImagesCleared(true)
    }

    useEffect(() => {
        if (isProductUpdated) {
            toast("Product updated successfully", {
                type: "success",
                position: "bottom-center",
                onOpen: () => dispatch(clearProductUpdated())
            });
            navigate('/admin/products');
            return;
        }

        if (error) {
            toast.error(error, {
                position: "bottom-center",
                onOpen: () => dispatch(clearError())
            });
            return;
        }

        dispatch(getProduct(productId));
    }, [dispatch, isProductUpdated, error, productId, navigate]);

    useEffect(() => {
        if (product._id) {
            setName(product.name)
            setPrice(product.price)
            setStock(product.stock)
            setDescription(product.description)
            setSeller(product.seller)
            setCategory(product.category)

            let images = [];
            product.images.forEach(image => {
                images.push(image.image)
            })
            setImagesPreview(images)
        }
    }, [product])

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                                <h1 className="mb-4">Update Product</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Price</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description_field"
                                        rows="8"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="form-control"
                                        id="category_field"
                                    >
                                        <option value="">Select</option>
                                        {categories.map((category, i) => (
                                            <option key={i} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="seller_field">Seller Name</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className="form-control"
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Images</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customFile'
                                            multiple
                                            onChange={onImagesChange}
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Images
                                        </label>
                                    </div>
                                    {imagesPreview.length > 0 && (
                                        <span className="mr-2" onClick={clearImagesHandler} style={{ cursor: "pointer" }}>
                                            <i className="fa fa-trash"></i>
                                        </span>
                                    )}
                                    <div className="mt-3">
                                        {imagesPreview.map((image, index) => (
                                            <img
                                                className="mr-2"
                                                key={index}
                                                src={image}
                                                alt={`Preview ${index}`}
                                                width="55"
                                                height="52"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'UPDATE'}
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </div>
    )
}