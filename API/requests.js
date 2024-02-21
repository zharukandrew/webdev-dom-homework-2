import { formDate, clearForm, gifLoad } from "../script.js";
import { renderComments } from "../js/render.js";
import { comments } from "../js/localData.js";

let isLoad = false;
let loginToken = {
  token: null,
  get: function () {
    return this.token;
  },
  set: function (newValue) {
    this.token = newValue;
  },
};

const host = "https://wedev-api.sky.pro/api/v2/andrey-zharuck/comments";

const getData = async () => {
  gifLoad.style.display = "block";

  try {
    let response = await fetch(host, {
      method: "GET",
      headers: {
        "Content-Type": "application/activity+json",
        Authorization: loginToken.get(),
      },
    });
    if (!response.ok) {
      alert(`Ошибка при получении данных, статус: ${response.statusText}`);
      return;
    }
    let responseData = await response.json();
    let appComments = responseData.comments.map((comment) => {
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
    comments.set(appComments);
    gifLoad.style.display = "none";
    renderComments();
  } catch (error) {
    alert(`Error adding comment: ${error}`);
  }
  // Второй участок кода
  return fetch(host)
    .then((response) => {
      if (response.status === 401) {
        password = prompt("Введите верный пароль");
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
};

function PostComment(newComment) {
  gifLoad.style.display = "block";

  fetch(host, {
    method: "POST",
    headers: {
      "Content-Type": "application/activity+json",
      Authorization: loginToken.get(),
    },
    body: JSON.stringify({
      name: newComment.name,
      text: newComment.text,
      forceError: true,
    }),
  })
    .then((response) => {
      if (response.status === 400) {
        alert("Данные должны быть не короче 3 символов");
        return;
      }
      if (response.status === 500) {
        alert("Проблема с интернетом .Упал сервер");
        return;
      }
      gifLoad.style.display = "none";

      clearForm();
      getData();
    })
    .catch((error) => {
      alert("Неполадки с интернетом. Пожалуйста, проверьте соединение.", error);
    });
}

function deleteComment(e) {
  gifLoad.style.display = "block";
  fetch("https://wedev-api.sky.pro/api/v2/andrey-zharuck/comments/" + e.target.id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/activity+json",
      Authorization: loginToken.get(),
    },
  })
    .then((response) => {
      if (response.ok) {
        gifLoad.style.display = "none";

        getData();
      }
    })
    .catch((error) => {
      alert("Что то пошло не так...");
    });
}

function loginUser(user) {
  gifLoad.style.display = "block";

  return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
    method: "POST",
    body: JSON.stringify(user),
  }).then((res) => {
    console.log(res);
    if (res.status === 400) {
      throw new Error("Не верный логин или пароль");
    }
    return res.json();
  });
}

function registerUser(user) {
  gifLoad.style.display = "block";
  return fetch("https://webdev-hw-api.vercel.app/api/user", {
    method: "POST",
    body: JSON.stringify(user),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

function PostLikes(e) {
  gifLoad.style.display = "block";
  fetch(host + `/${e.target.id}/toggle-like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/activity+json",
      Authorization: loginToken.get(),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      gifLoad.style.display = "none";
      getData();
    })
    .catch((error) => {
      alert("Что то пошло не так...");
    });
}

export {
  getData,
  PostComment,
  deleteComment,
  loginToken,
  loginUser,
  registerUser,
  PostLikes,
};
