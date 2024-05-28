import { useState, useEffect } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

import './Comments.css'
import blogFormatDate from '../../utils/blogFormatDate';
import CommentCreate from './CommentCreate';
import Markdown from 'marked-react';

function Comments({ blogId, blogAuthorEmail }) {
    const URL_SUFFIX_COMMENTS = "/blogs/" + blogId + "/comments";

    const authUser = useAuthUser();
    const authEmail = authUser?.email;

    const [comments, setComments] = useState([]);
    const [isCommentsExpanded, setIsCommentsExpanded] = useState([]);
    const [expandedComments, setExpandedComments] = useState({});
    const [replyToCommentId, setReplyToCommentId] = useState(null);

    const [commentReplyNum, setCommentReplyNum] = useState([]);
    const [isFetchingComments, setIsFetchingComments] = useState(false);
    const [fetchCommentsError, setFetchCommentsError] = useState(null);
    const [isFetchingReplies, setIsFetchingReplies] = useState([]);
    const [fetchRepliesError, setFetchRepliesError] = useState([]);

    // initialize the comments on first render
    useEffect(() => {
        handleCommentsPageFetch();
    }, []);

    const handleCommentsPageFetch = () => {
        setIsFetchingComments(true);
        setFetchCommentsError(null);

        fetch(process.env.REACT_APP_SERVER_URL + URL_SUFFIX_COMMENTS, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the comments...'); }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setIsFetchingComments(false);
                setComments(data.comments);
                setCommentReplyNum(data.comments.map(comment => comment.replyNum));
                setIsCommentsExpanded(Array(data.comments.length).fill(false));
                setIsFetchingReplies(Array(data.comments.length).fill(false));
                setFetchRepliesError(Array(data.comments.length).fill(null));
                console.log('Data fetched');
            })
            .catch(error => {
                console.log(error.message)
                setIsFetchingComments(false);
                setFetchCommentsError(error.message);
                // alert(fetchError);
            });
    }

    const handleReplyClick = (comment_id) => {
        setReplyToCommentId(comment_id === replyToCommentId ? null : comment_id);
    }

    const handleExpandRepliesClick = (commentId, index) => {
        setReplyToCommentId(null);
        // fetch the replies if the user clicks the expand button for the first time
        if (!isCommentsExpanded[index] && !expandedComments[commentId]) {
            fetchReplies(commentId, index);
        }
        setIsCommentsExpanded((prevArray) => {
            const newState = [...prevArray];
            // set the expanded state of the comment to be opposite of its current state
            newState[index] = !newState[index];
            return newState;
        });
    }

    const fetchReplies = (commentId, index) => {
        setIsFetchingReplies((prevArray) => {
            const newState = [...prevArray];
            // set the expanded state of the comment to be opposite of its current state
            newState[index] = true;
            return newState;
        });
        setFetchRepliesError((prevArray) => {
            const newState = [...prevArray];
            // set the expanded state of the comment to be opposite of its current state
            newState[index] = null;
            return newState;
        });

        const fetchUrl = process.env.REACT_APP_SERVER_URL + URL_SUFFIX_COMMENTS + "/" + commentId + "/replies";
        fetch(fetchUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the replies...'); }
                return res.json();
            })
            .then((data) => {
                setExpandedComments(prevState => ({
                    ...prevState,
                    [commentId]: data.replies
                }));
                setIsFetchingReplies((prevArray) => {
                    const newState = [...prevArray];
                    // set the expanded state of the comment to be opposite of its current state
                    newState[index] = false;
                    return newState;
                });
            })
            .catch(error => {
                console.log(error.message);
                setIsFetchingReplies((prevArray) => {
                    const newState = [...prevArray];
                    // set the expanded state of the comment to be opposite of its current state
                    newState[index] = false;
                    return newState;
                });
                setFetchRepliesError((prevArray) => {
                    const newState = [...prevArray];
                    // set the expanded state of the comment to be opposite of its current state
                    newState[index] = error.message;
                    return newState;
                });
            });
    }

    const updateCommentReplyNum = (index, newNum) => {
        setCommentReplyNum(prevState => {
            const newState = [...prevState];
            newState[index] = newNum;
            return newState;
        });
    }

    const deleteComment = (id, forReply=false, index, commentId=null) => {
        const fetchUrl = process.env.REACT_APP_SERVER_URL + URL_SUFFIX_COMMENTS + "/" + id;
        fetch(fetchUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) { throw Error('Could not fetch the replies...'); }
            })
            .then(() => {
                if (forReply) {
                    fetchReplies(commentId, index);
                    updateCommentReplyNum(index, commentReplyNum[index] - 1);
                } else {
                    handleCommentsPageFetch();
                }
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    return (
        <div className="comment-container">
            <h2 className="comment-title">
                <i className="ri-discuss-line"></i>
                &nbsp;&nbsp;{comments.length}&nbsp;Comments
            </h2>
            {
                <>
                    {comments.length > 0 &&
                        comments.map((comment, index) => (
                            <div data-aos="fade-right" data-aos-once="true" key={comment.id}>
                                <div className='comment-item'>
                                    <div className='comment-item-horizontal-group'>
                                        <div className='comment-item-horizontal-group-left'>
                                            <div className='comment-item-name'>{comment.name}</div>
                                            <div className='comment-item-date'>{blogFormatDate(comment.created)}</div>
                                        </div>
                                        <div className='comment-item-horizontal-group-right'>
                                            {(comment.email === authEmail || authEmail === blogAuthorEmail) &&
                                                <i className='ri-delete-bin-line' onClick={() => deleteComment(comment.id, false, index, null)}></i>
                                            }
                                            <i className={`${replyToCommentId === comment.id ? 'ri-reply-fill' : 'ri-reply-line'}`} onClick={() => handleReplyClick(comment.id)}></i>
                                        </div>
                                    </div>
                                    <div className='comment-item-content-md'>
                                        <Markdown value={comment.content} gfm={true} breaks={true} openLinksInNewTab={true}></Markdown>
                                    </div>
                                    {/* show the replies if the user clicks the expand button */}
                                    {isCommentsExpanded[index] && expandedComments[comment.id] && (
                                        <div className='replies-container'>
                                            {expandedComments[comment.id].map(reply => (
                                                <div data-aos="fade-right" data-aos-once="true" key={reply.id}>
                                                    <div className='comment-reply-item'>
                                                        <div className='comment-reply-item-horizontal-group'>
                                                            <div className='comment-reply-item-horizontal-group-left'>
                                                                <div className='comment-reply-item-name'>{reply.name}</div>
                                                                <div className='comment-reply-item-date'>{blogFormatDate(reply.created)}</div>
                                                                <div className='comment-reply-item-to'>@ {reply.parent_name}</div>
                                                            </div>
                                                            <div className='comment-reply-item-horizontal-group-right'>
                                                                {(reply.email === authEmail || authEmail === blogAuthorEmail) &&
                                                                    <i className='ri-delete-bin-line' onClick={() => deleteComment(reply.id, true, index, comment.id)}></i>
                                                                }
                                                                <i className={`${replyToCommentId === reply.id ? 'ri-reply-fill' : 'ri-reply-line'}`} onClick={() => handleReplyClick(reply.id)}></i>
                                                            </div>
                                                        </div>
                                                        <div className='comment-reply-item-content-md'>
                                                            <Markdown value={reply.content} gfm={true} breaks={true} openLinksInNewTab={true}></Markdown>
                                                        </div>
                                                        {replyToCommentId === reply.id && (
                                                            <CommentCreate
                                                                blogId={blogId}
                                                                forReply={true}
                                                                parentId={reply.id}
                                                                parentName={reply.parent_name}
                                                                onCommentSubmitFinished={() => {
                                                                    updateCommentReplyNum(index, commentReplyNum[index] + 1);
                                                                    fetchReplies(comment.id, index);
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
                                    {commentReplyNum[index] > 0 && (
                                        <>
                                            {!fetchRepliesError[index] && isFetchingReplies[index] &&
                                                <div className="reply-list-loading-container">
                                                    <div className="loading-pulse"></div>
                                                </div>
                                            }
                                            {fetchRepliesError[index] && <div>Error: {fetchRepliesError[index]}</div>}
                                            <div className='comment-item-expand' onClick={() => handleExpandRepliesClick(comment.id, index)}>
                                                <i className={`${isCommentsExpanded[index] ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                                                {commentReplyNum[index]} {commentReplyNum[index] > 1 ? 'replies' : 'reply'}
                                            </div>
                                        </>
                                    )}
                                    {replyToCommentId === comment.id && (
                                        <CommentCreate
                                            blogId={blogId}
                                            forReply={true}
                                            parentId={comment.id}
                                            parentName={comment.name}
                                            onCommentSubmitFinished={() => {
                                                updateCommentReplyNum(index, commentReplyNum[index] + 1);
                                                fetchReplies(comment.id, index);
                                                setReplyToCommentId(null);
                                            }}
                                            onCancelComment={() => setReplyToCommentId(null)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    }
                    {!fetchCommentsError && isFetchingComments &&
                        <div className="comment-list-loading-container">
                            <div className="loading-pulse"></div>
                        </div>
                    }
                    {fetchCommentsError && <div>Error: {fetchCommentsError}</div>}
                </>
            }

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
        </div>
    )
}

export default Comments;