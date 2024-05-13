import "./BlogsSelf.css"
import { Link } from "react-router-dom"; // replace <a> tag with <Link> to enable routing faster (preload the page before the user clicks on the link)
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import BlogList from './BlogList';

function Blogs() {
    const authUser = useAuthUser();
    const URL_SUFFIX_BLOGS = "/users/" + authUser.email + "/blogs";
    const TITLE_BLOGS = "MY LATEST POSTS";

    return (
        <>
            {/* generate a blog list by passing the route string, process GET request to the server */}
            <BlogList urlSuffix={URL_SUFFIX_BLOGS} titleString={TITLE_BLOGS}/>
        </>
    )
}

export default Blogs;