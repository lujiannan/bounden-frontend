/* 
This is a reusable component for displaying a list of blog posts
*/

import "./BlogList.css"
import useFetchSuffix from '../../hooks/useFetchSuffix.jsx';
import { Link } from "react-router-dom";
import blogFormatDate from "../../utils/blogFormatDate.jsx";

function sortBlogsByUpdated(data_blogs) {
    return data_blogs.sort((a, b) => {
        // Extract the "updated" time from each object and convert it to a Date object
        const dateA = new Date(a.attributes.updated);
        const dateB = new Date(b.attributes.updated);

        // Compare the dates
        // If "updated" time is null, consider it as the minimum value so that it appears at the end
        if (dateA.getTime() === dateB.getTime()) {
            return 0;
        } else if (!dateA.getTime() || (dateB.getTime() && dateB > dateA)) {
            return 1;
        } else {
            return -1;
        }
    })
}

function BlogList({ urlSuffix, titleString, handleBlogDelete }) {
    const [blogsData, isLoading, fetchError] = useFetchSuffix(urlSuffix);

    // sort blogs by updated time
    let data_blogs;
    if (blogsData) {
        data_blogs = sortBlogsByUpdated(blogsData.blogs);
    }

    return (
        <>
            <div className="blog-container">
                <h1>{titleString}</h1>
                {
                    // Checking if the blogsData retrived from the server from blog.js is undefined or not
                    (!blogsData || isLoading) ? (
                        !fetchError &&
                        <div className="blog-list-loading-container">
                            <div className="loading-pulse"></div>
                        </div>
                    ) : (
                        data_blogs.map((blog) => (
                            <div className='blog-preview' key={blog.id}>
                                <Link className="blog-preview-link" to={`${urlSuffix}/${blog.id}`}>
                                    <p className="blog-preview-category">{blog.attributes.category.toUpperCase()}</p>
                                    <h1 className="blog-preview-title">{blog.attributes.title}</h1>
                                    {blog.attributes.description && (
                                        <p className="blog-preview-description">{blog.attributes.description}</p>
                                    )}
                                    <p className="blog-preview-create">{blog.author.name + ' - ' +
                                        (blog.attributes.updated ? blogFormatDate(blog.attributes.updated) : blogFormatDate(blog.attributes.created))}</p>
                                </Link>
                            </div>
                        ))
                    )
                }
                {fetchError && <div>Error: {fetchError}</div>}
            </div>
        </>
    );
}

export default BlogList;