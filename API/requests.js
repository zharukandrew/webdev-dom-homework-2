import { showForm, formDate, clearForm, disabledBtn } from '../script.js'
import { renderComments } from '../js/render.js';
import { comments } from '../js/localData.js';

let isLoad = false;



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
      showForm(isLoad);
    } catch (error) {
      alert(`Error adding comment: ${error}` );
    }
  };


  
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
          alert("Проблема с интернетом .Упал сервер");
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

  export { getData, PostComment, comments }