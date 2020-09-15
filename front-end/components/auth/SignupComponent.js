import { useState, useEffect } from 'react';
import { Signup, isAuth } from '../../actions/authActions';
import Router from 'next/router';

const SignupComponent = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true,
    });


    const { name, email, password, error, loading, message, showForm } = values;

    // Redirection to homepage if signed in + signup in URL
    useEffect(() => {
        isAuth() && Router.push('/')
    }, [])
    // END OF Redirection to homepage if signed in + signup in URL


    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     console.log("IN HANDLESUBMIT")
    //     let input = e.target.value;
    // };

    const handleSubmit = e => {
        e.preventDefault();
        // console.log("IN HANDLESUBMIT")
        console.table({ name, email, password, error, loading, message, showForm });
        setValues({ ...values, loading: true, error: false });
        const user = { name, email, password };
        console.log("USER", user);
        Signup(user).then(data => {
            console.log('DATA FROM FETCH', data);
            if (data.email) {
                setValues({ ...values, error: data.email, loading: false })
            } else {
                setValues({ ...values, name: '', email: '', password: '', error: '', loading: false, message: data.message, showForm: false });
            }
        });
    };

    // const handleChange = (e) => {
    //     e.preventDefault()
    //     console.log("IN HANDLECHANGE")
    //     let input = e.target.value;
    //     console.log(input)
    // };

    const handleChange = input => e => {
        e.preventDefault()
        console.log("IN HANDLECHANGE")
        setValues({ ...values, error: false, [input]: e.target.value })
    };

    const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '');
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');

    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Type your name" />
                </div>
                <div className="form-group">
                    <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Type your email" />
                </div>
                <div className="form-group">
                    <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Type your password" />
                </div>
                <div>
                    <button className="btn btn-primary">Signup</button>
                </div>
            </form>
        )
    };
    return (
        <React.Fragment>
            {showLoading()}
            {showMessage()}
            {showError()}
            {showForm && signupForm()}
        </React.Fragment>
    )
};


export default SignupComponent;



