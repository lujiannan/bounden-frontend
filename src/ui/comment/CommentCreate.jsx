import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; // for getting the logged in user's info
import { useForm } from "react-hook-form"; // for handling form data
import Markdown from 'marked-react';

import './CommentCreate.css'

function CommentCreate({ blogId, forReply=false, parentId=null, parentName=null, onCommentSubmitFinished=null, onCancelComment=null }) {
    const URL_SUFFIX_COMMENT_POST = "/blogs/" + blogId + "/comments/create";

    const auth = useAuthUser();

    const [isPreviewActive, setIsPreviewActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    const comment = watch("comment");

    useEffect(() => {
        if (auth) {
            setValue("name", auth.username);
            setValue("email", auth.email);
        }
    }, [auth]);

    const onCommentSubmit = (data) => {
        console.log(data);
        setIsSubmitting(true);

        // construct data body before sending to server
        const body_data = JSON.stringify({
            "name": data.name,
            "email": data.email,
            "content": data.comment,
            "parent_id": forReply ? parentId : null,
        });

        fetch(process.env.REACT_APP_SERVER_URL + URL_SUFFIX_COMMENT_POST, {
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
                console.log('Comment posted');
                setIsSubmitting(false);
                setValue('comment', '');
                setIsPreviewActive(false);
                if (onCommentSubmitFinished) {
                    onCommentSubmitFinished();
                }
                return res.json();
            })
            .catch(error => {
                setIsSubmitting(false);
                console.log(error.message)
                // alert(fetchError);
            });
    }

    return (
        <div className='comment-create-container' style={{ paddingLeft: forReply ? "1rem" : "0px" }}>
            <form onSubmit={handleSubmit((data) => onCommentSubmit(data))} className="comment-form" id={`${forReply ? "comment-reply-form" : "comment-form"}`}>
                <div className='comment-form-horizontal-group'>
                    <input {...register("name", { required: "Name is required" })} type="text" placeholder="Name" />
                    <input {...register("email", { required: "Email is required" })} type="email" placeholder="Email" />
                </div>
                <div className='horizontal-divider'></div>
                <textarea
                    {...register("comment", { required: "Comment is required", minLength: { value: 5, message: "Comment must be at least 5 characters long" }, maxLength: { value: 500, message: "Comment must be at most 500 characters long" } })}
                    placeholder={`${forReply ? "Reply to " + parentName + "..." : "Write your comment here..."}`}>
                </textarea>
                <div className='comment-form-word-count'>{comment ? comment.length : 0}/500</div>
            </form>
            <p className="comment-form-error-message">
                {errors.name?.message || errors.email?.message || errors.comment?.message}
            </p>

            <div className='comment-form-submit-group'>
                <i className="ri-markdown-fill"></i>
                {forReply && 
                    <button className="comment-form-cancel-button" onClick={() => onCancelComment()}>Cancel</button>
                }
                <button className={`comment-form-preview-button ${isPreviewActive ? "active" : ""}`} onClick={() => setIsPreviewActive(!isPreviewActive)}>Preview</button>
                <button className="comment-form-submit-button" type="submit" form={`${forReply ? "comment-reply-form" : "comment-form"}`}>
                    {isSubmitting && 
                        <div className="comment-form-submit-loading-container">
                            <div className="loading-pulse"></div>
                        </div>
                    }
                    {!isSubmitting && "Send"}
                </button>
            </div>
            <div className={`comment-form-preview-container ${isPreviewActive ? "active" : ""} ${comment ? "" : "placeholder"}`}>
                <Markdown value={comment ? comment : "No Preview Available ..."} gfm={true} breaks={true} openLinksInNewTab={true} />
            </div>
        </div>
    )
}

export default CommentCreate;