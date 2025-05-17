import { createUser, handleSignUpWithGoogle } from "../firebase/auth";
import { showFeedback } from "../main";

const btn_cadastro = document.getElementById("btn_cadastro");
const feedbackContainer = document.getElementById("feedbackContainer");

const handleFeedback = (message, type) => {
  feedbackContainer.innerHTML = "";
  feedbackContainer.appendChild(showFeedback(message, type));
  setTimeout(() => {
    feedbackContainer.innerHTML = "";
  }, 3000);
};

// Criando novo usuário
btn_cadastro.addEventListener("click", async (event) => {
  event.preventDefault();
  handleFeedback("Criando conta...", "info");
  const nome = document.getElementById("newName").value;
  const celular = document.getElementById("newTel").value;
  const newEmail = document.getElementById("newEmail").value;
  const newPassword = document.getElementById("newPassword").value;

  if (nome == "" && newEmail == "" && newPassword == "") {
    handleFeedback("Preencha os campos obrigatórios", "alert");
    return;
  }
  const created = await createUser(newEmail, newPassword, nome, celular);
  if (created) {
    handleFeedback("Conta criada com sucesso!", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
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
