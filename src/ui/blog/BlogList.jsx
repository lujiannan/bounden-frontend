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

function BlogList({ urlSuffix, titleString, forBlogSelf = false }) {
    const longPress = useLongPress();
    const navigate = useNavigate();
    const [isFetchBlogsLoading, setIsFetchBlogsLoading] = useState(false);
    const [fetchBlogsError, setFetchBlogsError] = useState(null);
    const [data_blogs, setDataBlogs] = useState([]);
    const [isNoMorePages, setIsNoMorePages] = useState(false);
    // always fetch the first page, and use last_blog_updated_time to filter out duplicate blogs
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 5;

    const [isUpdateModalActive, setIsUpdateModalActive] = useState(false);
    const [pressedBlogId, setPressedBlogId] = useState(0);
    // set the initial count down to 5 seconds for delete button
    const [deleteCountDown, setDeleteCountDown] = useState(5);
    const [isDeleteBtnDisabled, setIsDeleteBtnDisabled] = useState(true);
    const [isBlogDeleting, setIsBlogDeleting] = useState(false);
    const [deleteResult, setDeleteResult] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // initialize the data_blogs on first render
    useEffect(() => {
        handleBlogListPageFetch();
    }, []);

    const handleBlogListPageFetch = (page = currentPage, per_page = PER_PAGE) => {
        if (isNoMorePages) {
            // if there are no more pages, don't fetch again
            return;
        }
        // reset properties
        setFetchBlogsError(null);
        setIsFetchBlogsLoading(true);
        // pass in the updated time and id of the last blog in the current page to avoid fetching duplicate blogs
        const last_blog_updated_time = data_blogs.length > 0 ? data_blogs[data_blogs.length - 1].attributes.updated : null;
        const last_blog_id = data_blogs.length > 0 ? data_blogs[data_blogs.length - 1].id : 0;
        fetch(process.env.REACT_APP_SERVER_URL + urlSuffix, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
            body: JSON.stringify({ page, per_page, last_blog_id, last_blog_updated_time }),
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                if (data.current_page === data.pages) {
                    console.log('This is the last page');
                    setIsNoMorePages(true);
                }
                // setCurrentPage(currentPage + 1);
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

    useEffect(() => {
        if (isUpdateModalActive) {
            setIsDeleteBtnDisabled(true);
            if (deleteCountDown > 0) {
                const timer = setTimeout(() => {
                    setDeleteCountDown(deleteCountDown - 1);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                setIsDeleteBtnDisabled(false);
            }
        } else {
            setIsDeleteBtnDisabled(true);
            setDeleteCountDown(5);
        }
    }, [isUpdateModalActive, deleteCountDown]);

    const handleBlogLongPress = (blogId) => {
        if (forBlogSelf) {
            setIsUpdateModalActive(true);
            setPressedBlogId(blogId);
        }
    }

    const handleBlogDelete = () => {
        setIsBlogDeleting(true);
        fetch(process.env.REACT_APP_SERVER_URL + '/blogs/' + pressedBlogId, {
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
                setIsBlogDeleting(false);
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
                setIsBlogDeleting(false);
                setDeleteResult(false);
                setDeleteError(error.message);
                console.log(error.message)
                // alert(fetchError);
            });
    }

    return (
        <>
            <FullModal isOpen={isUpdateModalActive} onClose={() => { setIsUpdateModalActive(false); setPressedBlogId(0); }}>
                <h1>Delete the Blog</h1>
                <div className="blog-delete-modal-btn-group">
                    <button className="delete-btn" disabled={isDeleteBtnDisabled}
                        onClick={() => { handleBlogDelete() }}>
                        {isBlogDeleting ?
                            <div className="delete-blog-loading-container">
                                <div className="loading-pulse"></div>
                            </div> :
                            <>
                                Delete {(deleteCountDown > 0 && isUpdateModalActive) ? `(${deleteCountDown}) ` : ''}
                            </>
                        }
                    </button>
                    <button onClick={() => { setIsUpdateModalActive(false); setPressedBlogId(0); }}>Cancel</button>
                </div>
            </FullModal>
            <div className="blog-container">
                <h1>{titleString}</h1>
                {
                    <>
                        {data_blogs.length !== 0 &&
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
                        }
                        {!fetchBlogsError &&
                            <div className="blog-list-loading-container">
                                {(data_blogs.length === 0 || isFetchBlogsLoading) ? (
                                    <div className="loading-pulse"></div>
                                ) : (
                                    isNoMorePages ? (<div>· THE END ·</div>) : (<button onClick={() => handleBlogListPageFetch()}>LOAD MORE</button>)
                                )}
                            </div>
                        }
                        {fetchBlogsError && <div>Error: {fetchBlogsError}</div>}
                    </>
                }
                {!isFetchBlogsLoading && !fetchBlogsError && data_blogs.length === 0 && <p>No blogs found.</p>}
            </div>
        </>
    );
}

export default BlogList;