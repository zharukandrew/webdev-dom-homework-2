import { loginUser, registerUser } from "../API/requests.js";

function renderLoginForm(formBox, loginToken, getData) {
  let isLoginMode = true;

  const renderForm = () => {
    formBox.innerHTML = `<div class="registration-form">
    <h3 class ="registation__title">${isLoginMode ? "Вход" : "Регистрация"}</h3>
    <input type="text" class="registration-form-name" placeholder="Введите ваше имя" rows="2">
    ${
      isLoginMode
        ? ""
        : `<input type="text" class="registration-form-email" placeholder="Введите логин" rows="2">`
    }
    <input type="pasword" class="registration-form-pasword" placeholder="Введите ваш пароль" rows="2">
    <div class="add-form-rows">
      <button class="registration-button">${
        isLoginMode ? "Войти" : "Зарегистрироваться"
      }</button>
      <button  class="registration-button-next">${
        isLoginMode ? "Перейти к регистрации" : "Перейти ко входу"
      }</button>
    </div>
  </div>`;

    document
      .querySelector(".registration-button-next")
      .addEventListener("click", () => {
        isLoginMode = !isLoginMode;
        renderForm();
      });

    document
      .querySelector(".registration-button")
      .addEventListener("click", () => {
        if (isLoginMode) {
          let login = document.querySelector(".registration-form-name").value;
          let password = document.querySelector(
            ".registration-form-pasword"
          ).value;

          if (!login) {
            alert("Введите имя");
            return;
          }

          if (!password) {
            alert("Введите пароль");
            return;
          }

          let user = {
            login: login,
            password: password,
          };

          loginUser(user)
            .then((user) => {
              loginToken.set(`Bearer ${user.user.token}`);
              getData();
            })
            .catch((e) => alert(e.message));
        } else {
          let login = document.querySelector(".registration-form-name").value;
          let password = document.querySelector(
            ".registration-form-pasword"
          ).value;
          let name = document.querySelector(".registration-form-email").value;

          if (!login) {
            alert("Введите имя");
            return;
          }

          if (!password) {
            alert("Введите пароль");
            return;
          }
          if (!name) {
            alert("Введите логин");
            return;
          }
          let user = {
            login: login,
            password: password,
            name: name,
          };
          registerUser(user)
            .then((user) => {
              loginToken.set(`Bearer ${user.user.token}`);
              getData();
            })
            .catch((error) => {
              alert(error.message);
            });
        }
      });
  };

  renderForm();
}

export { renderLoginForm };
