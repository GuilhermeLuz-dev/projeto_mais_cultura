import {
  createUser,
  singIn,
  logout,
  getUserState,
  handleSignInWithGoogle,
} from "../firebase/auth.js";

import { showFeedback } from "../main.js";

const btn_login = document.getElementById("btn_login");
const feedbackContainer = document.getElementById("feedbackContainer");

const handleFeedback = (message, type) => {
  feedbackContainer.innerHTML = "";
  feedbackContainer.appendChild(showFeedback(message, type));
  setTimeout(() => {
    feedbackContainer.innerHTML = "";
  }, 3000);
};

// Login
btn_login.addEventListener("click", async () => {
  handleFeedback("Fazendo login...", "info");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email && !password) {
    handleFeedback("Preencha os campos obrigatórios", "alert");
    return;
  }
  const result = await singIn(email, password);
  if (result) {
    handleFeedback("Login realizado com sucesso!", "success");
    window.location.href = "index.html";
  } else {
    handleFeedback("Erro ao fazer login", "alert");
  }
});

document
  .getElementById("button_login_google")
  .addEventListener("click", async (e) => {
    handleFeedback("Fazendo login...", "info");
    const loged = await handleSignInWithGoogle();
    if (loged) {
      const user = await getUserState();
      handleFeedback(`Bem vindo, ${user.nome}.`, "success");
      window.location.href = "index.html";
      return;
    }
    handleFeedback("Erro ao fazer login", "alert");
  });
