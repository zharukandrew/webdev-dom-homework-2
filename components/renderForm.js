import { loginUser } from "../API/requests.js";

function renderLoginForm(formBox, loginToken, getData) {
  let isLoginMode = false;

  const renderForm = () => {
    formBox.innerHTML = `<div class="registration-form">
    <h3>${isLoginMode ? "Вход" : "Регистрация"}</h3>
    <input type="text" class="registration-form-name" placeholder="Введите ваше имя" rows="2">
    ${
      isLoginMode
        ? ""
        : `<input type="text" class="registration-form-email" placeholder="Введите ваше имя" rows="2">`
    }
    <input type="pasword" class="registration-form-pasword" placeholder="Введите ваш пароль" rows="2">
    <div class="add-form-rows">
      <button class="registration-button">${
        isLoginMode ? "Войти" : "Зарегистрироваться"
      }</button>
      <button style="color: red;" class="registration-button-next">${
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
      let login = document.querySelector(".registration-form-name").value;
      let password = document.querySelector(".registration-form-pasword").value;

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
    });
  }

renderForm()
}

export { renderLoginForm };
