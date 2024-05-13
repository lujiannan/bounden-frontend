import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // for redirecting to the blog page after creating a new blog
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; // for getting the logged in user's email
import { useForm } from "react-hook-form"; // for handling form data
import "./BlogCreate.css";
import "../../utils/blogCategories"

import Tiptap from "../editor/Tiptap"
import { SortedBlogCategories } from "../../utils/blogCategories";
import useFetchSuffix from "../../hooks/useFetchSuffix";

function BlogEdit() {
    // allow user to grab the info from the suffix of the current route (blog id here)
    const { id } = useParams();
    const [blog, isLoading, fetchBlogError] = useFetchSuffix("/blogs/" + id);
    const URL_SUFFIX_EDIT = "/blogs/edit/" + id;

    const navigate = useNavigate();
    const auth = useAuthUser();
    const author_email = auth.email;

    const [result, setResult] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        // defaultValues: {
        //     category: "",
        //     title: "",
        //     description: "",
        //     content: "",
        // }
    });

    const onSubmit = (data) => {
        // construct data body before sending to server
        const body_data = JSON.stringify({
            "category": data.category,
            "title": data.title,
            "description": data.description,
            "content": JSON.stringify(data.content),
            "author_email": author_email,
        });

        // send data to server in a format {"blog" : {category: "", title: "", etc.}}
        fetch(process.env.REACT_APP_SERVER_URL + URL_SUFFIX_EDIT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // get access token from local storage
                "Authorization": "Bearer " + localStorage.getItem("_auth"),
            },
            body: body_data
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                console.log('Data posted');
                setResult(true);
                setFetchError(null);
                // return res.json();
            })
            .then(() => {
                // navigate to the blog page
                navigate("/blogs-self");
            })
            .catch(error => {
                setResult(false);
                setFetchError(error.message);
                console.log(error.message)
                // alert(fetchError);
            });
    }

    // titap editor functions
    useEffect(() => {
        register("content", {
            validate: (value) => {
                // console.log(value);
                // FOR JSON OUTPUT: check if content is empty (if there is at least one block in the editor that has a content then it's valid)
                for (let i = value?.content.length - 1; i >= 0; i--) {
                    if (value.content[i].content !== undefined) {
                        return true;
                    }
                }
                return "Content is required";
            }
        })
    }, []);

    useEffect(() => {
        if (blog) {
            // set the form values with the blog data
            setValue("title", blog.blog.attributes.title);
            setValue("description", blog.blog.attributes.description);
            setValue("category", blog.blog.attributes.category);
            setValue("content", JSON.parse(blog.blog.content));
        }
    }, [blog]);

    const handleContentOnChange = (editor) => {
        // set the content value while user inputs in the editor (by default, setValue doesn't trigger change of the field state, so we have to manually set it through the third argument)
        setValue("content", editor.getJSON(), {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouched: true,
        });
    }

    return (
        <>
            <div className="blog-create-container">
                {isLoading &&
                    <div className="blog-detail-loading-container">
                        <div className="loading-pulse"></div>
                    </div>
                }
                {fetchError && <div>Error: {fetchError}</div>}
                {blog && (
                    <>
                        <form onSubmit={handleSubmit((data) => onSubmit(data))} id="blog-create-form">
                            <div className="blog-create-form-vertical-group">
                                <div className="blog-create-form-vertical-group">
                                    {/* <label className=".blog-create-form-label">Title:</label> */}
                                    <input {...register("title", { required: "Title is required" })} className={`blog-create-form-input-title ${errors.title ? "blog-create-form-input-title-error" : ""}`}
                                        placeholder="Title" id="blog-create-form-input-title"></input>
                                    <p className="blog-create-form-input-title-error-message">{errors.title?.message}</p>
                                </div>

                                <div className="blog-create-form-horizontal-group">
                                    <div className="blog-create-form-vertical-group" style={{ flexGrow: 1 }}>
                                        {/* <label className=".blog-create-form-label">Description:</label> */}
                                        <input {...register("description", { required: false })} className={`blog-create-form-input ${errors.description ? "blog-create-form-input-error" : ""}`}
                                            placeholder="Description (optional)" id="blog-create-form-input-description"></input>
                                        <p className="blog-create-form-input-error-message">{errors.description?.message}</p>
                                    </div>

                                    <div className="blog-create-form-vertical-group" style={{ width: "auto" }}>
                                        {/* <label className=".blog-create-form-label">Category:</label> */}
                                        {/* <input {...register("category", { required: "Category is required" })} className={`blog-create-form-input ${errors.category ? "blog-create-form-input-error" : ""}`}
                                    placeholder="Category"></input> */}
                                        <select {...register("category", { required: "Category is required" })}
                                            className={`blog-create-form-select ${errors.category ? "blog-create-form-select-error" : ""}`}
                                            id="blog-create-form-input-category">
                                            <option key={0} value="">--Categories--</option>
                                            {SortedBlogCategories.map((category, index) => {
                                                return (
                                                    <option key={index + 1} value={category.cateName}>{category.cateName}</option>
                                                )
                                            })}
                                        </select>
                                        <p className="blog-create-form-select-error-message">{errors.category?.message}</p>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="blog-create-form-vertical-group">
                            <Tiptap
                                onContentChange={handleContentOnChange}
                                enableToolbar={true}
                                enableEditable={true}
                                initialContent={JSON.parse(blog.blog.content)}
                                onError={errors.content ? true : false}
                            />
                            <p className="blog-create-form-input-error-message">{errors.content?.message}</p>
                        </div>

                        <div className="blog-create-form-bottom-placeholder"></div>

                        <button className="blog-create-form-button" form="blog-create-form" type="submit">
                            <i className="ri-upload-cloud-2-line"></i>
                        </button>
                    </>
                )}
            </div>
        </>
    )
}

export default BlogEdit;