import { useState, useEffect } from 'react';

import './Comments.css'
import blogFormatDate from '../../utils/blogFormatDate';
import CommentCreate from './CommentCreate';
import Markdown from 'marked-react';

function Comments({ blogId }) {
    const URL_SUFFIX_COMMENTS = "/blogs/" + blogId + "/comments";

    const [comments, setComments] = useState([]);
    const [commentsExpanded, setCommentsExpanded] = useState([]);
    const [expandedComments, setExpandedComments] = useState({});
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [replyToCommentId, setReplyToCommentId] = useState(null);

    // initialize the comments on first render
    useEffect(() => {
        handleCommentsPageFetch();
    }, []);

    const handleCommentsPageFetch = () => {
        setIsFetchingComments(true);

        fetch(process.env.REACT_APP_SERVER_URL + URL_SUFFIX_COMMENTS, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setIsFetchingComments(false);
                setComments(data.comments);
                setCommentsExpanded(Array(data.comments.length).fill(false))
                console.log('Data fetched');
            })
            .catch(error => {
                console.log(error.message)
                setIsFetchingComments(false);
                // alert(fetchError);
            });
    }

    const handleReplyClick = (comment_id) => {
        setReplyToCommentId(comment_id === replyToCommentId ? null : comment_id);
    }

    const handleExpandRepliesClick = (commentId, index) => {
        setReplyToCommentId(null);
        // fetch the replies if the user clicks the expand button for the first time
        if (!commentsExpanded[index] && !expandedComments[commentId]) {
            fetchReplies(commentId);
        }
        setCommentsExpanded((prevArray) => {
            const newState = [...prevArray];
            // set the expanded state of the comment to be opposite of its current state
            newState[index] = !newState[index];
            return newState;
        });
    }

    const fetchReplies = (commentId) => {
        const fetchUrl = process.env.REACT_APP_SERVER_URL + URL_SUFFIX_COMMENTS + "/" + commentId + "/replies";
        fetch(fetchUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the data for that resource...'); }
                return res.json();
            })
            .then((data) => {
                setExpandedComments(prevState => ({
                    ...prevState,
                    [commentId]: data.replies
                }));
            })
            .catch(error => {
                console.log(error.message)
            });
    }

    return (
        <div className="comment-container">
            <h2 className="comment-title">
                <i className="ri-discuss-line"></i>
                &nbsp;&nbsp;Comment
            </h2>
            <div className='comment-tip'>
                Markdown is supported & <strong>Login before commenting is preferred &nbsp;: &#41;</strong>
            </div>

            <CommentCreate
                blogId={blogId}
                onCommentSubmitFinished={() => {
                    handleCommentsPageFetch();
                    setReplyToCommentId(null);
                }}
            />

            <h2 className="comment-title">
                <i className="ri-discuss-line"></i>
                &nbsp;&nbsp;{comments.length}&nbsp;Comments
            </h2>
            {
                <>
                    {comments.length > 0 &&
                        comments.map((comment, index) => (
                            <div data-aos="fade-up" key={comment.id}>
                                <div className='comment-item'>
                                    <div className='comment-item-horizontal-group'>
                                        <div className='comment-item-horizontal-group-left'>
                                            <div className='comment-item-name'>{comment.name}</div>
                                            <div className='comment-item-date'>{blogFormatDate(comment.created)}</div>
                                        </div>
                                        <i className='ri-reply-line' onClick={() => handleReplyClick(comment.id)}></i>
                                    </div>
                                    <div className='comment-item-content-md'>
                                        <Markdown value={comment.content} gfm={true} breaks={true} openLinksInNewTab={true}></Markdown>
                                    </div>
                                    {/* show the replies if the user clicks the expand button */}
                                    {commentsExpanded[index] && expandedComments[comment.id] && (
                                        <div className='replies-container'>
                                            {expandedComments[comment.id].map(reply => (
                                                <div data-aos="fade-right" key={reply.id}>
                                                    <div className='comment-reply-item'>
                                                        <div className='comment-reply-item-horizontal-group'>
                                                            <div className='comment-reply-item-horizontal-group-left'>
                                                                <div className='comment-reply-item-name'>{reply.name}</div>
                                                                <div className='comment-reply-item-date'>{blogFormatDate(reply.created)}</div>
                                                            </div>
                                                            <i className='ri-reply-line' onClick={() => handleReplyClick(reply.id)}></i>
                                                        </div>
                                                        <div className='comment-reply-item-content-md'>
                                                            <Markdown value={reply.content} gfm={true} breaks={true} openLinksInNewTab={true}></Markdown>
                                                        </div>
                                                        {replyToCommentId === reply.id && (
                                                            <CommentCreate
                                                                blogId={blogId}
                                                                forReply={true}
                                                                parentId={comment.id}
                                                                onCommentSubmitFinished={() => {
                                                                    handleCommentsPageFetch();
                                                                    setReplyToCommentId(null);
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* expand button for the replies */}
                                    {comment.replyNum > 0 && (
                                        <div className='comment-item-expand' onClick={() => handleExpandRepliesClick(comment.id, index)}>
                                            <i className={`${commentsExpanded[index] ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                                            {comment.replyNum} {comment.replyNum > 1 ? 'replies' : 'reply'}
                                        </div>
                                    )}
                                    {replyToCommentId === comment.id && (
                                        <CommentCreate
                                            blogId={blogId}
                                            forReply={true}
                                            parentId={comment.id}
                                            onCommentSubmitFinished={() => {
                                                handleCommentsPageFetch();
                                                setReplyToCommentId(null);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </>
            }
        </div>
    )
}

export default Comments;