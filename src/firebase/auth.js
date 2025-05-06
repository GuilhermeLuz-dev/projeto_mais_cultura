import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
} from "firebase/auth";

import { app } from "./firebaseConfig";
import { addNewUser, getUserData } from "./firestore";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Cadastrando novo usuário
const createUser = async (newEmail, newPassword, nome, celular) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newEmail,
      newPassword
    );
    const user = userCredential.user;
    await addNewUser({
      nome: nome,
      celular: celular,
      uid: user.uid,
    });
    console.log("Usuário criado com sucesso");
    return true;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert(
        "O email já está em uso. Por favor, faça login ou use outro email."
      );
    } else {
      console.error(error.message);
    }
    return false;
  }
};

// Login de usuário
const singIn = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(
        "Usuário logado com sucesso!!!" + "\n" + " Olá " + user.displayName
      );
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert("Senha ou email incorretos");
    });
};

// Autenticação pela conta do Google;
const loginWithGoogle = (e) => {
  e.preventDefault();

  e.target.id === "button_login_google"
    ? handleSignInWithGoogle()
    : handleSignUpWithGoogle();
};

// Função para fazer login com o Google
const handleSignInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      getUserData(user.uid).then((userData) => {
        if (userData.length === 0) {
          logout();
          user.delete();
          alert("Usuário não cadastrado, faça o cadastro!");
        } else {
          alert("Bem vindo de volta " + user.displayName);
          window.location.href = "index.html";
        }
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

// Função para fazer cadastro com o Google
const handleSignUpWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      getUserData(user.uid).then((userData) => {
        if (userData.length === 0) {
          addNewUser({
            nome: user.displayName,
            celular: user.phoneNumber,
            uid: user.uid,
          });
          console.log("Usuário criado com sucesso");
          window.location.href = "index.html";
        } else {
          alert("Já existe um usuário com esse email, faça o login!");
          logout();
        }
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

// Peagando dados do usuário logado;
const getUserState = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const uid = user.uid;
          const userData = await getUserData(uid);
          const currentUser = { ...userData[0], email: user.email };
          resolve(currentUser); // Retorna o usuário logado
          console.log("Usuário logado:", currentUser);
        } catch (error) {
          reject(error); // Trata erros ao buscar dados do usuário
        }
      } else {
        resolve(null); // Retorna null se nenhum usuário estiver logado
        console.log("Nenhum usuário logado");
      }
    });
  });
};

// Fazendo logout

const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("Usuário desconectado com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao desconectar:", error);
    });
};

// Ecluindo conta do usuário

const deleteAccount = () => {
  const user = auth.currentUser;
  if (user) {
    deleteUser(user)
      .then(() => {
        console.log("Conta do usuário deletada com sucesso!");
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          alert("Por favor, faça login novamente e tente novamente.");
          logout();
        } else {
          console.error("Erro ao deletar a conta:", error);
        }
      });
  } else {
    console.log("Nenhum usuário está logado.");
  }
};

export {
  createUser,
  singIn,
  loginWithGoogle,
  logout,
  getUserState,
  deleteAccount,
};
