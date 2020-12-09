import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import moment from "moment";
import FindFriday from "../components/FindFriday";
import FbAddress from "../components/contents/FbAddress";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [globalFriday, setGlobalFriday] = useState({});
  const [globalFridayFb, setGlobalFridayFb] = useState({});
  const [openSessions, setOpenSessions] = useState("");

  const now = moment().toString();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) getCurrentUserDetails();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log("globalFridayFb", globalFridayFb);
  }, [globalFridayFb]);

  function getCurrentUserDetails() {
    try {
      db.ref("/users/" + auth.currentUser.uid).on("value", (snapshot) => {
        console.log("*Google DB*getting latest userdetails");
        setUserDetails(snapshot.val());
        setGlobalFridayFb(FindFriday(1, true));
        setGlobalFriday(FindFriday());
      });
    } catch (error) {
      console.log("getcurrentuserdetails error", error);
    }
  }

  useEffect(() => {
    if (userDetails.firstname) {
      getOpenSessions(userDetails.company.melbourne.cic);
    }
  }, [userDetails]);

  function getOpenSessions(adminCompany) {
    try {
      db.ref("sessions/" + adminCompany.toLowerCase() + "/openSessions").on(
        "value",
        (snapshot) => {
          setOpenSessions(snapshot.val());
        }
      );
    } catch (e) {
      console.log("getopensessions error", e);
    }
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
            company: {
              melbourne: {
                cic: "cic",
              },
            },
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

  function updateDB(address, updateObject) {
    console.log("address", address);
    console.log("updateObject", updateObject);

    return db
      .ref(address)
      .update(updateObject)
      .catch((e) => {
        console.log("db upd promise error>", e);
      });
  }

  function updateSession(
    removeSession = false,
    oldDBAddress,
    newDBAdress,
    companyBookingSessionDetails,
    newSessionDetails
  ) {
    const oldCompanyCountDBAddress =
      "sessions/" +
      userDetails.company.melbourne.cic +
      "/openSessions/" +
      userDetails.jumaDate +
      "/" +
      userDetails.jumaSession;

    const newCompanyCountDBAddress =
      "sessions/" +
      userDetails.company.melbourne.cic +
      "/openSessions/" +
      newSessionDetails.jumaDate +
      "/" +
      newSessionDetails.jumaSession;

    /* let newIncrementBookingDB =
      openSessions[newSessionDetails.jumaDate][newSessionDetails.jumaSession]; */
    console.log("newSessionDetails xxx", newSessionDetails);
    let newBookingCount =
      openSessions[newSessionDetails.jumaDate][newSessionDetails.jumaSession]
        .currentBooked + 1;

    if (removeSession) {
      let oldIncrementBookingDB =
        openSessions[globalFridayFb][userDetails.jumaSession];

      let oldBookingCount =
        openSessions[globalFridayFb][userDetails.jumaSession].currentBooked - 1;
      console.log("oldIncrementBookingDB", oldIncrementBookingDB.currentBooked);
      db.ref(oldDBAddress)
        .remove()
        .catch((e) => {
          console.log("db remove promise error>", e);
        });
      updateDB(oldCompanyCountDBAddress, { currentBooked: oldBookingCount });
    }

    updateDB(newDBAdress, companyBookingSessionDetails);
    updateDB(newCompanyCountDBAddress, { currentBooked: newBookingCount });
    console.log("newSessionDetails", newSessionDetails);
  }

  function bookSession(newSessionDetails) {
    newSessionDetails = {
      ...newSessionDetails,
      lastupdate: now,
    };
    console.log("newSessionDetails", newSessionDetails);
    const userDBAddress = "users/" + auth.currentUser.uid;

    const newCompanyBookingDBAddress = FbAddress(
      "newCompanyBookingDBAddress",
      userDetails,
      newSessionDetails,
      auth
    );

    const oldCompanyBookingDBADdress = FbAddress(
      "oldCompanyBookingDBADdress",
      userDetails,
      newSessionDetails,
      auth
    );

    console.log("booksession auth old", oldCompanyBookingDBADdress);

    let companyBookingSessionDetails = {
      firstname: userDetails.firstname,
      surname: userDetails.surname,
      mobile: userDetails.mobile,
    };
    if (userDetails.jumaDate) {
      updateSession(
        true,
        oldCompanyBookingDBADdress,
        newCompanyBookingDBAddress,
        companyBookingSessionDetails,
        newSessionDetails
      );
    } else {
      updateSession(
        false,
        oldCompanyBookingDBADdress,
        newCompanyBookingDBAddress,
        companyBookingSessionDetails,
        newSessionDetails
      );
    }
    updateDB(userDBAddress, newSessionDetails);
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
    openSessions,
    globalFriday,
    globalFridayFb,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
