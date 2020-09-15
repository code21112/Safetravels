import React, { useState } from 'react';
import { APP_NAME } from '../config.js';
import Link from 'next/link';
import { Signout, isAuth } from '../actions/authActions';
import Router from 'next/router';
import NProgress from 'nprogress';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';

// 2nd method of importing CSS with next.js
import '.././node_modules/nprogress/nprogress.css';
import Search from './blogs/Search';
import SearchResults from './blogs/Search';


Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();


const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <React.Fragment>
            <Navbar color="light" light expand="md">
                <Link href="/">
                    <NavLink className="font-weight-bold">
                        {APP_NAME}
                    </NavLink>
                </Link>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        {<React.Fragment>
                            {/* <NavItem>
                                <Search />
                            </NavItem> */}
                            {isAuth() && (
                                <NavItem>
                                    <Link href="/user/crud/blog">
                                        <NavLink style={{ cursor: 'pointer' }} className="btn btn-outline-info mt-0 pt-0 pb-0 mt-2 text-info mr-2">
                                            Write a Blog
                                </NavLink>
                                    </Link>
                                </NavItem>
                            )}
                            <NavItem>
                                <Link href="/blogs">
                                    <NavLink style={{ cursor: 'pointer' }}>
                                        Blogs
                                </NavLink>
                                </Link>
                            </NavItem>
                            {!isAuth() && (
                                <NavItem>
                                    <Link href="/signin">
                                        <NavLink style={{ cursor: 'pointer' }}>
                                            Signin
                                </NavLink>
                                    </Link>
                                </NavItem>
                            )}
                            {!isAuth() && (
                                <NavItem>
                                    <Link href="/signup">
                                        <NavLink style={{ cursor: 'pointer' }}>
                                            Signup
                                </NavLink>
                                    </Link>
                                </NavItem>
                            )}

                        </React.Fragment>
                        }

                        {isAuth() && isAuth().role === 0 && (
                            < NavItem >
                                <Link href="/user">
                                    <NavLink>
                                        {`${isAuth().name}'s Dashboard`}
                                    </NavLink>
                                </Link>
                            </NavItem>
                        )}

                        {isAuth() && isAuth().role === 1 && (
                            < NavItem >
                                <Link href="/admin">
                                    <NavLink>
                                        {`${isAuth().name}'s Dashboard`}
                                    </NavLink>
                                </Link>
                            </NavItem>
                        )}

                        {isAuth() && (
                            < NavItem >
                                <NavLink style={{ cursor: 'pointer' }} onClick={() => { Signout(() => Router.replace('/signin')) }}>
                                    Signout
                               </NavLink>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
            <Search />
        </React.Fragment>
    );
}


export default Header;