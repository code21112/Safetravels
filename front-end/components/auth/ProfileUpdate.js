import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth, updateUser } from '../../actions/authActions';
import { getProfile, update } from '../../actions/userActions';
import { API } from '../../config';

const ProfileUpdate = () => {
    const [values, setValues] = useState({
        username: '',
        username_for_photo: '',
        name: '',
        email: '',
        password: '',
        error: false,
        success: false,
        loading: false,
        photo: '',
        userData: process.browser && new FormData(),
        about: ''
    });

    const token = getCookie('token');
    const { username, username_for_photo, name, email, password, error, success, loading, photo, userData, about } = values;


    const init = () => {
        getProfile(token).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    username: data.username,
                    username_for_photo: data.username,
                    name: data.name,
                    email: data.email,
                    about: data.about,
                    photo: data.photo
                });
            }
        });
    }

    useEffect(() => {
        init();
        setValues({ ...values, userData: new FormData() });
    }, []);

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value
        console.log(value)
        // let userFormData = new FormData()
        userData.set(name, value)
        setValues({ ...values, [name]: value, userData, error: false, success: false })
    }

    const handleSubmit = e => {
        e.preventDefault()
        setValues({ ...values, loading: true })
        update(token, userData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false, loading: false })
            } else {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        username: data.username,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        password: data.password,
                        success: true,
                        loading: false
                    });
                })
            }
        })
    }

    const profileUpdateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="btn btn-outline-info">Profile photo
                <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">Username</label>
                <input onChange={handleChange('username')} type="text" className="form-control" value={username} />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password} />
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea onChange={handleChange('about')} type="text" className="form-control" value={about} />
            </div>
            <div>
                <button type="submit" className="btn btn-primary" disabled={!username || !name || !email}>
                    Update
            </button>
            </div>
        </form>
    )

    const showErrorMessage = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )

    const showSuccessMessage = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            Profile updated
        </div>
    )

    const showLoading = () => (
        <div className="alert alert-info" style={{ display: loading ? '' : 'none' }}>
            Loading...
        </div>
    );

    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        {photo && (
                            <img
                                src={`${API}/user/photo/${username_for_photo}`}
                                className="img img-fluid img-thumbnail mb-3"
                                style={{ maxHeight: 'auto', maxWidth: '100%' }}
                                alt="user profile"
                            />
                        )}
                    </div>
                    <div className="col-md-8">
                        {showErrorMessage()}
                        {showSuccessMessage()}
                        {showLoading()}
                        {profileUpdateForm()}
                        {/* {JSON.stringify({ username, email, name })} */}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProfileUpdate;
