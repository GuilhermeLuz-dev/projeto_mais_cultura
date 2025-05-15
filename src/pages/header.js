import { getUserState, logout } from "../firebase/auth";

const btnAddEvend = document.getElementById("addEvent");
const btnLogoutLogin = document.getElementById("loginAndRegister");
const btnUser = document.getElementById("userIcon") || null;

// Função para atualizar o estado da página com base no usuário logado
const updatePageState = async () => {
  try {
    const user = await getUserState();
    if (user) {
      console.log("Usuário logado:", user);

      // Remove o endereço da pagina de login e adiciona evento de logout;
      btnLogoutLogin.parentNode.href = "";
      btnLogoutLogin.textContent = "Sair";
      btnLogoutLogin.addEventListener("click", () => {
        logout();
        updatePageState();
      });

      // Libera a função de adicionar evento
      btnAddEvend.href = "form.html";

      // Libera o ícone de usuário
      if (!btnUser) return;
      btnUser.style.display = "flex";
      btnUser.querySelector("span").textContent = user.nome;
    } else {
      console.log("Nenhum usuário logado.");

      // Adiciona o endereço da pagina de login e remove evento de logout;
      btnLogoutLogin.textContent = "Login ou Cadastro";
      btnLogoutLogin.parentNode.href = "login.html";
      btnAddEvend.href = "login.html";

      // Remove o ícone de usuário
      if (!btnUser) return;
      btnUser.style.display = "none";
    }
  } catch (error) {
    console.error("Erro ao atualizar o estado da página:", error);
  }
};

// Verificando se há usuário logado
document.addEventListener("DOMContentLoaded", updatePageState);
