// import { formDate, clearForm, gifLoad } from "../script.js";
// import { renderComments } from "../js/render.js";
// import { comments } from "../js/localData.js";

// const host = "https://wedev-api.sky.pro/api/v2/andrey-zharuck/comments";
// let loginToken = {
//   token: null,
//   get: function () {
//     return this.token;
//   },
//   set: function (newValue) {
//     this.token = newValue;
//   },
// };

// const getData = async () => {
//   gifLoad.style.display = "block";

//   try {
//     let response = await fetch(host, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/activity+json",
//         Authorization: loginToken.get(),
//       },
//     });
//     if (!response.ok) {
//       throw new Error('При получении данных произошла ошибка...');
//     }
//     let responseData = await response.json();
//     let appComments = responseData.comments.map((comment) => {
//       return {
//         id: comment.id,
//         date: formDate(comment.date),
//         name: comment.author.name,
//         text: comment.text,
//         isEdit: false,
//         likes: comment.likes,
//         liked: comment.isLiked,
//       };
//     });
//     comments.set(appComments);
//     gifLoad.style.display = "none";
//     renderComments();
//   } catch (error) {
//     gifLoad.style.display = "none";
//     alert(`${error.message}`);
//   }
// };

// function PostComment(newComment) {
//   gifLoad.style.display = "block";

//   fetch(host, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/activity+json",
//       Authorization: loginToken.get(),
//     },
//     body: JSON.stringify({
//       name: newComment.name,
//       text: newComment.text,
//       forceError: true,
//     }),
//   })
//     .then((response) => {
//       if (response.status === 400) {
//         throw new Error("Данные должны быть не короче 3 символов");
//       }
//       if (response.status === 500) {
//         throw new Error("Проблема с интернетом. Упал сервер");
//       }
//       gifLoad.style.display = "none";

//       clearForm();
//       getData();
//     })
//     .catch((error) => {
//       gifLoad.style.display = "none";
//       alert(error.message);
//     });
// }

// function deleteComment(e) {
//   gifLoad.style.display = "block";
//   fetch("https://wedev-api.sky.pro/api/v2/andrey-zharuck/comments/" + e.target.id, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/activity+json",
//       Authorization: loginToken.get(),
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('При удалени возникла ошибка')
//       }

//       gifLoad.style.display = "none";
//       getData();
//     })
//     .catch((error) => {
//       gifLoad.style.display = "none";
//       alert(error.message);
//     });
// }

// function loginUser(user) {
//   gifLoad.style.display = "block";

//   return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
//     method: "POST",
//     body: JSON.stringify(user),
//   })
//   .then((res) => {
//     if (res.status === 400) {
//       throw new Error("Не верный логин или пароль");
//     }
//     return res.json();
//   });
// }

// function registerUser(user) {
//   gifLoad.style.display = "block";
  
//   // Check if login or password contains only spaces
//   if (user.login.trim() === "" || user.password.trim() === "" || /\s/.test(user.login) || /\s/.test(user.password)) {
//     alert("Логин и пароль не могут быть пустыми или содержать только пробелы.");
//     gifLoad.style.display = "none";
//     return Promise.reject(new Error("Логин и пароль не могут быть пустыми или содержать только пробелы."));
//   }
  
//   return fetch("https://webdev-hw-api.vercel.app/api/user", {
//     method: "POST",
//     body: JSON.stringify(user),
//   })
//   .then((response) => {
//     if (response.status === 400) {
//       throw new Error("Такой пользователь уже существует");
//     }
//     return response.json();
//   })
//   .then((data) => {
//     loginToken.set(data.user.token); // Remove the quotes around the token
//     localStorage.setItem('userData', JSON.stringify(data.user));
//     gifLoad.style.display = "none";
//     getData();
//   })
//   .catch((error) => {
//     gifLoad.style.display = "none";
//     alert(error.message);
//   });
// }

// function PostLikes(e) {
//   gifLoad.style.display = "block";
//   fetch(host + `/${e.target.id}/toggle-like`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/activity+json",
//       Authorization: loginToken.get(),
//     },
//   })
//     .then((response) => {
//       if(!response.ok) {
//         throw new Error('Ошибка при добавлении лайка')
//       }
//        return response.json()
//     })
//     .then((data) => {
//       gifLoad.style.display = "none";
//       getData();
//     })
//     .catch((error) => {
//       gifLoad.style.display = "none";
//       alert(error.message);
//     });
// }

// export {
//   getData,
//   PostComment,
//   deleteComment,
//   loginToken,
//   loginUser,
//   registerUser,
//   PostLikes,
// };


import { formDate, clearForm, gifLoad } from "../script.js";
import { renderComments } from "../js/render.js";
import { comments } from "../js/localData.js";

const host = "https://wedev-api.sky.pro/api/v2/andrey-zharuck/comments";
let loginToken = {
  token: null,
  get: function () {
    return this.token;
  },
  set: function (newValue) {
    this.token = newValue;
  },
};

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
      throw new Error('При получении данных произошла ошибка...');
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
    gifLoad.style.display = "none";
    alert(`${error.message}`);
  }
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
        throw new Error("Данные должны быть не короче 3 символов");
      }
      if (response.status === 500) {
        throw new Error("Проблема с интернетом. Упал сервер");
      }
      gifLoad.style.display = "none";

      clearForm();
      getData();
    })
    .catch((error) => {
      gifLoad.style.display = "none";
      alert(error.message);
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
      if (!response.ok) {
        throw new Error('При удалени возникла ошибка')
      }

      gifLoad.style.display = "none";
      getData();
    })
    .catch((error) => {
      gifLoad.style.display = "none";
      alert(error.message);
    });
}

// function loginUser(user) {
//   gifLoad.style.display = "block";

//   return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
//     method: "POST",
//     body: JSON.stringify(user),
//   })
//   .then((res) => {
//     if (res.status === 400) {
//       throw new Error("Не верный логин или пароль");
//     }
//     return res.json();
//   });
// }

// function registerUser(user) {
//   gifLoad.style.display = "block";
  
//   // Check if login or password contains only spaces
//   if (user.login.trim() === "" || user.password.trim() === "" || /\s/.test(user.login) || /\s/.test(user.password)) {
//     alert("Логин и пароль не могут быть пустыми или содержать только пробелы.");
//     gifLoad.style.display = "none";
//     return Promise.reject(new Error("Логин и пароль не могут быть пустыми или содержать только пробелы."));
//   }
  
//   return fetch("https://webdev-hw-api.vercel.app/api/user", {
//     method: "POST",
//     body: JSON.stringify(user),
//   })
//   .then((response) => {
//     if (response.status === 400) {
//       throw new Error("Такой пользователь уже существует");
//     }
//     return response.json();
//   })
//   .then((data) => {
//     loginToken.set(data.user.token); // Remove the quotes around the token
//     localStorage.setItem('userData', JSON.stringify(data.user));
//     gifLoad.style.display = "none";
//     getData();
//   })
//   .catch((error) => {
//     gifLoad.style.display = "none";
//     alert(error.message);
//   });
// }
function loginUser(user) {
  gifLoad.style.display = "block";

  return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
    method: "POST",
    body: JSON.stringify(user),
  })
  .then((res) => {
    if (res.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return res.json();
  })
  .then((data) => {
    loginToken.set(data.user.token); // Убираем кавычки вокруг токена
    localStorage.setItem('userData', JSON.stringify(data.user));
    gifLoad.style.display = "none";
    getData();
  })
  .catch((error) => {
    gifLoad.style.display = "none";
    alert(error.message);
  });
}

function registerUser(user) {
  gifLoad.style.display = "block";

  // Проверка, содержат ли логин или пароль только пробелы
  if (user.login.trim() === "" || user.password.trim() === "" || /\s/.test(user.login) || /\s/.test(user.password)) {
    alert("Логин и пароль не могут быть пустыми или содержать только пробелы.");
    gifLoad.style.display = "none";
    return Promise.reject(new Error("Логин и пароль не могут быть пустыми или содержать только пробелы."));
  }

  return fetch("https://webdev-hw-api.vercel.app/api/user", {
    method: "POST",
    body: JSON.stringify(user),
  })
  .then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  })
  .then((data) => {
    loginToken.set(data.user.token); // Убираем кавычки вокруг токена
    localStorage.setItem('userData', JSON.stringify(data.user));
    gifLoad.style.display = "none";
    getData();
  })
  .catch((error) => {
    gifLoad.style.display = "none";
    alert(error.message);
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
    .then((response) => {
      if(!response.ok) {
        throw new Error('Ошибка при добавлении лайка')
      }
       return response.json()
    })
    .then((data) => {
      gifLoad.style.display = "none";
      getData();
    })
    .catch((error) => {
      gifLoad.style.display = "none";
      alert(error.message);
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

