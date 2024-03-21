import {
  loginUser,
  registerUser,
  getData,
  loginToken,
} from "../API/requests.js";

function renderLoginForm(formBox, getData, gifLoad) {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let isLoginMode = true;

  if (!loginToken.get()) {
    formBox.innerHTML = `<div class="login__login-link">Нужно <span class="login-link">авторизоваться</span> чтобы ставить лайки</div>`;
    document.querySelector(".login-link").addEventListener("click", renderForm);
  }

  function renderForm() {
    formBox.innerHTML = `
            <div class="registration-form">
                <h3 class="registration__title">${
                  isLoginMode ? "Вход" : "Регистрация"
                }</h3>
                <div class="loader" style="display: none;">Loading...</div>
                <input type="text" class="registration-form-name" placeholder="Введите ваше имя" rows="2">
                ${
                  isLoginMode
                    ? ""
                    : `<input type="text" class="registration-form-email" placeholder="Введите логин" rows="2">`
                }
                <input type="password" class="registration-form-password" placeholder="Введите ваш пароль" rows="2">
                <div class="add-form-rows">
                    <button class="registration-button">${
                      isLoginMode ? "Войти" : "Зарегистрироваться"
                    }</button>
                    <button class="registration-button-next">${
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
          login();
        } else {
          registration();
        }
      });
  }

  function login() {
    let login = document.querySelector(".registration-form-name").value;
    let password = document.querySelector(".registration-form-password").value;

    if (!login.trim() || !password.trim()) {
      alert("Введите имя и пароль");
      return;
    }

    let user = {
      login: login,
      password: password,
    };

    loginUser(user)
      .then((user) => {
        loginToken.set(`Bearer ${user.user.token}`);
        localStorage.setItem("userData", JSON.stringify(user.user));
        getData();
      })
      .catch((e) => {
        alert(e.message);
      });
  }

  function registration() {
    let login = document.querySelector(".registration-form-name").value;
    let password = document.querySelector(".registration-form-password").value;
    let name = document.querySelector(".registration-form-email").value;

    if (!login.trim() || !password.trim() || !name.trim()) {
      alert("Введите имя, логин и пароль");
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
        localStorage.setItem("userData", JSON.stringify(user.user));
        getData();
      })
      .catch((error) => {
        alert(error.message);
      });
  }
}

export { renderLoginForm };
