import { formDate, clearForm } from '../script.js'
import { renderComments } from '../js/render.js';
import { comments } from '../js/localData.js';

let isLoad = false;

let loginToken = {
  token: null,
  get: function () {
    return this.token
  },
  set: function (newValue) {
    this.token = newValue;
  }
}


const host = "https://wedev-api.sky.pro/api/v2/andrey-zharuck/comments";

 
const getData = async () => {
    isLoad = true;
    // showForm(isLoad);
    try {
      let response = await fetch(
        host,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/activity+json",
            Authorization: loginToken.get(),
          },
        }
      );
      if (!response.ok) {
        alert(`Ошибка при получении данных, статус: ${response.statusText}`);
        return
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
      renderComments();
      isLoad = false;
      // showForm(isLoad);
    } catch (error) {
      alert(`Error adding comment: ${error}` );
    }
    // Второй участок кода
    return fetch(host,)
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
    fetch(host, {
      method: "POST",
      headers: {
        "Content-Type": "application/activity+json",
        Authorization: loginToken.get(),
      },
      body: JSON.stringify({ name: newComment.name, text: newComment.text, forceError: true }),
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
        clearForm();
        getData();
      })
      .catch((error) => {
        alert("Неполадки с интернетом. Пожалуйста, проверьте соединение.", error);
      });
  }


  function deleteComment (id) {
    
    fetch("https://wedev-api.sky.pro/api/v2/andrey-zharuck/comments/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/activity+json",
        Authorization: loginToken.get(),
      },
    })
    .then((response) => {
      if (response.ok) {
        getData();
      }
    })
    .catch((error) => {
      alert('Что то пошло не так...');
    });
  }

  // "https://webdev-hw-api.vercel.app/api/user/login"
  // { login: 'Vasy', password: 123 }

function loginUser(user){
   return fetch('https://webdev-hw-api.vercel.app/api/user/login', {
      method: "POST",
      body: JSON.stringify(user)
    },
  )
  .then((res) => {
     if (res.status === 400) {
       throw new Error('Не верный логин или пароль')
     }
     return res.json()
  })
  
 
}
function registerUser(user) {
  return fetch("https://webdev-hw-api.vercel.app/api/user", {
    method: "POST",
    body: JSON.stringify(user),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
   
  });
}


export { getData, PostComment, deleteComment, loginToken, loginUser,registerUser}

