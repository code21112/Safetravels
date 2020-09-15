import { useState, useEffect } from 'react';
import { Signin, authenticate, isAuth } from '../../actions/authActions';
import Router from 'next/router';

const SigninComponent = () => {

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

    // Redirection to homepage if signed in + signin in URL
    useEffect(() => {
        isAuth() && Router.push('/')
    }, [])
    // END OF Redirection to homepage if signed in + signin in URL


    const handleSubmit = e => {
        e.preventDefault();
        // console.log("IN HANDLESUBMIT")
        console.table({ name, email, password, error, loading, message, showForm });
        setValues({ ...values, loading: true, error: false });
        const user = { email, password };
        console.log("USER", user);
        Signin(user).then(data => {
            console.log('DATA FROM FETCH', data);
            // console.log(data.user.role);
            // console.log(isAuth());

            if (data.error) {
                setValues({ ...values, error: data.error, loading: false })
            } else {
                // save user's infos in localstorage
                // save token in cookies
                // authenticate the user: it means no error
                authenticate(data, () => {
                    // redirect the authenticated user or admin 
                    // if (data.user.role === 1) {
                    if (isAuth() && isAuth().role === 1) {
                        Router.push('/admin')
                    } else {
                        Router.push('/user')
                    }

                    // MY IF
                    // if (isAuth()) {
                    //     if (data.user.role === 1) {
                    //         console.log("IN IF signin")
                    //         Router.push('/admin')
                    //     } else {
                    //         console.log('IN ELSE signin')
                    //         Router.push('/user')
                    //     }
                    // }

                })
            }
        });
    };


    const handleChange = input => e => {
        e.preventDefault()
        console.log("IN HANDLECHANGE")
        setValues({ ...values, error: false, [input]: e.target.value })
    };

    const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '');
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');

    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Type your email" />
                </div>
                <div className="form-group">
                    <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Type your password" />
                </div>
                <div>
                    <button className="btn btn-primary">Signin</button>
                </div>
            </form>
        )
    };
    return (
        <React.Fragment>
            {showLoading()}
            {showMessage()}
            {showError()}
            {showForm && signinForm()}
        </React.Fragment>
    )
};


export default SigninComponent;



