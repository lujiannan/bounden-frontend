/* 
This is a reusable component for displaying a list of blog posts
*/

import { useState, useEffect } from "react";
import "./BlogList.css"
import { useNavigate } from "react-router-dom";

import blogFormatDate from "../../utils/blogFormatDate.jsx";
import useLongPress from '../../hooks/useLongPress.jsx';
import FullModal from '../modal/FullModal';

function deleteBlogAtIndex(data_blogs, indexToDelete) {
    // Check if the index is within the bounds of the array
    if (indexToDelete >= 0 && indexToDelete < data_blogs.length) {
        // Use splice to remove the item at the specified index
        data_blogs.splice(indexToDelete, 1);
    } else {
        console.error("Index out of bounds");
    }
    
    // Return the modified array
    return data_blogs;
}

function BlogList({ urlSuffix, titleString, forBlogSelf=false }) {
    const longPress = useLongPress();
    const navigate = useNavigate();
    const [isFetchBlogsLoading, setIsFetchBlogsLoading] = useState(false);
    const [fetchBlogsError, setFetchBlogsError] = useState(null);
    const [isUpdateModalActive, setIsUpdateModalActive] = useState(false);
    const [pressedBlogId, setPressedBlogId] = useState(0);

    const [deleteResult, setDeleteResult] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const [data_blogs, setDataBlogs] = useState([]);

    // initialize the data_blogs on first render
    useEffect(() => {
        handleBlogListPageFetch(1, 5);
    }, []);

    const handleBlogListPageFetch = (page, per_page) => {
        setFetchBlogsError(null);
        setIsFetchBlogsLoading(true);
        fetch(process.env.REACT_APP_SERVER_URL + urlSuffix, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
            body: JSON.stringify({page, per_page}),
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                return res.json();
            })
            .then((data) => {
                setIsFetchBlogsLoading(false);
                setDataBlogs((data_blogs) => [...data_blogs, ...data.blogs]);
                console.log('Data fetched');
            })
            .catch(error => {
                console.log(error.message)
                setIsFetchBlogsLoading(false);
                setFetchBlogsError(error.message);
                // alert(fetchError);
            });
    }

    const handleBlogLongPress = (blogId) => {
        if (forBlogSelf){
            setIsUpdateModalActive(true);
            setPressedBlogId(blogId);
        }
    }

    const handleBlogDelete = () => {
        fetch(process.env.REACT_APP_SERVER_URL + urlSuffix + '/' + pressedBlogId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                console.log('Data posted');
                setDeleteResult(true);
                setDeleteError(null);
                // return res.json();
            })
            .then(() => {
                setIsUpdateModalActive(false);
                setPressedBlogId(0);
                deleteBlogAtIndex(data_blogs, data_blogs.findIndex(blog => blog.id === pressedBlogId));
            })
            .catch(error => {
                setDeleteResult(false);
                setDeleteError(error.message);
                console.log(error.message)
                // alert(fetchError);
            });
    }

    return (
        <>
            <FullModal isOpen={isUpdateModalActive} onClose={() => {setIsUpdateModalActive(false); setPressedBlogId(0);}}>
                <h1>Delete the Blog</h1>
                <div className="blog-delete-modal-btn-group">
                    <button style={{backgroundColor: "var(--pretty-error-color)", borderColor: "var(--pretty-error-color)"}}
                        onClick={() => {handleBlogDelete()}}>Delete</button>
                    <button onClick={() => {setIsUpdateModalActive(false); setPressedBlogId(0);}}>Cancel</button>
                </div>
            </FullModal>
            <div className="blog-container">
                <h1>{titleString}</h1>
                {
                    // Checking if the blogsData retrived from the server from blog.js is undefined or not
                    (!data_blogs || data_blogs.length === 0 || isFetchBlogsLoading) ? (
                        !fetchBlogsError &&
                        <div className="blog-list-loading-container">
                            <div className="loading-pulse"></div>
                        </div>
                    ) : (
                        data_blogs.map((blog) => (
                            <div className='blog-preview' key={blog.id}
                                onClick={() => navigate(forBlogSelf ? `/blogs-self/edit/${blog.id}` : `/blogs/${blog.id}`)}
                                {...longPress(() => handleBlogLongPress(blog.id))}>
                                <div className="blog-preview-inner-container">
                                    <p className="blog-preview-category">{blog.attributes.category.toUpperCase()}</p>
                                    <h1 className="blog-preview-title">{blog.attributes.title}</h1>
                                    {blog.attributes.description && (
                                        <p className="blog-preview-description">{blog.attributes.description}</p>
                                    )}
                                    <p className="blog-preview-create">{blog.author.name + ' - ' +
                                        (blog.attributes.updated ? blogFormatDate(blog.attributes.updated) : blogFormatDate(blog.attributes.created))}</p>
                                </div>
                            </div>
                        ))
                    )
                }
                {!isFetchBlogsLoading && !fetchBlogsError && data_blogs && data_blogs.length === 0 && <p>No blogs found.</p>}
                {fetchBlogsError && <div>Error: {fetchBlogsError}</div>}
            </div>
        </>
    );
}

export default BlogList;