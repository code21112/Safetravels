import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/authActions';
import { create, getTags, singleTag, removeTag } from '../../actions/tagActions';
// import { remove } from 'js-cookie';

const Tag = () => {
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        tags: [],
        removed: false,
        reload: false
    });

    const { name, error, success, tags, removed, reload } = values;

    const token = getCookie('token');

    useEffect(() => {
        loadTags()
    }, [reload]);

    const loadTags = () => {
        getTags().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setValues({ ...values, tags: data })
            }
        })
    };

    const showTags = () => {
        return (
            tags.map((tag, index) => {
                return <button onDoubleClick={() => deleteConfirm(tag.slug)} title="Double click to delete" key={index} className="btn btn-outline-primary mr-1 ml-1 mt-3" >
                    {tag.name}
                </button >
            })
        )
    };

    const deleteConfirm = (slug) => {
        let answer = window.confirm('Please comfirm to delete')
        if (answer) {
            deleteTag(slug)
        }
    };

    const deleteTag = (slug) => {
        console.log('in deleteTag', slug)
        removeTag(slug, token).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false })
                console.log('in if of deleteTag')
            } else {
                setValues({ ...values, error: false, success: false, name: '', removed: !removed, reload: !reload })
                console.log('in else of deleteTag')

            }
        })
    };

    const showSuccess = () => {
        if (success) {
            return <p className="text-success">Tag created</p>
        }
    };

    const showError = () => {
        if (error) {
            return <p className="text-danger">Tag already existing</p>
        }
    };

    const showRemoved = () => {
        if (removed) {
            return <p className="text-danger">Tag deleted</p>
        }
    };

    const mouseMoveHandler = (e) => {
        setValues({ ...values, error: false, success: false, removed: '' })
    };


    // const handleChange = e => {
    //     let input = e.target.value;
    //     console.log('input', input)
    //     setValues({ ...values, name: e.target.value, error: false, success: false, removed: '' })
    // };

    const clickSubmit = e => {
        e.preventDefault();
        console.log('create tag', name)
        // console.log({ name })
        // console.log(token)
        create({ name }, token).then(data => {
            console.log("data", data)
            console.log("data.error", data.error)
            if (data.error) {
                setValues({ ...values, error: data.error, success: false })
                console.log('name in if', name, error, success)
            } else {
                // setValues({ ...values, error: false, success: true, name: '', removed: !removed, reload: !reload })
                setValues({ ...values, error: false, success: true, name: '', removed: '', reload: !reload })

                console.log('name in else', name, error, success)
            }
        })
    };

    const handleChange = e => {
        let input = e.target.value;
        console.log('input', input)
        setValues({ ...values, name: e.target.value, error: false, success: false, removed: '' })
    };

    const newTagForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handleChange} value={name} required />
            </div>
            <div>
                <button type="submit" className="btn btn-primary">
                    Create
                    </button>
            </div>
        </form>
    );


    return <React.Fragment>
        {showSuccess()}
        {showError()}
        {showRemoved()}
        {/* {newCategoryForm()} */}
        <div onMouseMove={mouseMoveHandler}>
            {newTagForm()}
            {showTags()}
        </div>
    </React.Fragment>
};

export default Tag;