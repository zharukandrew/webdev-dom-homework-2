let comments = [];

const addFormButton = document.querySelector(".add-form-button");
const buttonDelete = document.querySelector(".add-form-buttondelete");
const commentsList = document.querySelector(".comments");
const userComment = document.querySelector(".comms");
const nameInput = document.querySelector(".add-form-name");
const commentInput = document.querySelector(".add-form-text");
const form = document.querySelector(".add-form");
let valueInputName = "";
let valueInputText = "";

function disabledBtn() {
  addFormButton.disabled = true;
  addFormButton.classList.add("grey");
}

disabledBtn();

function clearForm() {
  nameInput.value = "";
  commentInput.value = "";
  valueInputName = "";
  valueInputText = "";
}

function validationForm() {
  if (valueInputName.trim() !== "" && valueInputText.trim() !== "") {
    addFormButton.disabled = false;
    addFormButton.classList.remove("grey");
  } else {
    disabledBtn();
  }
}

function getSafeHtmlString (inputStr) {
    return inputStr
              .replaceAll("&", "&amp;")
              .replaceAll("<", "&lt;")
              .replaceAll(">", "&gt;")
              .replaceAll('"', "&quot;");
}

function getCurrentDate() {
  const currentDate = new Date();
  return `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
}

function addComment() {
  if (valueInputName.trim() !== "" && valueInputText.trim() !== "") {
    const newComment = {
      id: Date.now(),
      date: getCurrentDate(),
      name: getSafeHtmlString(valueInputName),
      text: getSafeHtmlString(valueInputText),
      isEdit: false,
      likes: 0,
      liked: false,
    };
    comments.push(newComment);
    renderComments();
    clearForm();
    disabledBtn();
  }
}

function editComment(e) {
  let id = Number(e.target.id);
  comments = comments.map((comment) =>
    comment.id === id ? { ...comment, isEdit: !comment.isEdit } : comment
  );
  renderComments();
}

function saveComment(e) {
  let id = Number(e.target.id);
  let updatedName = document.querySelector(`input[id="${id}"]`).value;
  let updatedText = document.querySelector(`textarea[id="${id}"]`).value;
  comments = comments.map((comment) =>
    comment.id === id
      ? { ...comment, name: getSafeHtmlString(updatedName), text: getSafeHtmlString(updatedText), isEdit: !comment.isEdit }
      : comment
  );
  renderComments();
}
function likesComment(e) {
  let id = parseInt(e.target.id);
  comments = comments.map((comment) => {
    if (comment.id === id && comment.liked === false) {
      return {...comment, liked: !comment.liked, likes: 1 };
    } else if (comment.id === id && comment.liked === true) {
      return {...comment, liked: !comment.liked, likes: 0 };
    } else {
      return comment;
    }
  });
  renderComments();
}
function userComments{
  userComment.addEventListener("click",()=>{
    userComment.innerHTML +=`<div class='quote'>QUOTE_BEGIN ${comment.text} QUOTE_END</div>`
  })
  renderComments();
}
// Рендерит список комментариев
function renderComments() {
  commentsList.innerHTML = "";

  comments.forEach((comment) => {
    commentsList.innerHTML += `
    <li class ='comment'>
      <div class="comment-header">
       ${comment.isEdit 
              ? `<input value="${comment.name}" type='text' id="${comment.id}"></input>` 
              : `<div>${comment.name}</div>`
        }
       
        <div>${comment.date}</div>
      </div>
     
      <div class="comment-body">
          ${comment.isEdit 
                ? `<textarea id="${comment.id}">${comment.text}</textarea>` 
                : `<div class="comment-text">${comment.text}</div>`
               
          }
      </div>
      <div class="comment-footer">
      <div class='comms'><p>комментровать</p></div>
     
        <div class ="btn">
           ${comment.isEdit 
                 ? `<button class="btn-save" id="${comment.id}">Сохранить</button>` 
                 : `<button class="btn-edit" id="${comment.id}">Редактировать</button>`
                }
              
        </div>
        <div class="likes">
          <span class="likes-counter" id="${comment.id}">${comment.likes}</span>
          <button class=${comment.liked ? 'like-button_like-button-red' : 'like-button'} id="${comment.id}" data-post-index="likeBtn"></button>
        </div>
      </div>
     
      </li>`;
      `<div class='quote'>QUOTE_BEGIN ${comment.text} QUOTE_END</div>`
      
  });
  document.querySelectorAll('.btn-edit').forEach((btnEdit) => btnEdit.addEventListener('click', editComment));
  document.querySelectorAll('.btn-save').forEach((btnSave) => btnSave.addEventListener('click', saveComment));
  document.querySelectorAll('[data-post-index="likeBtn"]').forEach((btn) => btn.addEventListener('click', likesComment));

}

function deleteComment() {
  comments.pop();
  renderComments();
}

function handleEnterKey(e) {
  if (e.key === "Enter") {
    addComment();
  }
}

addFormButton.addEventListener("click", addComment);
form.addEventListener("keyup", handleEnterKey);
buttonDelete.addEventListener("click", deleteComment);
nameInput.addEventListener("input", (e) => {
  valueInputName = e.target.value;
  validationForm();
});
commentInput.addEventListener("input", (e) => {
  valueInputText = e.target.value;
  validationForm();
});


