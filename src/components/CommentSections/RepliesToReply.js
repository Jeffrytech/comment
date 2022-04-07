import logo from "../../logo.svg";
import { processDate } from "../../utils";
import { loggedInUser } from "../../data";
import FormInput from "../FormInput/form_input";
import Notification from "../Notification/Notification";
import Backdrop from "../Backdrop/Backdrop";

import { useState } from "react";

function CommentReplies({ data, handleReplyToReplySubmit, grandParentId }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  async function localHandleReply(
    event,
    comment,
    publishToProfile,
    parentId,
    grandParentId
  ) {
    setPostingComment(true);

    await handleReplyToReplySubmit({
      event,
      comment,
      publishToProfile,
      parentId,
      grandParentId,
    });
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

  return (
    <div className="replies" style={{ overflowY: "scroll", height: "auto" }}>
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
                  <span>{data && data.author && data.author.firstName}</span>
                  <br />
                  <span>{processDate(data.createdAt)}</span>
                </div>

                {data.author && data.author.id === loggedInUser.id && (
                  <span
                    style={{
                      background: "green",
                      height: "3vh",
                      padding: "3px",
                      margin: "0 5px",
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
        <p>{data && data.comment}</p>
        {/* <div className="replies-actions">
          <div>
            <i className="fa-regular fa-heart m-1"> </i>
            <i className="m-1 fa-solid fa-up-long"></i>
            <span>{data && data.likes && data.likes.length}</span>
          </div>
          <div>
            <i className="fas fa-comment"></i>{" "}
            <span>{data && data.replies && data.replies.length} replies</span>
          </div>
          <div onClick={handleShowReplyInput} className="reply-container">
            <span>Reply</span>
          </div>
        </div> */}

        {/* <span className="text-primary">Show 10 more replies</span> */}
      </div>
    </div>
  );
}

export default CommentReplies;
