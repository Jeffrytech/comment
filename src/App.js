import "./App.css";
import axiosInstance from "./services/axiosService";
import Comment from "./components/CommentSections/comment";
import Input from "./components/FormInput/form_input";

import { loggedInUser } from "./data";

import { useEffect, useState } from "react";

function CommentPlug() {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [sortBy, setSortBy] = useState("Most Recent");
  const [sortByString, setSortByString] = useState("date");
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    setLoadingComments(true);
    axiosInstance
      .get("get-comments/3/order-by/date")
      .then((resp) => {
        setLoadingComments(false);
        setComments(resp.data);
      })
      .catch((err) => {
        setLoadingComments(false);
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (sortBy === "Most Recent") {
      setSortByString("date");
    } else {
      setSortByString("relevance");
    }

    setLoadingComments(true);
    axiosInstance
      .get("get-comments/3/order-by/" + sortByString)
      .then((resp) => {
        setComments(resp.data);
        setLoadingComments(false);
      })
      .catch((err) => {
        setLoadingComments(false);
        console.log(err);
      });
  }, [sortBy]);

  async function handleSubmit(event, comment, publishToProfile) {
    event.preventDefault();
    setPostingComment(true);
    const resp = await axiosInstance
      .post("post-comment", {
        comment,
        publishToProfile,
        parentId: 3,
        authorId: loggedInUser.id,
        publishToProfile,
        orderBy: sortBy,
      })
      .catch((err) => {
        console.log(err);
        setPostingComment(false);
      });

    setComment("");
    setComments(resp.data);
    setPostingComment(false);
  }

  async function handleReplySubmit(event, comment, publishToProfile, parentId) {
    event.preventDefault();
    setPostingComment(true);
    const resp = await axiosInstance
      .post("post-comment", {
        comment,
        publishToProfile,
        parentId,
        authorId: loggedInUser.id,
        publishToProfile,
        orderBy: sortBy,
      })
      .catch((err) => {
        console.log(err);
        setPostingComment(false);
      });

    const commentsCopy = [...comments];
    const index = commentsCopy.findIndex((comment) => comment.id === parentId);
    const prevReplies = commentsCopy[index].replies;
    commentsCopy[index].replies = resp.data;
    setComment("");
    setComments(commentsCopy);
    setPostingComment(false);
  }

  async function handleLike(id, hasLiked) {
    const commentsCopy = [...comments];
    const index = commentsCopy.findIndex((comment) => comment.id === id);
    const prevLikes = comments[index].likes;
    if (hasLiked) {
      const newLikes = prevLikes.filter(
        (like) => like.userId !== loggedInUser.id
      );

      commentsCopy[index].noOfLikes = commentsCopy[index].noOfLikes - 1;
      commentsCopy[index].likes = newLikes;
    } else {
      commentsCopy[index].noOfLikes = commentsCopy[index].noOfLikes + 1;
      commentsCopy[index].likes = [...prevLikes, { userId: loggedInUser.id }];
    }

    setComments(commentsCopy);
    console.log({ commentsCopy });

    const resp = await axiosInstance
      .post("post-like/", {
        commentId: id,
        userId: loggedInUser.id,
        hasLiked,
      })
      .catch((err) => {
        console.log(err);
      });
    commentsCopy[index] = resp.data;
    setComments(commentsCopy);
  }

  async function handleInnerLike(id, parentId, hasLiked) {
    const commentsCopy = [...comments];
    const index = commentsCopy.findIndex((comment) => comment.id === parentId);
    const replies = [...comments[index].replies];
    const innerIndex = replies.findIndex((reply) => reply.id === id);
    const prevLikes = replies[innerIndex].likes;
    if (hasLiked) {
      const newLikes = prevLikes.filter(
        (like) => like.userId !== loggedInUser.id
      );

      commentsCopy[index].replies[innerIndex].noOfLikes =
        parseInt(replies[innerIndex].noOfLikes) - 1;
      commentsCopy[index].replies[innerIndex].likes = newLikes;
    } else {
      commentsCopy[index].replies[innerIndex].noOfLikes =
        parseInt(replies[innerIndex].noOfLikes) + 1;
      commentsCopy[index].replies[innerIndex].likes = [
        ...prevLikes,
        { userId: loggedInUser.id },
      ];
    }

    setComments(commentsCopy);

    const resp = await axiosInstance
      .post("post-like/", {
        commentId: id,
        userId: loggedInUser.id,
        hasLiked,
      })
      .catch((err) => {
        console.log(err);
      });

    commentsCopy[index].replies[innerIndex] = resp.data;
    setComments(commentsCopy);
  }

  async function handleHideReplies(id) {
    const response = await axiosInstance
      .post("hide-replies", {
        id: id,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response) {
      const commentsCopy = [...comments];
      const index = commentsCopy.findIndex((comment) => comment.id === id);
      commentsCopy[index].replies = [];
      setComments(commentsCopy);
    }
  }

  async function handleReplyToReplySubmit(replyParams) {
    const { event, comment, publishToProfile, parentId, grandParentId } =
      replyParams;
    event.preventDefault();
    const resp = await axiosInstance
      .post("post-comment", {
        comment,
        publishToProfile,
        parentId,
        authorId: loggedInUser.id,
        publishToProfile,
        orderBy: sortBy,
      })
      .catch((err) => {
        console.log(err);
        setPostingComment(false);
      });

    const commentsCopy = [...comments];
    const index = commentsCopy.findIndex(
      (comment) => comment.id === grandParentId
    );
    const replies = commentsCopy[index].replies;
    const innerIndex = replies.findIndex((reply) => reply.id === parentId);
    replies[innerIndex].replies = resp.data;
    commentsCopy[index].replies = replies;
    setComment("");
    setComments(commentsCopy);
    setPostingComment(false);
  }

  async function fetchReplies(id, parentId) {
   await axiosInstance
      .get(`get-comments/${id}/order-by/${sortByString}`)
      .then((resp) => {
        const commentsCopy = [...comments];
        const index = commentsCopy.findIndex(
          (comment) => comment.id === parentId
        );
        const replies = [...commentsCopy[index].replies];
        const innerIndex = replies.findIndex((reply) => reply.id === id);
        commentsCopy[index].replies[innerIndex].replies = resp.data;
        
        setComments(commentsCopy);
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }

  return (
    <div>
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        data-bs-backdrop="false"
        aria-labelledby="offcanvasRightLabel"
        style={{ overflowY: "scroll" }}
      >
        <div id="all" className="all">
          <div className="offcanvas-header">
            <div className="switch-toggle">
              <input type="checkbox" id="bluetooth" />
              <label htmlFor="bluetooth" id="label"></label>
            </div>
            <button
              type="button"
              className="btn-close text-reset"
              id="closev"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <i className="fas fa-close"></i>
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="main-content mb-3" id="cover">
              <div style={{ width: "100%" }} id="main-content" className="t">
                <Input
                  postingComment={postingComment}
                  handleSubmit={handleSubmit}
                  comment={comment}
                  setComment={setComment}
                  showResponses
                  responsesLength={comments.length}
                />

                {/* most relivant  */}

                <div className="mt-5">
                  <div className="dropdown">
                    <strong
                      style={{ textTransform: "uppercase" }}
                      className="dropbtn small"
                    >
                      {sortBy + " "}
                      <i className="fa-solid fa-chevron-down"></i>
                    </strong>
                    <div className="dropdown-content">
                      <button onClick={() => setSortBy("Most Relevant")}>
                        Most relevant
                      </button>
                      <button onClick={() => setSortBy("Most Recent")}>
                        Most Recent
                      </button>
                    </div>
                  </div>

                  {loadingComments ? (
                    <h1>Loading comments</h1>
                  ) : (
                    comments &&
                    comments.map((comment, i) => {
                      return (
                        <div key={i}>
                          <Comment
                            handleReplySubmit={handleReplySubmit}
                            handleLike={handleLike}
                            handleInnerLike={handleInnerLike}
                            data={comment}
                            handleHideReplies={handleHideReplies}
                            handleReplyToReplySubmit={handleReplyToReplySubmit}
                            fetchReplies={fetchReplies}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* popup */}

      <div className=" fixed-bottom controls" id="open">
        <div className="lower-controls">
          <div>
            <i className="fa-regular fa-heart m-1"> </i>
            {/* <i className="m-1 fa-solid fa-up-long"></i> */}
            <span>1k</span>
          </div>
          <div>
            <span className="middle">|</span>
          </div>
          <div>
            <i
              className="fas fa-comment"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
              style={{ cursor: "pointer" }}
            ></i>{" "}
            <span>1k</span>
          </div>
        </div>
      </div>

      {/* End popup */}
    </div>
  );
}

export default CommentPlug;

window.onload = () => {
  console.log("version 1 - comment plug");
  window.addEventListener("scroll", function scroll(event) {
    if (window.scrollY === window.innerHeight) {
      document.getElementById("open").style.opacity = 1;
    } else {
      document.getElementById("open").style.opacity = 0;
    }
  });
  let input = document.getElementById("message");
  let send = document.getElementById("send");
  // input.addEventListener("focus", function () {
  //   send.classList.add("sendfocus");
  //   send.classList.remove("send");
  // });
  // close = () => {
  //     document.getElementById('main-content').style.visibility = "hiddex"
  // }

  const body = document.getElementById("all");
  const btn = document.getElementById("bluetooth");
  const closev = document.getElementById("btn-close");
  const b = document.getElementById("b");
  const vb = document.getElementById("vb");

  body.style.backgroundColor = "white";

  btn.addEventListener("click", function onClick(event) {
    const backgroundColor = body.style.backgroundColor;
    b.style.color = "white";

    if (backgroundColor === "white") {
      body.style.backgroundColor = "#394253";
      body.style.color = "white";
      closev.style.color = "white";
    } else {
      body.style.backgroundColor = "white";
      body.style.color = "black";
      b.style.color = "black";
      vb.style.color = "black";
    }
  });
};
