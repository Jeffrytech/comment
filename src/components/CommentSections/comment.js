import { useEffect, useState } from "react";

import logo from "../../logo.svg";
import CommentReplies from "./comment_reply";
import { loggedInUser } from "../../data";
import FormInput from "../FormInput/form_input";
import { processDate } from "../../utils";
import Backdrop from "../Backdrop/Backdrop";
import Notification from "../Notification/Notification";

import "./Comment.css";

function Comment({
  data,
  handleLike,
  handleReplySubmit,
  handleHideReplies,
  handleReplyToReplySubmit,
  handleInnerLike,
  fetchReplies
}) {
  const [hasLiked, setHasLiked] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [comment, setComment] = useState("");
  const [showHiding, setShowHiding] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [repliesToShow, setRepliesToShow] = useState([]);
  const [showMoreButton, setShowMoreButton] = useState(true);

  useEffect(() => {
    const userLikeId =
      data.likes &&
      data.likes.findIndex((like) => like.userId === loggedInUser.id);
    if (userLikeId !== -1) {
      setHasLiked(true);
    } else {
      setHasLiked(false);
    }

    //For the paging
    if (data.replies && data.replies.length > 2) {
      setRepliesToShow(data.replies.slice(0, 2));
    } else {
      setRepliesToShow(data.replies);
    }
  }, [data]);

  async function localHandleHide(id) {
    setShowHiding(true);
    await handleHideReplies(id);
    setShowHiding(false);
  }

  function localHandleLike(id) {
    const prevlikeState = hasLiked;
    setHasLiked(!hasLiked);
    handleLike(id, prevlikeState);
  }

  async function localHandleReply(event, comment, publishToProfile, parentId) {
    setPostingComment(true);

    await handleReplySubmit(event, comment, publishToProfile, parentId);
    setPostingComment(false);
    setShowReplyInput(false);
  }

  function handleShowReplyInput() {
    const registeredDays =
      (new Date().getTime() -
        new Date(loggedInUser.user_created_at).getTime()) /
      (1000 * 60 * 60 * 24);
    if (registeredDays < 7) {
      setShowMessage(true);
    } else {
      setShowReplyInput(!showReplyInput);
    }
  }

  function removeNotification() {
    setShowMessage(false);
  }

  function handleShowMore() {
    setRepliesToShow(data.replies);
    setShowMoreButton(false);
  }

  function cancel(){
    setShowReplyInput(false);
  }

  let repliesLength = 0;
  repliesLength = data.replies && data.replies.length;

  return (
    <div
      style={{
        width: "350px",
        padding: "18px 10px",
        borderBottom: "1px solid rgba(128, 128, 128, 0.118)",
      }}
    >
      {showMessage && (
        <div>
          <Backdrop backdropClicked={removeNotification} show={showMessage} />
          <Notification
            handleOkClicked={removeNotification}
            title="Not qualifed"
            message="Accout is less than 7 days and cannot reply to a comment at this time"
          />
        </div>
      )}
      <div>
        <div className="top">
          <div className="profile-set">
            <div className="d-flex">
              <div className="profile">
                <img src={logo} />
              </div>
              <div className="d-flex">
                <div>
                  <span>{data.author.firstName || "Useer"}</span>
                  <br />
                  <span>{processDate(data.createdAt)}</span>
                </div>
                {data.author.id === loggedInUser.id && (
                  <span
                    style={{
                      background: "green",
                      height: "3vh",
                      padding: "3px",
                      color: "white",
                      borderRadius: "5px",
                    }}
                  >
                    {" "}
                    author{" "}
                  </span>
                )}
              </div>
            </div>
            <div className="dropdowndot">
              <i className="fa-solid fa-ellipsis dropbtndot"></i>
              <span className="dropdown-contentdot" id="vb">
                Report this response
              </span>
            </div>
          </div>
        </div>
        <br />
        <div>
          <p>{data.comment}</p>
        </div>
        <div className="actions">
          <div
            className="reply-container"
            onClick={() => localHandleLike(data.id)}
          >
            <i
              style={{ color: hasLiked ? "red" : null }}
              className="fa-regular fa-heart m-1"
            >
              {" "}
            </i>
            <i className="m-1 fa-solid fa-up-long"></i>
            <span>{data.likes.length}</span>
          </div>
          <div
            className="reply-container"
            onClick={() => localHandleHide(data.id)}
          >
            <i className="fas fa-comment"></i>{" "}
            {showHiding ? (
              <span style={{ color: "gray" }}>Hiding reply ...</span>
            ) : (
              <span>Hide replies</span>
            )}
          </div>
          <div onClick={handleShowReplyInput} className="reply-container">
            <span>Reply</span>
          </div>
        </div>
        {showReplyInput && (
          <FormInput
            postingComment={postingComment}
            handleSubmit={localHandleReply}
            comment={comment}
            setComment={setComment}
            parentId={data.id}
            cancel={cancel}
          />
        )}
      </div>
      {repliesToShow &&
        repliesToShow.map((reply, i) => {
          return (
            <div key={i}>
              <CommentReplies
                data={reply}
                handleReplyToReplySubmit={handleReplyToReplySubmit}
                handleInnerLike={handleInnerLike}
                handleHideReplies={handleHideReplies}
                grandParentId={data.id}
                fetchReplies={fetchReplies}
              />
            </div>
          );
        })}
      {repliesLength > 2 && showMoreButton && (
        <span onClick={handleShowMore} className="reply-container text-primary">
          Show {repliesLength - 2} more{" "}
          {repliesLength > 3 ? "replies" : "reply"}
        </span>
      )}
    </div>
  );
}

export default Comment;
