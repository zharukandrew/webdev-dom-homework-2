// --------------------------------- Переменные --------------------------------------------------------
let comments = [];
const addFormButton = document.querySelector(".add-form-button");
const buttonDelete = document.querySelector(".add-form-buttondelete");
const commentsList = document.querySelector(".comments");
const nameInput = document.querySelector(".add-form-name");
const commentInput = document.querySelector(".add-form-text");
const form = document.querySelector(".add-form");
const gif = document.querySelector(".gif");

let valueInputName = "";
let valueInputText = "";

let isLoad = false;
// --------------------------------- // Переменные --------------------------------------------------------

// -------------------------------- Вспомогательные функции --------------------------------------------
function showForm(flag) {
  if (flag) {
    gif.classList.add("gif_gif-show");
    form.classList.add("form-add_form-add-none");
  } else {
    gif.classList.remove("gif_gif-show");
    form.classList.remove("form-add_form-add-none");
  }
}

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

function getCurrentDate() {
  const currentDate = new Date();
  return `${currentDate.getDate()}.${
    currentDate.getMonth() + 1
  }.${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
}

function formDate(data) {
  return new Date(data)
    .toLocaleString("ru-RU", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
    .replace(",", "");
}

function getSafeHtmlString(inputStr) {
  return inputStr
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function validationForm() {
  if (valueInputName.trim() !== "" && valueInputText.trim() !== "") {
    addFormButton.disabled = false;
    addFormButton.classList.remove("grey");
  } else {
    disabledBtn();
  }
}
function delay(time) {
  return new Promise((resolve, rejected) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
// -------------------------------- / Вспомогательные функции --------------------------------------------

// --------------------------------- Запросы -------------------------------------------------------------

const getData = async () => {
  isLoad = true;
  showForm(isLoad);
  try {
    let response = await fetch(
      "https://wedev-api.sky.pro/api/v1/:andrey-zharuck/comments",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/activity+json",
        },
      }
    );
    if (!response.ok) {
      alert(`Ошибка при получении данных, статус: ${response.statusText}`);
      return
    }
    let responseData = await response.json();
    const appComments = responseData.comments.map((comment) => {
      return {
        id: comment.id,
        date: formDate(comment.date),
        name: comment.author.name,
        text: comment.text,
        isEdit: false,
        likes: comment.likes,
        liked: comment.isLiked,
      };
    });
    comments = appComments;
    renderComments();
    isLoad = false;
    showForm(isLoad);
  } catch (error) {
    alert(`Error adding comment: ${error}` );
  }
};

getData();


function PostComment(newComment) {
  fetch("https://wedev-api.sky.pro/api/v1/:andrey-zharuck/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/activity+json",
    },
    body: JSON.stringify({ name: newComment.name, text: newComment.text, forceError: true }),
  })
    .then((response) => {
      if (response.status === 400) {
        alert("Данные должны быть не короче 3 символов");
        return;
      }
      if (response.status === 500) {
        alert("Упал сервер");
        return;
      }
      clearForm();
      disabledBtn();
      getData();
    })
    .catch((error) => {
      alert("Неполадки с интернетом. Пожалуйста, проверьте соединение.", error);
    });
}
// --------------------------------- //Запросы -------------------------------------------------------------

// ---------------------------------- Логика по работе с комментариями ---------------------------------------


function addComment() {
  if ((valueInputName.trim() !== "") & (valueInputText.trim() !== "")) {
    const newComment = {
      id: Date.now(),
      date: getCurrentDate(),
      name: getSafeHtmlString(valueInputName),
      text: getSafeHtmlString(valueInputText),
      isEdit: false,
      likes: 0,
      liked: false,
    };
    PostComment(newComment);
  }
}

function editComment(e) {
  e.stopPropagation();
  let id = Number(e.target.id);
  comments = comments.map((comment) =>
    comment.id === id ? { ...comment, isEdit: !comment.isEdit } : comment
  );
  renderComments();
}

function saveComment(e) {
  e.stopPropagation();
  let id = Number(e.target.id);
  let updatedName = document.querySelector(`input[id="${id}"]`).value;
  let updatedText = document.querySelector(`textarea[id="${id}"]`).value;
  comments = comments.map((comment) =>
    comment.id === id
      ? {
          ...comment,
          name: getSafeHtmlString(updatedName),
          text: getSafeHtmlString(updatedText),
          isEdit: !comment.isEdit,
        }
      : comment
  );
  renderComments();
}

function likesComment(e) {
  e.stopPropagation();
  let id = parseInt(e.target.id);
  const likeButton = e.target;
  // Добавляем класс анимации только на момент отправки лайка
  likeButton.classList.toggle("animated");

  delay(1000).then(() => {
    comments = comments.map((comment) => {
      if (comment.id === id && comment.liked === false) {
        return { ...comment, liked: !comment.liked, likes: 1 };
      } else if (comment.id === id && comment.liked === true) {
        return { ...comment, liked: !comment.liked, likes: 0 };
      } else {
        return comment;
      }
    });
    renderComments();

    // Удаляем класс анимации после завершения операции
  });
}
function uberComments(e) {
  if (e.target.classList.contains("comment")) {
    let id = Number(e.target.id);
    let com = comments.find((comment) => comment.id === id);
    let text = `QUOTE_BEGIN${com.text} ${com.name}QUOTE_END`;
    commentInput.value = text;
    valueInputText = text;
  }
  return;
}
document.querySelectorAll(".comment").forEach((comment) => {
  comment.addEventListener("click", uberComments);
});
function deleteComment() {
  comments.pop();
  renderComments();
}

function handleEnterKey(e) {
  if (e.key === "Enter") {
    addComment();
  }
}

// ---------------------------------- / Логика по работе с комментариями ---------------------------------------

// ------------------------------------ Рендер списка комментариев -------------------------------------------
function renderComments() {
  commentsList.innerHTML = "";
  comments.forEach((comment) => {
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
}

// ------------------------------------ / Обновление слушателей -----------------------------------------------------
// ------------------------------------ / Рендер списка комментариев ------------------------------------------------

// ------------------------------------ Слушатели ------------------------------------------------------------------
addFormButton.addEventListener("click", addComment);
form.addEventListener("keyup", handleEnterKey);
buttonDelete.addEventListener("click", deleteComment);

const handleNameInput = (e) => {
  valueInputName = e.target.value;
  validationForm();
};

const handleCommentInput = (e) => {
  valueInputText = e.target.value;
  validationForm();
};

nameInput.addEventListener("input", handleNameInput);
commentInput.addEventListener("input", handleCommentInput);
addFormButton.addEventListener("click", addComment);
buttonDelete.addEventListener("click", deleteComment);

// ------------------------------------ / Слушатели ------------------------------------------------------------------



