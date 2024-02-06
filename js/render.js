import { comments } from "../js/localData.js";
import {
  editComment,
  saveComment,
  likesComment,
  uberComments,
  addComment,
  handleNameInput,
  handleTextInput,
  removeComment
} from "../script.js";
import { getData, loginToken } from "../API/requests.js";

const commentsList = document.querySelector(".comments");
const formBox = document.querySelector(".form-wrapper");

// ------------------------------------ Рендер списка комментариев -------------------------------------------
function renderComments() {
  if (!loginToken.get()) {
    formBox.innerHTML = `<div class="registration-form">
     <textarea type="text" class="registration-form-name" placeholder="Введите ваше имя" rows="2"></textarea>
     <textarea type="pasword" class="registration-form-pasword" placeholder="Введите ваш пароль" rows="2"></textarea>
     <div class="add-form-rows">
       <button class="registration-button">Зарегистрироваться</button>
     </div>
   </div>`;
    document
      .querySelector(".registration-button")
      .addEventListener("click", () => {
        loginToken.set(
          `Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k`
        );
        getData();
      });
    return;
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
            <span class="likes-counter" id="${comment.id}">${
      comment.likes
    }</span>
            <button class=${
              comment.liked ? "like-button_like-button-red" : "like-button"
            } id="${comment.id}" data-post-index="likeBtn"></button>
          </div>
        </div>
      </li>`;
  });
  // ------------------------------------ / Рендер списка комментариев ------------------------------------------------

  formBox.innerHTML = `<div class="add-form">
    <input type="text" class="add-form-name" placeholder="Введите ваше имя" />
    <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
    <div class="add-form-row"></div>
      <button class="add-form-button" disabled = true>Написать</button>
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

  // --------------------------------- Обновление слушателей -----------------------------------------------------
  document.querySelectorAll('.comment-delete__btn').forEach((delBtn) => {
    delBtn.addEventListener('click', removeComment)
  })
  document
    .querySelectorAll(".btn-edit")
    .forEach((btnEdit) => btnEdit.addEventListener("click", editComment));
  document
    .querySelectorAll(".btn-save")
    .forEach((btnSave) => btnSave.addEventListener("click", saveComment));
  document
    .querySelectorAll('[data-post-index="likeBtn"]')
    .forEach((btn) => btn.addEventListener("click", likesComment));
  document
    .querySelectorAll(".comment")
    .forEach((comment) => comment.addEventListener("click", uberComments));

  // ------------------------------------ / Обновление слушателей -----------------------------------------------------
}
export { renderComments };
