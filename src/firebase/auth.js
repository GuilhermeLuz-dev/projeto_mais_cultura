import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { app } from "./firebaseConfig";
import { addNewUser, getUserData } from "./firestore";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Cadastrando novo usuário
const createUser = (newEmail, newPassword, nome, celular) => {
  createUserWithEmailAndPassword(auth, newEmail, newPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      addNewUser({
        nome: nome,
        celular: celular,
        uid: user.uid,
      });
      console.log("Usuário criado com sucesso");
    })
    .catch((error) => {
      console.error(error.message);
    });
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
      console.log("Senha ou email incorretos");
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
  let currentUser = {};
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const userData = await getUserData(uid);
      currentUser = { ...currentUser, ...userData[0], email: user.email };
      console.log(currentUser);
    } else {
      console.log("nenhum usuário logado!");
    }
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

export { createUser, singIn, loginWithGoogle, logout, getUserState };
