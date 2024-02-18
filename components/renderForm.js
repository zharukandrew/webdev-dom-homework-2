
import { loginUser, registerUser } from "../API/requests.js";
function renderLoginForm(formBox, loginToken, getData) {
  let isLoginMode = true;

  const renderForm = () => {
    formBox.innerHTML = `<div class="registration-form">
    <h3 class="registation__title">${isLoginMode ? "Вход" : "Регистрация"}</h3>
    <div class="loader" style="display: none;">Loading...</div>
    <input type="text" class="registration-form-name" placeholder="Введите ваше имя" rows="2">
    ${
      isLoginMode
        ? ""
        : `<input type="text" class="registration-form-email" placeholder="Введите логин" rows="2">`
    }
    <input type="password" class="registration-form-password" placeholder="Введите ваш пароль" rows="2">
    <div class="add-form-rows">
      <button class="registration-button">${isLoginMode ? "Войти" : "Зарегистрироваться"}</button>
      <button class="registration-button-next">${isLoginMode ? "Перейти к регистрации" : "Перейти ко входу"}</button>
    </div>
  </div>`;

    const loader = document.querySelector('.loader');

    document.querySelector(".registration-button-next").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });

    document.querySelector(".registration-button").addEventListener("click", () => {
      loader.style.display = 'block'; // Show loader

      setTimeout(() => {
        if (isLoginMode) {
          let login = document.querySelector(".registration-form-name").value;
          let password = document.querySelector(".registration-form-password").value;
          if (!login || !password) {
            alert("Введите имя и пароль");
            loader.style.display = 'none'; // Hide loader on error
            return;
          }

          let user = {
            login: login,
            password: password,
          };

          loginUser(user)
            .then((user) => {
              loginToken.set(`Bearer ${user.user.token}`);

              // Save user data to LocalStorage
              localStorage.setItem('userData', JSON.stringify(user.user));

              getData();
              loader.style.display = 'none'; // Hide loader after successful login
            })
            .catch((e) => {
              alert(e.message);
              loader.style.display = 'none'; // Hide loader on error
            });
        } else {
          let login = document.querySelector(".registration-form-name").value;
          let password = document.querySelector(".registration-form-password").value;
          let name = document.querySelector(".registration-form-email").value;
          if (!login || !password || !name) {
            alert("Введите имя, логин и пароль");
            loader.style.display = 'none'; // Hide loader on error
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

              // Save user data to LocalStorage
              localStorage.setItem('userData', JSON.stringify(user.user));

              getData();
              loader.style.display = 'none'; // Hide loader after successful registration
            })
            .catch((error) => {
              alert(error.message);
              loader.style.display = 'none'; // Hide loader on error
            });
        }
      }, 2000); // Simulating a 2-second loading time, adjust as needed
    });
  };

  // Check if user data exists in LocalStorage on page load
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData) {
    loginToken.set(`Bearer ${userData.token}`);
    getData();
  }

  renderForm();
}

export { renderLoginForm };
