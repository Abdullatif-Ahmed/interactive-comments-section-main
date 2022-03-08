let commentsCon = document.querySelector(".comments-con");
let sendBtn = document.getElementById("sendBtn");
let textArea = document.querySelector(".addComment-sec textarea");
let str = "abcdefghijklmnopqrstuvwxyz";
let respondData;
let currentUserId;
let request = new XMLHttpRequest();

request.onload = function () {
  if (this.readyState === 4 && this.status === 200) {
    respondData = JSON.parse(this.responseText);
    currentUserId = respondData.currentUser.id;
    respondData.comments.forEach((comment) => {
      fetchTheDate(comment);
    });
  }
};

request.open("Get", "data.json", true);
request.send();

function fetchTheDate(comment) {
  addCommentToPage(comment, commentsCon);
  if (comment.replies.length) {
    let commentEl = document.getElementById(comment.id);
    let subComment = document.createElement("div");
    subComment.className = "sub-comments";
    commentEl.appendChild(subComment);
    comment.replies.forEach((Scomment) => {
      addCommentToPage(Scomment, subComment, comment.id);
    });
  }
}
function addCommentToPage(obj, el, replyingId) {
  el.innerHTML += `  <div class="comment-box" id="${obj.id}">
    <div class="comment" >
      <div class="comment-heading">
        <div class="user-img-con">
          <img
            class="user-img"
            src="${obj.user.image.png}"
            alt=""
          />
        </div>
        <h2 class="comment-user-name">${obj.user.username}</h2>
        ${obj.user.id === currentUserId ? `<span class="you">you</span>` : ""}
        <span class="comment-date">${obj.createdAt}</span>
      </div>
      <div class="comment-content-con">
        <p class="comment-content">
        ${
          obj.replyingTo
            ? `<span class="reply-to">@${obj.replyingTo}</span>`
            : ""
        }
          ${obj.content}
        </p>
      </div>
      <div class="comment-bottom">
        <div class="score-con">
          <button id="increment-btn" onclick="increScoreComment('${obj.id}')">
          <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
          </button>
          <span class="score">${obj.score}</span>
          <button id="decrement-btn" onclick="decreScoreComment('${obj.id}')">
          <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>          </button>
        </div>
        <div class="comment-btns">
          ${
            obj.user.id === currentUserId
              ? `<button id="delete-btn" data-id="${
                  obj.id
                }" onclick="deleteComment('${
                  obj.id
                }')" ><img src="images/icon-delete.svg" alt="" /> Delete</button> <button id="edit-btn" data-id="${
                  obj.id
                }" onclick="editComment('${obj.id}','${
                  obj.replyingTo ? obj.replyingTo : ""
                }')" > <img src="images/icon-edit.svg" alt="" /> Edit</button>`
              : `<button id="reply" data-id = "${
                  obj.id
                }" onclick="replyComment('${obj.id}','${obj.user.username}','${
                  obj.replyingTo ? obj.replyingTo : ""
                }')">
            <img src="images/icon-reply.svg" alt="" /> Reply
          </button>`
          }
        </div>
      </div>
    </div>
   
  
</div>
`;
}
function deleteComment(commentId) {
  document.body.innerHTML += `<div class="overlay"></div>
  <div class="delete-modal"><h3>Delete comment</h3>
  <p>Are you sure you want to delete this comment? This Will remove the comment and can't be undone.</p>
  <div class="delete-modal-bottom">
  <button class="btn-style" id="modalCancelDelete-btn">NO, CANCEL</button>
  <button class="btn-style" id="modalDelete-btn">YES, DELETE</button>

  </div>
  </div>`;
  document.getElementById("modalDelete-btn").addEventListener("click", () => {
    document.querySelector(`#${commentId}`).remove();
    document.querySelector(".delete-modal").remove();
    document.querySelector(".overlay").remove();
  });
  document
    .getElementById("modalCancelDelete-btn")
    .addEventListener("click", () => {
      document.querySelector(".delete-modal").remove();
      document.querySelector(".overlay").remove();
    });
}

function editComment(commentId, replyingTo) {
  let commentContentCon = document.querySelector(
    `#${commentId} .comment .comment-content-con`
  );
  let p = document.querySelector(
    `#${commentId} .comment .comment-content-con .comment-content`
  );

  if (replyingTo) {
    document
      .querySelector(
        `#${commentId} .comment .comment-content-con .comment-content .reply-to`
      )
      .remove();
  }

  p.setAttribute("contenteditable", "true");
  p.focus();
  let updateBtn = document.querySelector("button");
  updateBtn.innerHTML = "UPDATE";
  updateBtn.className = "btn-style";
  updateBtn.id = "updateBtn";
  commentContentCon.appendChild(updateBtn);
  updateBtn.addEventListener("click", () => {
    if (p.innerHTML.length === 0) {
      return "";
    } else {
      commentContentCon.innerHTML = `<p class="comment-content">
      ${replyingTo ? `<span class="reply-to">@${replyingTo}</span>` : ""}
      ${p.innerHTML}
      <p>`;
    }
  });
}
function replyComment(id, replyingTo, ifReplyCom) {
  if (ifReplyCom) {
    document.querySelector(`#${id}`).classList.add("replyComment");
  }
  if (!document.querySelector(`#${id} .sub-comments`)) {
    let subC = document.createElement("div");
    subC.className = "sub-comments";
    document.querySelector(`#${id}`).appendChild(subC);
  }
  let SubComments = document.querySelector(`#${id} .sub-comments`);
  document
    .querySelectorAll(`#${id} .sub-comments .addComment-sec`)
    .forEach((el) => {
      el.remove();
    });
  SubComments.insertAdjacentHTML(
    "afterbegin",
    `<div class="addComment-sec">
  <textarea
    name="addComment"
    cols="30"
    rows="10"
    placeholder="Add a Reply"
  ></textarea>
  <div class="currentUserDetail">
    <div class="user-img-con">
      <img
        src="images/avatars/image-juliusomo.png"
        alt=""
        class="user-img"
      />
    </div>
    <div class="reply-btns-con">
    <button class="btn-style" id="reply-btn">REPLY</button>
    <button class="btn-style" id="reply-cancel-btn">Cancel</button>
    </div>
  </div>
</div>`
  );
  document
    .querySelector(`#${id} .sub-comments #reply-btn`)
    .addEventListener("click", () => {
      if (
        document.querySelector(`#${id} .sub-comments .addComment-sec textarea`)
          .value === ""
      ) {
        return;
      } else {
        let randomId = "";
        for (let i = 0; i < 9; i++) {
          randomId += str[Math.trunc(Math.random() * str.length)];
        }
        let obj = {
          id: randomId,
          content: document.querySelector(`#${id} .sub-comments textarea`)
            .value,
          createdAt: "0 secounds",
          score: 0,
          "score-state": "none",
          replyingTo: replyingTo,
          user: {
            image: {
              png: "images/avatars/image-juliusomo.png",
              webp: "images/avatars/image-juliusomo.webp",
            },
            username: "juliusomo",
            id: "A74fh478o",
          },
        };
        document.querySelector(`#${id} .sub-comments .addComment-sec`).remove();
        addCommentToPage(obj, document.querySelector(`#${id} .sub-comments`));
      }
    });
  document
    .querySelector(`#${id} .sub-comments #reply-cancel-btn`)
    .addEventListener("click", () => {
      document.querySelector(`#${id} .sub-comments .addComment-sec`).remove();
    });
}
sendBtn.addEventListener("click", () => {
  if (textArea.value === "") {
    return "";
  } else {
    let randomId = "";
    for (let i = 0; i < 9; i++) {
      randomId += str[Math.trunc(Math.random() * str.length)];
    }
    let createdAt;
    let date = new Date().getTime();

    let currentDate = new Date().getTime() - date;
    let years = Math.trunc(currentDate / (1000 * 60 * 60 * 24 * 30 * 12));
    let months = Math.trunc(
      (currentDate % (1000 * 60 * 60 * 24 * 30 * 12)) /
        (1000 * 60 * 60 * 24 * 30)
    );
    let days = Math.trunc(
      (currentDate % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
    );
    let Hours = Math.trunc(
      (currentDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minuts = Math.trunc((currentDate % (1000 * 60 * 60)) / (1000 * 60));
    let secounds = Math.trunc((currentDate % (1000 * 60)) / 1000);

    if (years) {
      createdAt = `${years} years ago`;
    } else if (months) {
      createdAt = `${months} months ago`;
    } else if (days) {
      createdAt = `${days} days ago`;
    } else if (Hours) {
      createdAt = `${Hours} hours ago`;
    } else if (minuts) {
      createdAt = `${minuts} minuts ago`;
    } else {
      createdAt = `${secounds} secounds ago`;
    }

    let obj = {
      id: randomId,
      content: textArea.value,
      createdAt: createdAt,
      score: 0,
      "score-state": "none",
      user: {
        image: {
          png: "images/avatars/image-juliusomo.png",
          webp: "images/avatars/image-juliusomo.webp",
        },
        username: "juliusomo",
        id: "A74fh478o",
      },
    };
    addCommentToPage(obj, commentsCon);
  }
});
function increScoreComment(id) {
  let scoreCon = document.querySelector(`#${id} .score-con`);
  let score = document.querySelector(`#${id} .score`);

  if (!scoreCon.classList.contains("up")) {
    score.innerHTML = parseInt(score.innerHTML) + 1;
    scoreCon.classList.add("up");
    scoreCon.classList.remove("down");
  }
}
function decreScoreComment(id) {
  let scoreCon = document.querySelector(`#${id} .score-con`);

  let score = document.querySelector(`#${id} .score`);
  if (!scoreCon.classList.contains("down")) {
    score.innerHTML = parseInt(score.innerHTML) - 1;
    scoreCon.classList.add("down");
    scoreCon.classList.remove("up");
  }
}
