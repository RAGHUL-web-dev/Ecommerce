import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, forgotPassword } from '../../actions/userActions';
import { toast } from 'react-toastify';
// import MetaData from '../layouts/MetaData';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector(state => state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        dispatch(forgotPassword(formData));
    };

    useEffect(() => {
        if (message) {
            toast(message, {
                type : 'success',
                position: "bottom-center",
            });
            setEmail('');
        }

        if (error) {
            toast(error, {
                type: 'error',
                position: "bottom-center",
                onClose: () => dispatch(clearAuthError())
            });
        }
    }, [message, error, dispatch]);

    return (
        <>
            {/* <MetaData title={'Forgot Password'} /> */}
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Email'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}