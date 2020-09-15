import Link from 'next/link';
import renderHtml from 'react-render-html';
import { useState, useEffect } from 'react';
import { listSearch } from '../../actions/blogActions';

const Search = () => {

    const [values, setValues] = useState({
        search: undefined,
        results: [],
        searched: false,
        message: ''
    });

    const { search, results, searched, message } = values;

    const searchSubmit = (e) => {
        e.preventDefault()
        listSearch({ search }).then(data => {
            setValues({ ...values, results: data, searched: true, message: `${data.length} blogs found` })
        })
    }

    const handleChange = e => {
        console.log(e.target.value)
        setValues({ ...values, search: e.target.value, searched: false })
    }

    const searchedBlogs = (results = []) => {
        return (
            <div className="bg-white offset-10 pt-1 pt-0 mt-0">
                {message && <p className="pt-2 text-muted font-italic">{message}</p>}
                {results.map((blogFound, index) => {
                    return (
                        <div key={index}>
                            <Link href={`/blogs/${blogFound.slug}`}>
                                <a className="text-primary">{blogFound.title}</a>
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <div className="row">
                <div className="offset-9 col-md-2 pr-1 pt-1">
                    <input type="search" className="form-control mt-1 mr-0" id="input-search" placeholder="Search..." onChange={handleChange} />

                </div>
                <div className="col-md-1 pl-1 pt-1" style={{ fontSize: '10px' }}>
                    <button className="btn btn-block btn-outline-dark mt-1 ml-0" id="btn-search" type="submit">Search</button>
                </div>
            </div>
        </form >
    )


    return (
        <div className="container-fluid">
            <div className="">
                {searchForm()}
            </div>
            {/* <div>
                {searched && <div style={{ marginTop: '-120px', marginBottom: '-80px' }}>
                    {searchedBlogs()}
                </div>
                }
            </div> */}
            <div className="pb-0">
                {searched && <div>
                    {searchedBlogs(results)}
                </div>
                }
            </div>
        </div >
    )
}

export default Search;