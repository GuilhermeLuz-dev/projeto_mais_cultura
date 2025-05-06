import {
  createUser,
  singIn,
  logout,
  getUserState,
  handleSignInWithGoogle,
} from "../firebase/auth";

const btn_login = document.getElementById("btn_login");

// Login
btn_login.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email && !password) {
    alert("Preencha os campos obrigatórios");
    return;
  }
  console.log(singIn(email, password));
});

document
  .getElementById("button_login_google")
  .addEventListener("click", async (e) => {
    const loged = await handleSignInWithGoogle();
    if (loged) {
      window.location.href = "index.html";
    }
  });
