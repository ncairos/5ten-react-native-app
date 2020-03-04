//Funciones que van a atacar a firebase, que puedan ser reutilizables en otro componente
import * as firebase from "firebase";

export const reauthenticate = password => {
  const user = firebase.auth().currentUser;
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
  return user.reauthenticateWithCredential(credentials);
};
