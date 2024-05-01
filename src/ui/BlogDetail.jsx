import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetchSuffix from "../hooks/useFetchSuffix";
import "./BlogDetail.css"
import blogFormatDate from "../utils/blogFormatDate";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

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
                    <article className="blog-detail">
                        <div className="blog-detail-header">
                            <p className="blog-detail-create">{(blog.blog.attributes.updated ? blogFormatDate(blog.blog.attributes.updated) : blogFormatDate(blog.blog.attributes.created))}</p>
                            <h1 className="blog-detail-title">{blog.blog.attributes.title}</h1>
                            <p className="blog-detail-category">{blog.blog.attributes.category}</p>
                            <p className="blog-detail-decription">{blog.blog.attributes.description}</p>
                        </div>
                        <ReactQuill
                            className='editor-input'
                            theme='bubble'
                            value={JSON.parse(blog.blog.content)}
                            modules={{ toolbar: [] }}
                            placeholder='Nothing here yet...'
                            preserveWhitespace
                            readOnly={true}
                        >
                        </ReactQuill>
                        <div className="blog-detail-footer">
                            <h1 className="blog-detail-about-title">About This Post</h1>
                            <p>
                                {"Written by " + blog.blog.author.name + " - "}
                                <a className="blog-detail-link" href="mailto:">{blog.blog.author.email}</a>
                            </p>
                        </div>
                    </article>
                )}
            </div>
        </>
    )
}

export default BlogDetail;