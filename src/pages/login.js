import {
  createUser,
  singIn,
  logout,
  loginWithGoogle,
  getUserState,
} from "../firebase/auth";

const button_cadastro = document.getElementById("button_cadastro");
const button_login = document.getElementById("button_login");

// Criando novo usuário
button_cadastro.addEventListener("click", (event) => {
  event.preventDefault();

  const nome = document.getElementById("newName").value;
  const celular = document.getElementById("newTel").value;
  const newEmail = document.getElementById("newEmail").value;
  const newPassword = document.getElementById("newPassword").value;

  createUser(newEmail, newPassword, nome, celular);
});

// Login
button_login.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  singIn(email, password);
});

// Adicionando eventos ao botões
document
  .getElementById("button_cadastro_google")
  .addEventListener("click", loginWithGoogle);

document
  .getElementById("button_login_google")
  .addEventListener("click", loginWithGoogle);
