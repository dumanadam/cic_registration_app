import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) getCurrentUserDetails();
    });

    return unsubscribe;
  }, []);

  function getCurrentUserDetails() {
    db.ref("/users/" + auth.currentUser.uid).on("value", (snapshot) => {
      console.log("getting latest userdetails");
      setUserDetails(snapshot.val());
    });
  }

  function signup(email, password, firstName, surname) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        console.log("newuser is > ", newUser);
        console.log("newuser is > ", auth);
        db.ref("users/" + auth.currentUser.uid)
          .set({
            firstname: firstName,
            surname: surname,
            jumaDate: "",
            jumaSession: 0,
            cancelCount: 0,
            warningCount: 0,
            banned: 0,
            newsletter: 0,
          })
          .catch((e) => {
            console.log("auth context error>", e);
          });
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout(email, password) {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return auth.currentUser.updatePassword(password);
  }

  function updateFirstName(firstName) {
    console.log("firstname auth");
    let upd = db
      .ref("users/" + auth.currentUser.uid)
      .update({
        firstname: firstName,
      })
      .catch((e) => {
        console.log("firstname auth error>", e);
      });
    return upd;
  }

  function updateSurname(surName) {
    console.log("surname auth");
    let upd = db
      .ref("users/" + auth.currentUser.uid)
      .update({
        surname: surName,
      })
      .catch((e) => {
        console.log("surname auth error>", e);
      });
    return upd;
  }

  function bookSession(sessiondetails) {
    console.log("booksession auth");
    let upd = db
      .ref("users/" + auth.currentUser.uid)
      .update(sessiondetails)
      .catch((e) => {
        console.log("session auth error>", e);
      });
    return upd;
  }

  function deleteProfile(password) {
    return auth.currentUser.updatePassword(password);
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    deleteProfile,
    updateFirstName,
    updateSurname,
    bookSession,
    userDetails,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
