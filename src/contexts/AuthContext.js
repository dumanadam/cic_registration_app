import React, { useContext, useState, useEffect } from "react";
import { auth, db, fbfunc } from "../firebase";
import moment from "moment";
import FindFriday from "../components/FindFriday";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const [globalFridayNU, setGlobalFridayNU] = useState(FindFriday(0, false));
  const [globalFridayNF, setGlobalFridayNF] = useState(FindFriday(0, true));
  const [openSessions, setOpenSessions] = useState(null);
  const [superSessions, setSuperSessions] = useState(null);
  const [adminSessions, setAdminSessions] = useState(null);
  const [adminCheckResult, setAdminCheckResult] = useState(null);

  const now = moment().toString();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!!currentUser) {
      getCurrentUserDetails();

      console.log("currentUser auth", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("authcontext globalFridayNU", globalFridayNU);
  }, [globalFridayNU]);

  useEffect(() => {
    console.log("authcontext globalFridayNF", globalFridayNF);
  }, [globalFridayNF]);

  useEffect(() => {
    console.log("authcontext superSessions changed +++++", superSessions);
  }, [superSessions]);

  async function getCurrentUserDetails() {
    console.log("qqqq", auth.currentUser.uid);
    await db.ref("/users/" + auth.currentUser.uid).on("value", (snapshot) => {
      console.log("*Google DB*getting latest userdetails", snapshot.val());

      setUserDetails(snapshot.val());
    });
  }

  useEffect(() => {
    if (userDetails !== null) {
      if (
        typeof userDetails.firstname !== "undefined" &&
        userDetails !== null
      ) {
        getOpenSessions(userDetails.company.melbourne.cic);
      }
    }
  }, [userDetails]);

  useEffect(() => {
    console.log("res adminSessions", adminSessions);
  }, [adminSessions]);

  function getOpenSessions(adminCompany) {
    try {
      db.ref("pubSessions/" + adminCompany.toLowerCase() + "/openSessions/").on(
        "value",
        (snapshot) => {
          setOpenSessions(snapshot.val());
        }
      );
    } catch (e) {
      console.log("getopensessions error", e);
    }
  }

  async function signup(
    email,
    password,
    firstname,
    surname,
    mobileNum,
    agreeNewsletter
  ) {
    let registrationDetails = {
      entryTime: "",
      email,
      firstname,
      surname,
      mobileNum,
      agreeNewsletter,
      jumaDate: "",
      jumaSession: "",
      sessionHash: "",
      company: {
        melbourne: {
          cic: "cic",
        },
      },
    };

    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        console.log("newuser is > ", newUser);
        registrationDetails = {
          ...registrationDetails,
          uid: auth.currentUser.uid,
        };
      });

    let upd = await db
      .ref("users/" + auth.currentUser.uid)
      .update(registrationDetails)
      .catch((e) => {
        console.log("registrationDetails auth error>", e);
      });
    return upd;
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

  async function updateEmail(email) {
    let promises = [];

    promises.push(currentUser.updateEmail(email));
    promises.push(
      db.ref("users/" + auth.currentUser.uid).update({ email: email })
    );

    return Promise.all(promises);
  }

  async function updatePassword(password) {
    let result;
    try {
      result = auth.currentUser.updatePassword(password);
    } catch (e) {
      return e;
    }
    return result;
  }

  async function updateFirstName(firstName) {
    console.log("firstname auth");

    let upd = await db
      .ref("users/" + auth.currentUser.uid)
      .update({
        firstname: firstName,
      })
      .catch((e) => {
        console.log("firstname auth error>", e);
      });
    return upd;
  }

  async function updateSurname(surName) {
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

  async function updateMobile(mobile) {
    console.log("mobile auth updating");
    let upd = db
      .ref("users/" + auth.currentUser.uid)
      .update({
        mobileNum: mobile,
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

  async function updateAttendance(scannedUserDetails, status) {
    let entryConfirmation;
    /*  const attendeeSessionAddress =
      superSessions[attendeeDetails.jumaDate][attendeeDetails.jumaSession]
        .booked[attendeeDetails.sessionHash];

    console.log("attendeeDetails", attendeeDetails);
    console.log("status", status);
    const testadd =
      "sessions/" +
      userDetails.company.melbourne.cic +
      "/openSessions/" +
      attendeeDetails.jumaDate +
      "/" +
      attendeeDetails.jumaSession +
      "/booked/" +
      "/" +
      attendeeDetails.sessionHash +
      "/";
    const sessionDBAddress =
      superSessions[attendeeDetails.jumaDate][attendeeDetails.jumaSession]
        .booked[attendeeDetails.sessionHash];
    console.log("attendeeSessionAddress", attendeeSessionAddress);
    console.log("attendeeDetails.sessionHash", attendeeDetails.sessionHash);
    console.log("sessionDBAddress", sessionDBAddress);
    console.log("superSessions ", superSessions);
    console.log(
      "superSessions sessionDBAddress",
      superSessions[attendeeDetails.jumaDate][attendeeDetails.jumaSession]
        .booked[attendeeDetails.sessionHash]
    );
    attendeeDetails = {
      entryTime: now,
    };
    console.log("attendeeDetails", attendeeDetails);
    if (attendeeSessionAddress !== undefined) { */
    let confirmAttendance = fbfunc.httpsCallable("confirmAttendance");

    entryConfirmation = await confirmAttendance(scannedUserDetails)
      .then((result) => {
        console.log("res from confirmAttendance func  ->>> ", result.data);
        return result.data;
      })
      .catch((e) => {
        console.log("FBfunc confirmAttendance error returned >>>", e);
      });

    //  updateDB(testadd, attendeeDetails);
    //console.log("adminsession entry", attendeeDetails);
    // return attendeeSessionAddress;
    //}
    return entryConfirmation;
  }

  async function archiveSessions(selectedArchiveDate) {
    let archiveSession = fbfunc.httpsCallable("archiveSession");

    let archiveSessionResult = await archiveSession(selectedArchiveDate)
      .then((result) => {
        console.log("res from missedbooking func  ->>> ", result.data);
        return result.data;
      })
      .catch((e) => {
        console.log("FBfunc archive error returned >>>", e);
      });

    return archiveSessionResult;
  }

  async function missedBooking() {
    let setMissedBooking = fbfunc.httpsCallable("missedBooking");

    let missedBookingres = await setMissedBooking(userDetails)
      .then((result) => {
        console.log("res from missedbooking func  ->>> ", result.data);
        return result.data;
      })
      .catch((e) => {
        console.log("FBfunc missedbooking error returned >>>", e);
      });

    return missedBookingres;
  }

  function bookSession(
    newSessionDetails,
    oldSessionDetails,
    userCancelBooking = false
  ) {
    console.log("newSessionDetails", newSessionDetails);
    console.log("oldSessionDetails", oldSessionDetails);

    let bookSessionFunc = fbfunc.httpsCallable("bookSession");
    let bookingRequest = bookSessionFunc({
      newSessionDetails,
      oldSessionDetails,
      userDetails,
      userCancelBooking,
    })
      .then((result) => {
        console.log("res from bookSession func  ->>> ", result.data);
        /*  const userDBAddress = "users/" + auth.currentUser.uid;
        updateDB(userDBAddress, newSessionDetails); */
        return result.data;
      })
      .catch((e) => {
        console.log("FBfunc bookSession error returned >>>", e);
        return null;
      });
    return bookingRequest;
  }

  function cancelUserBooking(oldSessionDetails) {
    console.log("oldSessionDetails", oldSessionDetails);

    let cancelSessionFunc = fbfunc.httpsCallable("cancelUserBooking");
    let bookingCancellation = cancelSessionFunc({
      oldSessionDetails,
      userDetails,
    })
      .then((result) => {
        console.log("res from cacncel func  ->>> ", result.data);
        return result.data;
      })
      .catch((e) => {
        console.log("FBfunc cancelSessionerror returned >>>", e);
        return null;
      });
    return bookingCancellation;
  }

  async function checkUserBooking() {
    /* let fbObj = {
      sessionDetails: sessionDetails,
      sessionOwner: sessionOwner,
      company: company,
    }; */

    let userSessionConfirmed = fbfunc.httpsCallable("checkUserBooking");

    userSessionConfirmed(userDetails)
      .then((result) => {
        console.log("res from checkUserBooking func  ->>> ", result.data);
        return result.data;
      })
      .catch((e) => {
        console.log("FBfunc checkUserBooking error returned >>>", e);
      });
  }

  function createSessions(sessiondetails, company) {
    console.log("booksession auth", sessiondetails);

    let sessionDetails = {
      ...sessiondetails,
    };

    let sessionOwner = "sessions/" + company.toLowerCase() + "/";

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

    return true;
  }

  function deleteProfile(password) {
    auth.currentUser
      .delete()
      .then(function () {
        // User deleted.
      })
      .catch(function (error) {
        // An error happened.
      });

    return auth.currentUser.updatePassword(password);
  }

  async function checkAdminStatus() {
    let adminStatus;
    let adminSessions;

    let checkAdminStatusa = fbfunc.httpsCallable("checkAdminStatus");

    adminStatus = await checkAdminStatusa().then((result) => {
      console.log(
        "res from checkAdminStatus func  superSessions ->>>111 ",
        result.data
      );

      if (result.data.adminSessions) {
        console.log(
          "checkadminstatus hit result.data.adminSessions",
          result.data.adminSessions
        );
        return result.data.adminSessions;
      }
      if (
        result.data.httpErrorCode !== undefined &&
        result.data.httpErrorCode.status === 401
      ) {
        console.log("checkadminstatus hit 401", result.data);
        setAdminCheckResult(401);
        return false;
        //  throw new Error(result.data.httpErrorCode.status);
      }
      return result.data ? setAdminCheckResult(true) : setAdminCheckResult(401);
    });
    /*       .catch((error) => {
        //console.log("res from  checkAdminStatus err---error", error);
        console.log("res from  checkAdminStatus err---type", typeof error);
        console.log("res from  checkAdminStatus err---name", error.name);
        console.log("res from  checkAdminStatus err--- mesg", error.message);
        adminStatus = error;
      }); */

    /*     try {
      console.log("hit try res");
      adminSessions = db
        .ref("adminSessions/cic/openSessions/")
        .on("value", (snapshot) => {
          console.log(
            "res from checkAdminStatus func  superSessions ->>> adminsessions",
            snapshot
          );
          setSuperSessions(snapshot.val());
          return true;
        });
    } catch (error) {
      console.log("adminsessions error", error);
    }
*/

    console.log("res checkAdminStatus adminSessions ", adminSessions);
    console.log("res checkAdminStatus adminSessions adminStatus ", adminStatus);
    return adminStatus;
  }

  function getSupSessions() {
    console.log("hit supersessions getSupSessions", adminSessions);
    if (adminCheckResult === true && superSessions == null) {
      db.ref("/adminSessions/cic/openSessions/").on("value", (snapshot) => {
        console.log("*Google DB*getting latest adminSessions", snapshot.val());
        if (!snapshot.exists()) {
          console.log(
            "res checkAdminStatus supersessions checkadmin",
            snapshot.exists()
          );
          setSuperSessions([]);
          return false;
        } else {
          setSuperSessions(snapshot.val());
          return true;
        }
      });
    }
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
    globalFridayNU,
    globalFridayNF,
    updateAttendance,
    checkAdminStatus,
    superSessions,
    checkUserBooking,
    cancelUserBooking,
    adminCheckResult,
    getSupSessions,
    missedBooking,
    archiveSessions,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
