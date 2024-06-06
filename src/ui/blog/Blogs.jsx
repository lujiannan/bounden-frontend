import "./Blogs.css"
import { Link } from "react-router-dom"; // replace <a> tag with <Link> to enable routing faster (preload the page before the user clicks on the link)
import BlogList from './BlogList';

function Blogs() {
    const URL_SUFFIX_BLOGS = "/blogs";
    const TITLE_BLOGS = "LATEST POSTS";

    return (
        <div className="blogs-container">
            {/* new blog button */}
            <Link to='/blogs/create' className='blog-create-btn'>
                <i className="ri-quill-pen-line"></i>
            </Link>
            {/* generate a blog list by passing the route string, process GET request to the server */}
            <BlogList urlSuffix={URL_SUFFIX_BLOGS} titleString={TITLE_BLOGS} />
            <div className="footer">
                <p>&copy; Bounden. All rights reserved.</p>
                <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2024096881号</a>
            </div>
        </div>
    )
}

export default Blogs;