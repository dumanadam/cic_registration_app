import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import moment from "moment";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const now = moment().toString();

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
      console.log("*Google DB*getting latest userdetails");
      setUserDetails(snapshot.val());
    });
  }

  function getCurrentAdminSessions(adminCompany) {
    db.ref(
      "sessions/" + adminCompany.toLowerCase() + "/" + auth.currentUser.uid
    ).on("value", (snapshot) => {
      console.log("*Google DB*getting latest userdetails");
      setUserDetails(snapshot.val());
    });
  }

  function signup(
    email,
    password,
    firstName,
    surName,
    mobileNum,
    agreeNewsletter
  ) {
    const now = moment().toString();
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        console.log("newuser is > ", newUser);
        console.log("moment now is > ", auth);
        db.ref("users/" + auth.currentUser.uid)
          .set({
            firstname: firstName,
            surname: surName,
            mobile: mobileNum,
            jumaDate: "",
            jumaSession: "",
            cancelCount: 0,
            warningCount: 0,
            banned: 0,
            newsletter: agreeNewsletter,
            admin: 0,
            deleted: false,
            deleteDate: "",
            lastupdate: now,
          })
          .catch((e) => {
            console.log("auth context error>", e);
          });
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    console.log("final logout auth");
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    let result;

    try {
      result = currentUser.updateEmail(email);
    } catch (e) {
      return e;
    }
    return result;
  }

  function updatePassword(password) {
    let result;
    try {
      result = auth.currentUser.updatePassword(password);
    } catch (e) {
      return e;
    }
    return result;
  }

  function updateFirstName(firstName) {
    console.log("firstname auth");

    let upd = db
      .ref("users/" + auth.currentUser.uid)
      .update({
        firstname: firstName,
        lastupdate: now,
      })
      .catch((e) => {
        console.log("firstname auth error>", e);
      });
    return upd;
  }

  function accountDeleted(date) {
    console.log("delete account auth");

    let upd = db
      .ref("users/" + auth.currentUser.uid)
      .update({
        deleted: true,
        deleteDate: now,
        lastupdate: now,
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
        lastupdate: now,
      })
      .catch((e) => {
        console.log("surname auth error>", e);
      });
    return upd;
  }

  function updateMobile(mobile) {
    console.log("mobile auth updating");
    let upd = db
      .ref("users/" + auth.currentUser.uid)
      .update({
        mobile: mobile,
        lastupdate: now,
      })
      .catch((e) => {
        console.log("mobile auth error>", e);
      });
    return upd;
  }

  function bookSession(sessiondetails) {
    console.log("booksession auth");
    sessiondetails = {
      ...sessiondetails,
      lastupdate: now,
    };
    let upd = db
      .ref("users/" + auth.currentUser.uid)
      .update(sessiondetails)
      .catch((e) => {
        console.log("session auth error>", e);
      });
    return upd;
  }
  function createSessions(sessiondetails, company) {
    console.log("booksession auth", sessiondetails);
    sessiondetails = {
      ...sessiondetails,
      lastupdate: now,
    };
    let sessionOwner = "sessions/" + company.toLowerCase() + "/";

    let upd = db.ref(sessionOwner).set(sessiondetails);
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
    updateMobile,
    createSessions,
    userDetails,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
