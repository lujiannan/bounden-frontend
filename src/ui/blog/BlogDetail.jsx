import { useParams } from "react-router-dom";
import useFetchSuffix from "../../hooks/useFetchSuffix";
import "./BlogDetail.css"
import blogFormatDate from "../../utils/blogFormatDate";

import Tiptap from "../editor/Tiptap"
import Comments from "../comment/Comments";

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
                        <Comments blogId={id} blogAuthorEmail={blog.blog.author.email} />
                    </div>
                )}
                <div className="footer">
                    <p>&copy; Bounden. All rights reserved.</p>
                    <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2024096881号</a>
                </div>
            </div>
        </>
    )
}

export default BlogDetail;