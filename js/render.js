import { comments } from "../js/localData.js";
import {
  editComment,
  saveComment,
  likesComment,
  uberComments,
  addComment,
  handleNameInput,
  handleTextInput,
} from "../script.js";
import {
  getData,
  loginToken,
  PostLikes,
  deleteComment,
} from "../API/requests.js";
import { renderLoginForm } from "../components/renderForm.js";

const commentsList = document.querySelector(".comments");
const formBox = document.querySelector(".form-wrapper");

// ------------------------------------ Рендер списка комментариев -------------------------------------------
function renderComments() {
  if (!loginToken.get()) {
    renderLoginForm(formBox, getData);
  }

  commentsList.innerHTML = "";
  comments.get().forEach((comment) => {
    commentsList.innerHTML += `
      <li class="comment" id=${comment.id}>
      <div class="comment-delete">
         <button id=${comment.id} class="comment-delete__btn">&#9940;</button>
      </div>
        <div class="comment-header">
          ${
            comment.isEdit
              ? `<input value="${comment.name}" type="text" id="${comment.id}"></input>`
              : `<div>${comment.name}</div>`
          }
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          ${
            comment.isEdit
              ? `<textarea id="${comment.id}">${comment.text}</textarea>`
              : `<div class="comment-text">${comment.text
                  .replace("QUOTE_BEGIN", `<div class='quote'>`)
                  .replace("QUOTE_END", `</div>`)}</div>`
          }
        </div>
        <div class="comment-footer">
          <div class="btn">
            ${
              comment.isEdit
                ? `<button class="btn-save" id="${comment.id}">Сохранить</button>`
                : `<button class="btn-edit" id="${comment.id}">Редактировать</button>`
            }
          </div>
          <div class="likes">
            <span class="likes-counter" id="${comment.id}">${comment.likes}</span>
            <button class=${comment.liked ? "like-button_like-button-red" : "like-button"} id="${comment.id}" data-post-index="likeBtn"></button>
          </div>
        </div>
      </li>`;
  });
  // ------------------------------------ / Рендер списка комментариев ------------------------------------------------
  if (loginToken.get()) {
    const userName = JSON.parse(localStorage.getItem('userData')).login
    formBox.innerHTML = `<div class="add-form">
  <input type="text" value=${userName} class="add-form-name" placeholder=${userName} />
  <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
  <div class="add-form-row"></div>
    <button class="add-form-button" disabled = true>Написать</button>
    <button class="add-form-but" >Выход</button>
  </div>
</div>`;

    document
      .querySelector(".add-form-button")
      .addEventListener("click", addComment);
    document
      .querySelector(".add-form-name")
      .addEventListener("input", handleNameInput);
    document
      .querySelector(".add-form-text")
      .addEventListener("input", handleTextInput);
    document
      .querySelector(".add-form-but")
      .addEventListener("click", () => {
      localStorage.clear();
      loginToken.set("");
      formBox.innerHTML = "";
      window.location.reload();
    });
  }

  // --------------------------------- Обновление слушателей -----------------------------------------------------
  document.querySelectorAll(".comment-delete__btn").forEach((delBtn) => {
    delBtn.addEventListener("click", deleteComment);
  });
  document
    .querySelectorAll(".btn-edit")
    .forEach((btnEdit) => btnEdit.addEventListener("click", editComment));
  document
    .querySelectorAll(".btn-save")
    .forEach((btnSave) => btnSave.addEventListener("click", saveComment));
  document
    .querySelectorAll('[data-post-index="likeBtn"]')
    .forEach((btn) => btn.addEventListener("click", PostLikes));
  document
    .querySelectorAll(".comment")
    .forEach((comment) => comment.addEventListener("click", uberComments));

  // ------------------------------------ / Обновление слушателей -----------------------------------------------------
}
export { renderComments };

