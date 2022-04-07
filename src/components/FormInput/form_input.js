import logo from "../../logo.svg";
import { useState } from "react";
function Input({
  handleSubmit,
  postingComment,
  comment,
  setComment,
  parentId,
  grandParentId,
  showResponses,
  responsesLength,
  cancel
}) {
  const [publish, setPublish] = useState(false);
  const [showControls, setShowControl] = useState(false);

  function handleCancel() {
    if(showResponses) return
    cancel();
  }

  return (
    <div style={{width: "100%"}} id="make-comment" className="pl-3">
      <h5 id="b">{showResponses && `Responses(${responsesLength})`}</h5>
      <div
        style={{
          boxShadow: "rgb(0 0 0 / 12%) 0px 2px 8px",
          marginBottom: "14px",
        }}
        className="p-1"
      >
        <div className="profile-set m-1">
          <div className="d-flex">
            <div className="profile">
              <img src={logo} />
            </div>{" "}
            <span>Jason</span>
          </div>
        </div>
        <form
          onSubmit={(event) => handleSubmit(event, comment, publish, parentId)}
          className="mt-2"
        >
          <div className="form-group">
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              style={{ width: "100%", border: "none" }}
              autoComplete="off"
              className="form-control mb-2"
              placeholder="Share your thought"
              id="message"
              required
              onFocus={() => setShowControl(true)}
            ></input>
          </div>
          <div
            style={{ opacity: showControls ? 1 : 0 }}
            className="send"
            id="send"
          >
            <div className="text">
              <i className="fa-solid fa-bold"></i>
              <i className="fa-solid fa-italic"></i>
            </div>
            <div className="btn">
              <span className="reply-container"
                onClick={handleCancel}>Cancel</span>
              <button
                disabled={postingComment}
                onClick={(event) => handleSubmit(event, comment, publish,parentId, grandParentId)}
                className="send-btn"
              >
                {postingComment ? "Posting..." : "Respond"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <input
        onChange={(event) => setPublish(event.target.checked)}
        type="checkbox"
      />{" "}
      Also publish to my profile
      <br />
    </div>
  );
}

export default Input;
