import { comments }from "../js/localData.js";
import { editComment, saveComment, likesComment, uberComments } from "../script.js"


const commentsList = document.querySelector(".comments");


// ------------------------------------ Рендер списка комментариев -------------------------------------------
function renderComments() {
    commentsList.innerHTML = "";
    comments.get().forEach((comment) => {
      commentsList.innerHTML += `
      <li class="comment" id=${comment.id}>
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
            <button class=${
              comment.liked ? "like-button_like-button-red" : "like-button"
            } id="${comment.id}" data-post-index="likeBtn"></button>
          </div>
        </div>
      </li>`;
    });
    // ------------------------------------ / Рендер списка комментариев ------------------------------------------------
  
    // --------------------------------- Обновление слушателей -----------------------------------------------------
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
export { renderComments }