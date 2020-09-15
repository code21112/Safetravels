import { useState, useEffect } from 'react';
import Router from 'next/router';
import { isAuth } from '../../actions/authActions'

const Admin = ({ children }) => {
    useEffect(() => {
        if (!isAuth()) {
            Router.push('/signin')
        } else if (isAuth().role != 1) {
            Router.push('/user')
        }
    }, [])
    return (<React.Fragment>
        {children}
    </React.Fragment>)
}


export default Admin;