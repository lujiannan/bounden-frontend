/* 
This is a reusable component for displaying a list of blog posts
*/

import { useState, useEffect, useContext } from "react";
import "./BlogList.css"
import { useNavigate } from "react-router-dom";
import { BlogsContext } from './BlogsContext';

import blogFormatDate from "../../utils/blogFormatDate.jsx";
import useLongPress from '../../hooks/useLongPress.jsx';
import FullModal from '../modal/FullModal';

function deleteBlogAtIndex(dataBlogs, indexToDelete) {
    // Check if the index is within the bounds of the array
    if (indexToDelete >= 0 && indexToDelete < dataBlogs.length) {
        // Use splice to remove the item at the specified index
        dataBlogs.splice(indexToDelete, 1);
    } else {
        console.error("Index out of bounds");
    }

    // Return the modified array
    return dataBlogs;
}

function BlogList({ urlSuffix, titleString, forBlogSelf = false }) {
    const longPress = useLongPress();
    const navigate = useNavigate();
    const [isFetchBlogsLoading, setIsFetchBlogsLoading] = useState(false);
    const [fetchBlogsError, setFetchBlogsError] = useState(null);
    // all blogs data
    const { dataBlogs, setDataBlogs, isBlogsNoMorePages, setIsBlogsNoMorePages } = useContext(BlogsContext);
    // blogs data for the current user
    const [dataBlogsSelf, setDataBlogsSelf] = useState([]);
    const [isBlogsSelfNoMorePages, setIsBlogsSelfNoMorePages] = useState(false);
    // always fetch the first page, and use last_blog_updated_time to filter out duplicate blogs
    const CURRENT_PAGE = 1;
    const PER_PAGE = 5;

    const [isUpdateModalActive, setIsUpdateModalActive] = useState(false);
    const [pressedBlogId, setPressedBlogId] = useState(0);
    // set the initial count down to 5 seconds for delete button
    const [deleteCountDown, setDeleteCountDown] = useState(5);
    const [isDeleteBtnDisabled, setIsDeleteBtnDisabled] = useState(true);
    const [isBlogDeleting, setIsBlogDeleting] = useState(false);
    const [deleteResult, setDeleteResult] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // initialize the dataBlogs on first render
    useEffect(() => {
        if (dataBlogs.length === 0 || forBlogSelf) {
            handleBlogListPageFetch();
        }
    }, []);

    const handleBlogListPageFetch = (page = CURRENT_PAGE, per_page = PER_PAGE) => {
        if ((!forBlogSelf && isBlogsNoMorePages) || (forBlogSelf && isBlogsSelfNoMorePages)) {
            // if there are no more pages, don't fetch again
            return;
        }
        // reset properties
        setFetchBlogsError(null);
        setIsFetchBlogsLoading(true);
        // pass in the updated time and id of the last blog in the current page to avoid fetching duplicate blogs
        const last_blog_updated_time = forBlogSelf ?
            (dataBlogsSelf.length > 0 ? dataBlogsSelf[dataBlogsSelf.length - 1].attributes.updated : null) :
            (dataBlogs.length > 0 ? dataBlogs[dataBlogs.length - 1].attributes.updated : null);
        const last_blog_id = forBlogSelf ?
            (dataBlogsSelf.length > 0 ? dataBlogsSelf[dataBlogsSelf.length - 1].id : 0) :
            (dataBlogs.length > 0 ? dataBlogs[dataBlogs.length - 1].id : 0);
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
                if (data.current_page >= data.pages) {
                    console.log('This is the last page');
                    forBlogSelf ? setIsBlogsSelfNoMorePages(true) : setIsBlogsNoMorePages(true);
                }
                // setCurrentPage(currentPage + 1);
                setIsFetchBlogsLoading(false);
                forBlogSelf ? setDataBlogsSelf((dataBlogsSelf) => [...dataBlogsSelf, ...data.blogs]) : setDataBlogs((dataBlogs) => [...dataBlogs, ...data.blogs]);
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
                deleteBlogAtIndex(dataBlogs, dataBlogs.findIndex(blog => blog.id === pressedBlogId));
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
                        {(forBlogSelf ? dataBlogsSelf : dataBlogs).length !== 0 &&
                            (forBlogSelf ? dataBlogsSelf : dataBlogs).map((blog) => (
                                <div data-aos="fade" key={blog.id}>
                                    <div className='blog-preview'
                                        onClick={() => navigate(forBlogSelf ? `/blogs-self/edit/${blog.id}` : `/blogs/${blog.id}`)}
                                        {...longPress(() => handleBlogLongPress(blog.id))}>
                                        <div className="blog-preview-horizontal-container">
                                            <div className="blog-preview-info-container">
                                                <p className="blog-preview-category">{blog.attributes.category.toUpperCase()}</p>
                                                <h1 className="blog-preview-title">{blog.attributes.title}</h1>
                                                {blog.attributes.description && (
                                                    <p className="blog-preview-description">{blog.attributes.description}</p>
                                                )}
                                            </div>
                                            <img src={blog.cover_image} />
                                        </div>
                                        <p className="blog-preview-create">{blog.author.name + ' - ' +
                                            (blog.attributes.updated ? blogFormatDate(blog.attributes.updated) : blogFormatDate(blog.attributes.created))}</p>
                                    </div>
                                </div>
                            ))
                        }
                        {!fetchBlogsError &&
                            <div className="blog-list-loading-container">
                                {isFetchBlogsLoading &&
                                    <div className="loading-pulse"></div>
                                }
                                {!isFetchBlogsLoading &&
                                    <div>
                                        {(forBlogSelf ? isBlogsSelfNoMorePages : isBlogsNoMorePages) ? (<div>· END ·</div>) :
                                            (<div data-aos="fade">
                                                <button onClick={() => handleBlogListPageFetch()}>LOAD MORE</button>
                                            </div>)
                                        }
                                    </div>
                                }
                            </div>
                        }
                        {fetchBlogsError && <div>Error: {fetchBlogsError}</div>}
                    </>
                }
            </div>
        </>
    );
}

export default BlogList;