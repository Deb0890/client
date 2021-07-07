//Get Home Button//

let journal;

const homeButton = document.getElementById("homeButton");

const journalTitle = document.getElementById("journalTitle");

homeButton.addEventListener("click", goHome);

function goHome() {
  console.log("clicked");
  window.location.href = "home.html";
}

const journalHolder = document.getElementById("journal");

const commentContainer = document.getElementById("comments-container");

const form = document.getElementById("comment-form");
form.addEventListener("submit", postComment);

journalHolder.className = "ql-editor";
let selectedId = localStorage.getItem("journal-id");
getJournalWithId(selectedId);

async function postComment(event) {
  event.preventDefault();
  let data = {
    newComment: event.target.comment.value,
  };
  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(
    `https://debtomza-server.herokuapp.com/journals/${selectedId}`,
    options
  );
  const responseJson = await response.json();
  console.log(responseJson);
  location.reload();
}

async function getJournalWithId(id) {
  let response = await fetch("https://debtomza-server.herokuapp.com/journals");
  let responseJson = await response.json();
  journal = responseJson[id - 1];
  document.title = journal.title;
  journalTitle.textContent = journal.title;
  journalHolder.innerHTML = journal.content;

  if (journal.gifUrl) {
    let gifImage = document.createElement("img");
    gifImage.setAttribute("src", journal.gifUrl);
    journalHolder.appendChild(gifImage);
  }

  let comments = journal.comments;
  comments.forEach((comment) => createComment(comment));
  renderInteractionBar();
}

function createComment(comment) {
  let div = document.createElement("div");
  div.textContent = comment;
  commentContainer.appendChild(div);
}

let smileEmoji, laughEmoji, unhappyEmoji;

function renderInteractionBar() {
  let numComments = journal.comments.length;
  const commentsElement = document.getElementById("num-comments");
  const dateElement = document.getElementById("date");
  // const emojiElement = document.getElementById('emojis');
  // emojiElement.innerHTML = ``
  smileEmoji = document.getElementById("smile");
  smileEmoji.innerHTML += journal.emojis[0];
  smileEmoji.addEventListener("click", () => incrementCount("smile"));

  laughEmoji = document.getElementById("laugh");
  laughEmoji.innerHTML += journal.emojis[1];
  laughEmoji.addEventListener("click", () => incrementCount("laugh"));

  unhappyEmoji = document.getElementById("unhappy");
  unhappyEmoji.innerHTML += journal.emojis[2];
  unhappyEmoji.addEventListener("click", () => incrementCount("unhappy"));

  dateElement.textContent = journal.date;
  if (numComments === 1) {
    commentsElement.textContent = `${numComments} comment`;
  } else {
    commentsElement.textContent = `${numComments} comments`;
  }
}

function incrementCount(emoji) {
  let regex = /\d+/;

  if (emoji === "smile") {
    changeInnerHTML(smileEmoji);
    let emojiArray = journal.emojis;
    emojiArray[0] += 1;
    sendEmojiUpdate(emojiArray);
  }

  if (emoji === "laugh") {
    changeInnerHTML(laughEmoji);
    let emojiArray = journal.emojis;
    emojiArray[1] += 1;
    sendEmojiUpdate(emojiArray);
  }

  if (emoji === "unhappy") {
    changeInnerHTML(unhappyEmoji);
    let emojiArray = journal.emojis;
    emojiArray[2] += 1;
    sendEmojiUpdate(emojiArray);
  }
}

function changeInnerHTML(emojiElement) {
  let regex = /\d+/;
  let numStr = emojiElement.innerHTML.match(regex)[0];
  let digits = numStr.length;
  let num = parseInt(numStr);
  emojiElement.innerHTML = emojiElement.innerHTML.slice(
    0,
    emojiElement.innerHTML.length - digits - 1
  );
  emojiElement.innerHTML += String(num + 1);
}

async function sendEmojiUpdate(emojis) {
  let data = {
    emojis,
  };
  const options = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(
    `https://debtomza-server.herokuapp.com/journals/${selectedId}`,
    options
  );
  const responseJson = await response.json();
  console.log(responseJson);
}