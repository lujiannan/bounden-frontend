import { useParams } from "react-router-dom";
import useFetchSuffix from "../../hooks/useFetchSuffix";
import "./BlogDetail.css"
import blogFormatDate from "../../utils/blogFormatDate";

import Tiptap from "../editor/Tiptap"

function BlogDetail() {
    const URL_SUFFIX_DETAIL = '/blogs/';

    // allow user to grab the info from the suffix of the current route (blog id here)
    const { id } = useParams();
    // fetch the blog data using the useFetchSuffix hook
    const [blog, isLoading, fetchError] = useFetchSuffix(URL_SUFFIX_DETAIL + id);

    return (
        <>
            <div className="blog-detail-container">
                {isLoading &&
                    <div className="blog-detail-loading-container">
                        <div className="loading-pulse"></div>
                    </div>
                }
                {fetchError && <div>Error: {fetchError}</div>}
                {blog && (
                    <div className="blog-detail">
                        <div className="blog-detail-header">
                            <p className="blog-detail-category">{blog.blog.attributes.category.toUpperCase()}</p>
                            <p className="blog-detail-create">{(blog.blog.attributes.updated ? blogFormatDate(blog.blog.attributes.updated) : blogFormatDate(blog.blog.attributes.created))}</p>
                            <h1 className="blog-detail-title">{blog.blog.attributes.title}</h1>
                            {blog.blog.attributes.description && (
                                <p className="blog-detail-decription">{blog.blog.attributes.description}</p>
                            )}
                        </div>
                        <Tiptap
                            enableToolbar={false}
                            enableEditable={false}
                            initialContent={JSON.parse(blog.blog.content)}
                        />
                        <div className="blog-detail-footer">
                            <h2 className="blog-detail-about-title">About This Post</h2>
                            <p>
                                {"Written by " + blog.blog.author.name + " - "}
                                <a className="blog-detail-link" href={`mailto:${blog.blog.author.email}`}>{blog.blog.author.email}</a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default BlogDetail;