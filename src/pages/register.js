import { createUser, handleSignUpWithGoogle } from "../firebase/auth";

const btn_cadastro = document.getElementById("btn_cadastro");

// Criando novo usuário
btn_cadastro.addEventListener("click", async (event) => {
  event.preventDefault();
  const nome = document.getElementById("newName").value;
  const celular = document.getElementById("newTel").value;
  const newEmail = document.getElementById("newEmail").value;
  const newPassword = document.getElementById("newPassword").value;

  if (nome == "" && newEmail == "" && newPassword == "") {
    alert("Preencha os campos obrigatórios");
    return;
  }
  const created = await createUser(newEmail, newPassword, nome, celular);
  if (created) {
    alert("Bem Vindo!!!");
    window.location.href = "index.html";
  }
});

// Adicionando eventos ao botões
document
  .getElementById("button_cadastro_google")
  .addEventListener("click", async (e) => {
    const loged = await handleSignUpWithGoogle();
    if (loged) {
      // window.location.href = "index.html";
    }
  });
