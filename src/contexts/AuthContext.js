import React, { useContext, useState, useEffect } from "react";
import { auth, db, fbfunc } from "../firebase";
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
    try {
      db.ref("/sessions/cic/openSessions").on("value", (snapshot) => {
        console.log("sessions printout", snapshot.val());
      });
    } catch (error) {
      console.log("print error", error);
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

    try {
      db.ref(address)
        .update(updateObject)
        .catch((e) => {
          console.log("db upd promise error>", e);
        });
    } catch (error) {
      console.log(" try ctach db upd promise error>", error);
    }
  }

  function updateAttendance(attendeeDetails, status) {
    const attendeeSessionAddress =
      openSessions[attendeeDetails.jumaDate][attendeeDetails.jumaSession]
        .confirmed[attendeeDetails.sessionHash];

    console.log("attendeeDetails", attendeeDetails);
    console.log("status", status);
    const testadd =
      "sessions/" +
      userDetails.company.melbourne.cic +
      "/openSessions/" +
      attendeeDetails.jumaDate +
      "/" +
      attendeeDetails.jumaSession +
      "/confirmed/" +
      "/" +
      attendeeDetails.sessionHash +
      "/";
    const sessionDBAddress =
      openSessions[attendeeDetails.jumaDate][attendeeDetails.jumaSession]
        .confirmed[attendeeDetails.sessionHash];
    console.log("attendeeSessionAddress", attendeeSessionAddress);
    console.log("attendeeDetails.sessionHash", attendeeDetails.sessionHash);
    console.log("sessionDBAddress", sessionDBAddress);
    console.log("opensess ", openSessions);
    console.log(
      "opensess sessionDBAddress",
      openSessions[attendeeDetails.jumaDate][attendeeDetails.jumaSession]
        .confirmed[attendeeDetails.sessionHash]
    );
    attendeeDetails = {
      entrytime: now,
    };
    console.log("attendeeDetails", attendeeDetails);
    if (attendeeSessionAddress !== undefined) {
      updateDB(testadd, attendeeDetails);

      return attendeeSessionAddress;
    }
    return false;
  }

  function updateSession(
    removeSession = false,
    oldDBAddress,
    newDBAdress,
    companyBookingSessionDetails,
    newSessionDetails,
    userCancelBooking = false
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
    console.log("olddb address xxx", oldDBAddress);
    console.log("userdetrals xxx", userDetails);
    console.log("removeSession xxx", removeSession);
    console.log("opensessions updatesessions", openSessions);
    console.log("userCancelBooking", userCancelBooking);

    if (removeSession) {
      let oldIncrementBookingDB =
        openSessions[globalFridayFb][userDetails.jumaSession];

      let oldBookingCount =
        openSessions[globalFridayFb][userDetails.jumaSession].currentBooked - 1;
      console.log("oldIncrementBookingDB", oldIncrementBookingDB.currentBooked);
      console.log("hit remove oldDBAddress", oldDBAddress);
      db.ref(oldDBAddress)
        .remove()
        .catch((e) => {
          console.log("db remove promise error>", e);
        });
      updateDB(oldCompanyCountDBAddress, { currentBooked: oldBookingCount });
      console.log("AFTER userdetrals xxx", userDetails);
    }

    if (userCancelBooking === false) {
      console.log("Qqqqqqqqq hit !usercancelbooking", userCancelBooking);
      let newBookingCount =
        openSessions[newSessionDetails.jumaDate][newSessionDetails.jumaSession]
          .currentBooked + 1;
      updateDB(newCompanyCountDBAddress, { currentBooked: newBookingCount });
      console.log("newDBAdress", newDBAdress);
      console.log("companyBookingSessionDetails", companyBookingSessionDetails);
      updateDB(newDBAdress, companyBookingSessionDetails);
    }

    console.log("userDetails xxx2", userDetails);
  }

  function bookSession(newSessionDetails, userCancelBooking = false) {
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

    console.log("oldCompanyBookingDBADdress", oldCompanyBookingDBADdress);
    console.log("newCompanyBookingDBAddress", newCompanyBookingDBAddress);

    let companyBookingSessionDetails = {
      firstname: userDetails.firstname,
      surname: userDetails.surname,
      mobile: userDetails.mobile,
      id: auth.currentUser.uid,
    };
    if (userDetails.jumaDate) {
      updateSession(
        true,
        oldCompanyBookingDBADdress,
        newCompanyBookingDBAddress,
        companyBookingSessionDetails,
        newSessionDetails,
        userCancelBooking
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

  function clearUserJumaSession(params) {
    const userDBAddress = "users/" + auth.currentUser.uid;
    let blankSessionDetails = {
      jumaDate: "",
      jumaSession: "",
      lastupdate: now,
    };
    console.log("blankSessionDetails", blankSessionDetails);
    updateDB(userDBAddress, blankSessionDetails);
  }

  function createSessions(sessiondetails, company) {
    console.log("booksession auth", sessiondetails);
    for (const date in openSessions) {
      console.log("key", date);
      console.log("key2", openSessions[date]);
      for (const time in openSessions[date]) {
        if (time.booked >= 1) {
          console.log("time.booked >1", time.booked);
        } else {
          console.log("time.booked 0", time.booked);
        }
      }
    }
    let sessionDetails = {
      ...sessiondetails,
      lastupdate: now,
    };

    let sessionOwner = "sessions/" + company.toLowerCase() + "/";

    let upd = db.ref(sessionOwner).set(sessionDetails);
    let fbObj = {
      sessionDetails: sessionDetails,
      sessionOwner: sessionOwner,
      company: company,
    };
    console.log("fbObj", fbObj);

    let createAdminSess = fbfunc.httpsCallable("createSessions");
    createAdminSess(fbObj)
      .then((result) => {
        console.log("res from createAdminSess func  ->>> ", result.data);
      })
      .catch((e) => {
        console.log("FBfunc createsessions error returned >>>", e);
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
    updateMobile,
    createSessions,
    userDetails,
    openSessions,
    globalFriday,
    globalFridayFb,
    updateAttendance,
    clearUserJumaSession,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
