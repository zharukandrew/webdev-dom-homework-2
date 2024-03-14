// import { gifLoad} from "../script.js";
// import { loginUser, registerUser, getData, loginToken} from "../API/requests.js";

// function renderLoginForm(formBox,  getData) {
  
//   let isLoginMode = true;

//   const renderForm = () => {
//     formBox.innerHTML = `<div class="registration-form">
//     <h3 class="registation__title">${isLoginMode ? "Вход" : "Регистрация"}</h3>
//     <div class="loader" style="display: none;">Loading...</div>
//     <input type="text" class="registration-form-name" placeholder="Введите ваше имя" rows="2">
//     ${
//       isLoginMode
//         ? ""
//         : `<input type="text" class="registration-form-email" placeholder="Введите логин" rows="2">`
//     }
//     <input type="password" class="registration-form-password" placeholder="Введите ваш пароль" rows="2">
//     <div class="add-form-rows">
//       <button class="registration-button">${isLoginMode ? "Войти" : "Зарегистрироваться"}</button>
//       <button class="registration-button-next">${isLoginMode ? "Перейти к регистрации" : "Перейти ко входу"}</button>
//     </div>
//   </div>`;

//     document.querySelector(".registration-button-next").addEventListener("click", () => {
//       isLoginMode = !isLoginMode;
//       renderForm();
//     });

//     document.querySelector(".registration-button").addEventListener("click", () => {

//         if (isLoginMode) {
//            login()
//         } else {
//            registration()
//         }
//     });
//   };

//   const userData = JSON.parse(localStorage.getItem('userData'));
//   if (userData) {
//     loginToken.set(`Bearer ${userData.token}`);
//     getData();
//   }
  
//   renderForm();
// }

// function login () {
//   let login = document.querySelector(".registration-form-name").value;
//   let password = document.querySelector(".registration-form-password").value;

//   if (!login.trim() || !password.trim()) {
//     alert("Введите имя и пароль");
//     return
//   }

//   let user = {
//     login: login,
//     password: password,
//   };

//   loginUser(user)
//     .then((user) => {
//       loginToken.set(`Bearer ${user.user.token}`);
//       localStorage.setItem('userData', JSON.stringify(user.user));
//       gifLoad.style.display = "none";

//       getData();
//     })
//     .catch((e) => {
//       gifLoad.style.display = "none";
//       alert(e.message);
//     });
// }

// function registration () {
//   let login = document.querySelector(".registration-form-name").value;
//   let password = document.querySelector(".registration-form-password").value;
//   let name = document.querySelector(".registration-form-email").value;
  
//   if (!login.trim() || !password.trim() || !name.trim()) {
//     alert("Введите имя, логин и пароль");
//     return;
//   }

//   let user = {
//     login: login,
//     password: password,
//     name: name,
//   };

//   registerUser(user)
//     .then((user) => {
//       loginToken.set(`Bearer ${user.user.token}`);

//       localStorage.setItem('userData', JSON.stringify(user.user));
//       gifLoad.style.display ="none";
//       getData();
//     })
//     .catch((error) => {
//       gifLoad.style.display = "none";
//       alert(error.message);
//     });
// }

// export { renderLoginForm };



import { loginUser, registerUser, getData, loginToken } from "../API/requests.js";

function renderLoginForm(formBox, getData, gifLoad) {
    let userData = JSON.parse(localStorage.getItem('userData'));
    let isLoginMode = true;

    const renderForm = () => {
        formBox.innerHTML = `
            <div class="registration-form">
                <h3 class="registration__title">${userData ? "Вход" : "Регистрация"}</h3>
                <div class="loader" style="display: none;">Loading...</div>
                <input type="text" class="registration-form-name" placeholder="Введите ваше имя" rows="2">
                ${userData ? "" : `<input type="text" class="registration-form-email" placeholder="Введите логин" rows="2">`}
                <input type="password" class="registration-form-password" placeholder="Введите ваш пароль" rows="2">
                <div class="add-form-rows">
                    <button class="registration-button">${userData ? "Войти" : "Зарегистрироваться"}</button>
                    <button class="registration-button-next">${userData ? "Перейти к регистрации" : "Перейти ко входу"}</button>
                </div>
            </div>`;

        document.querySelector(".registration-button-next").addEventListener("click", () => {
            isLoginMode = !isLoginMode;
            renderForm();
        });

        document.querySelector(".registration-button").addEventListener("click", () => {
            if (isLoginMode) {
                login();
            } else {
                registration();
            }
        });
    }

    const renderCommentsComponent = () => {
        formBox.innerHTML = userData ? "<div>Comments Component</div>" : `<div>Нужно <span class="login-link">авторизоваться</span> чтобы ставить лайки</div>`;
        
        if (!userData) {
            const loginLink = document.querySelector(".login-link");
            loginLink.addEventListener("click", renderForm);
        } else {
            getData();
        }
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
                localStorage.setItem('userData', JSON.stringify(user.user));
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
                localStorage.setItem('userData', JSON.stringify(user.user));
                getData();
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    renderCommentsComponent();
}

export { renderLoginForm };