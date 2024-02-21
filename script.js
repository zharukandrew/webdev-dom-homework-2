import { getData, PostComment, PostLikes} from "./API/requests.js";
import { renderComments } from "./js/render.js";
import { comments } from "./js/localData.js";
// --------------------------------- Переменные --------------------------------------------------------

const gifLoad = document.querySelector(".gif");


let valueInputName = "";
let valueInputText = "";



// --------------------------------- // Переменные --------------------------------------------------------

// -------------------------------- Вспомогательные функции --------------------------------------------


function clearForm() {
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
    document.querySelector('.add-form-button').disabled = false;
  } else {
    document.querySelector('.add-form-button').disabled = true;
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

// getData();
renderComments()

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
  console.log('edit')
  e.stopPropagation();
  let id = e.target.id;
  let changeArr = comments.get().map((comment) =>
    comment.id === id ? { ...comment, isEdit: !comment.isEdit } : comment
  );
  comments.set(changeArr)
  renderComments();
}

function saveComment(e) {
  e.stopPropagation();
  let id = e.target.id;
  let updatedName = document.querySelector(`input[id="${id}"]`).value;
  let updatedText = document.querySelector(`textarea[id="${id}"]`).value;
  let changeArr = comments.get().map((comment) =>
    comment.id === id
      ? {
          ...comment,
          name: getSafeHtmlString(updatedName),
          text: getSafeHtmlString(updatedText),
          isEdit: !comment.isEdit,
        }
      : comment
  );
  comments.set(changeArr)
  renderComments();
}


function uberComments(e) {
  if (e.target.classList.contains("comment")) {
    let id = e.target.id;
    let com = comments.get().find((comment) => comment.id === id);
    let text = `QUOTE_BEGIN${com.text} ${com.name}QUOTE_END`;
    document.querySelector(".add-form-text").value = text;
    valueInputText = text;
  }
  return;
}

// function likesComment(e) {
//   e.stopPropagation();
//   let id = e.target.id;

//   delay(1000).then(() => {
//     let changeArr = comments.get().map((comment) => {
//       if (comment.id === id && comment.liked === false) {
//         return { ...comment, liked: !comment.liked, likes: 1 };
//       } else if (comment.id === id && comment.liked === true) {
//         return { ...comment, liked: !comment.liked, likes: 0 };
//       } else {
//         return comment;
//       }
//     });
//     comments.set(changeArr)
//     renderComments();
//   });
// }
function likesComment(e) {
  e.stopPropagation();
  let id = e.target.id;
  delay(1000).then(() => {
    let changeArr = comments.get().map((comment) => {
      if (comment.id === id && comment.liked === false) {
        // Update the likes in local storage
        let updatedLikes = comment.likes + 1;
        localStorage.setItem(`likes_${id}`, updatedLikes);
        return { ...comment, liked: !comment.liked, likes: updatedLikes };
      } else if (comment.id === id && comment.liked === true) {
        // Update the likes in local storage
        let updatedLikes = comment.likes - 1;
        localStorage.setItem(`likes_${id}`, updatedLikes);
        return { ...comment, liked: !comment.liked, likes: updatedLikes };
      } else {
        return comment;
      }
    });
    comments.set(changeArr);
    renderComments();
  });
}



function handleEnterKey(e) {
  if (e.key === "Enter") {
    addComment();
  }
}

// ---------------------------------- / Логика по работе с комментариями ---------------------------------------

// ------------------------------------ Слушатели ------------------------------------------------------------------


const handleNameInput = (e) => {
  valueInputName = e.target.value;
  validationForm();
};

const handleTextInput = (e) => {
  valueInputText = e.target.value;
  validationForm();
};



// ------------------------------------ / Слушатели ------------------------------------------------------------------





export { formDate, clearForm, editComment, saveComment, likesComment, uberComments ,addComment ,handleNameInput,handleTextInput, gifLoad}
