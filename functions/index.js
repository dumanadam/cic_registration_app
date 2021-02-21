const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

let db = admin.database();

exports.backupDbRef = functions.https.onCall(async (data, context) => {
  return admin
    .database()
    .ref("/adminSessions/cic/openSessions")
    .once("value")
    .then((snap) => {
      return snap.val();
    });
});

exports.checkAdminStatus = functions.https.onCall(async (data, context) => {
  let adminUser = await admin
    .database()
    .ref("adminUsers/" + context.auth.uid)
    .once("value")
    .then((snapshot) => {
      if (snapshot.val() === null) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "You must be authenticated to call this function."
        );
      } else {
        return true;
      }
    })

    .catch((e) => {
      return e;
    });

  return adminUser;
});

exports.missedBooking = functions.https.onCall(async (userDetails, context) => {
  console.log("missed user", userDetails);

  let promises = [];
  let emptyUserBooking = {
    jumaDate: "",
    jumaSession: "",
    sessionHash: "",
  };
  let missedSessions = {
    [userDetails.jumaDate]: {
      missedAcceptTime: admin.database.ServerValue.TIMESTAMP,
      jumaSession: userDetails.jumaSession,
    },
  };

  let entryTimeUpdateObj = {
    entryTime: admin.database.ServerValue.TIMESTAMP,
  };

  const [day, month, year] = userDetails.jumaDate.split("-");
  // let userSessionDate = new Date(year, month - 1, day);

  promises.push(
    admin
      .database()
      .ref("privUserDetails/" + context.auth.uid + "/missedCount")
      .set(admin.database.ServerValue.increment(1))
      .then(() => {
        return userDetails.firstname + " missed booking";
      })
  );

  promises.push(
    admin
      .database()
      .ref(
        "privUserDetails/" +
          context.auth.uid +
          "/missedSessions/" +
          year +
          "/" +
          month +
          "/"
      )
      .push()
      .set(missedSessions)
      .then(() => {
        return userDetails.firstname + " updated aSession";
      })
  );

  promises.push(
    admin
      .database()
      .ref("users/" + context.auth.uid)
      .update(emptyUserBooking)
      .then((res) => {
        return "removed user booking";
      })
  );

  /*   promises.push(
    admin
      .database()
      .ref(
        "adminSessions/missed/openSessions/" +
          userDetails.jumaDate +
          "/" +
          userDetails.jumaSession +
          "/" +
          context.auth.uid
      )
      .update({
        ...bookingData,
        userCancelBooking: admin.database.ServerValue.TIMESTAMP,
      })
      .then((res) => {
        return "canceled usersession adminsession";
      })
  ); */

  return Promise.all(promises);
});

exports.checkUserBooking = functions.https.onCall(
  async (userDetails, context) => {
    let emptyUserBooking = {
      jumaDate: "",
      jumaSession: "",
      sessionHash: "",
    };

    let user = admin.database().ref("users/" + context.auth.uid);
    let adminSessionUserBooking = await admin
      .database()
      .ref(
        `adminSessions/cic/openSessions/${userDetails.jumaDate}/${userDetails.jumaSession}/booked/${userDetails.sessionHash}`
      )
      .once("value")
      .then((snap) => {
        return snap.val();
      });

    if (
      adminSessionUserBooking !== null &&
      adminSessionUserBooking.jumaDate === userDetails.jumaDate &&
      adminSessionUserBooking.jumaSession === userDetails.jumaSession
    ) {
      return true;
    } else {
      return await admin
        .database()
        .ref("users/" + context.auth.uid)
        .update(emptyUserBooking);
    }

    /*   res = await admin
    .database()
    .ref(
      "adminSessions/cic/openSessions/" +
        userDetails.jumaDate +
        "/" +
        userDetails.jumaSession +
        "/booked/" +
        context.auth.uid
    )
    .once("value")
    .then((snap) => {
      return snap.val();
    });

  console.log("adminSessionUserBooking booking res", res);
  return res; */
  }
);

exports.testFunc = functions.https.onCall((data, context) => {
  let user = admin.database().ref("users/" + context.auth.uid);
  let adminUser = admin.database().ref("adminUsers/" + context.auth.uid);

  /* user.once('value', function(snap)  {
    newRef.set( snap.value(), function(error) {
         if( error && typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
    });
}); */
  return user.once("value").then((snapshot) => {
    let adminObj = {
      ...snapshot.val(),
      active: 1,
    };
    return adminUser.update(adminObj || "Anonymous");
  });
});

exports.createSessions = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }

  let promises = [];
  let sessionOwner = "openSessions/" + data.company.toLowerCase() + "/" || null;
  promises.push(
    admin.database().ref("adminSessions/cic/").set(data.sessionDetails)
  );
  promises.push(
    admin.database().ref("pubSessions/cic/").set(data.sessionDetails)
  );

  return Promise.all(promises);
});

exports.archiveSession = functions.https.onCall(async (data, context) => {
  let removeSession;

  let promises = [];
  let selectedSessionDate = await admin
    .database()
    .ref("adminSessions/" + "cic" + "/openSessions/" + data)
    .once("value")
    .then((snapshot) => {
      return snapshot.val();
    });

  promises.push(
    admin
      .database()
      .ref("archives/" + "cic" + "/" + data)
      .set(selectedSessionDate)
      .then((snapshot) => {
        return "Archived success";
      })
  );

  let success = await Promise.all(promises);

  promises = [];
  promises.push(
    admin
      .database()
      .ref("adminSessions/" + "cic" + "/openSessions/" + data)
      .remove()
      .then(() => {
        return "Priv_Removal_Succesfull";
      })
  );
  promises.push(
    admin
      .database()
      .ref("pubSessions/" + "cic" + "/openSessions/" + data)
      .remove()
      .then(() => {
        return "Pub_Removal_Succesfull";
      })
  );
  return Promise.all(promises);
});

exports.confirmAttendance = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  let promises = [];
  let entryTimeUpdateObj = {
    entryTime: admin.database.ServerValue.TIMESTAMP,
  };

  promises.push(
    admin
      .database()
      .ref("users/" + data.uid)
      .update(entryTimeUpdateObj)
  );
  promises.push(
    admin
      .database()
      .ref(
        "adminSessions/cic/openSessions/" +
          data.jumaDate +
          "/" +
          data.jumaSession +
          "/booked/" +
          data.sessionHash +
          "/"
      )
      .update(entryTimeUpdateObj)
  );

  return Promise.all(promises);
});

// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete(async (user) => {
  let promises = [];
  var userDetails = await admin
    .database()
    .ref("privUserDetails/" + user.uid)
    .once("value")
    .then((snap) => {
      return snap.val();
    });

  userDetails = {
    ...userDetails,
    deleteDate: admin.database.ServerValue.TIMESTAMP,
  };

  promises.push(
    admin
      .database()
      .ref("privUserDetails/deleted/" + user.uid)
      .set(userDetails)
  );

  promises.push(
    admin
      .database()
      .ref("privUserDetails/" + user.uid)
      .remove()
  );

  return Promise.all(promises)
    .then((res) => {
      return admin
        .database()
        .ref("/users/" + user.uid)
        .remove();
    })
    .catch((e) => {
      return e;
    });
});
//TODO change cancel to privuserdetails
exports.cancelUserBooking = functions.https.onCall((data, context) => {
  if (!(context.auth && context.auth.token)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Must be an administrative user to initiate booking."
    );
  }

  let promises = [];
  let uid = context.auth.uid;
  let oldBookingDate = data.jumaDate;
  let oldBookingSession = data.jumaSession;
  let oldBookingSessionHash = data.sessionHash;
  let emptyUserBooking = {
    jumaDate: "",
    jumaSession: "",
    sessionHash: "",
  };
  let bookingData = {
    firstname: data.firstname,
    surname: data.surname,
    mobileNum: data.mobileNum,
    uid: uid,
    entryTime: data.entryTime,
  };

  promises.push(
    admin
      .database()
      .ref(
        "adminSessions/cancelled/openSessions/" +
          oldBookingDate +
          "/" +
          oldBookingSession +
          "/" +
          oldBookingSessionHash
      )
      .update({
        ...bookingData,
        userCancelBooking: admin.database.ServerValue.TIMESTAMP,
      })
      .then((res) => {
        return "canceled usersession adminsession";
      })
  );
  promises.push(
    admin
      .database()
      .ref(
        "adminSessions/cic/openSessions/" +
          oldBookingDate +
          "/" +
          oldBookingSession +
          "/booked/" +
          oldBookingSessionHash
      )
      .remove()
      .then(() => {
        return "canceled aSession";
      })
  );

  promises.push(
    admin
      .database()
      .ref("users/" + uid)
      .update(emptyUserBooking)
      .then((res) => {
        return "updated user booking";
      })
  );

  promises.push(
    admin
      .database()
      .ref(
        "pubSessions/cic/openSessions/" +
          oldBookingDate +
          "/" +
          oldBookingSession +
          "/currentBooked"
      )
      .set(admin.database.ServerValue.increment(-1))
      .then((res) => {
        return "i true";
      })
  );

  promises.push(
    admin
      .database()
      .ref("privUserDetails/" + uid + "/cancelCount")
      .set(admin.database.ServerValue.increment(1))
      .then((res) => {
        return "d true";
      })
  );

  promises.push(
    admin
      .database()
      .ref("privUserDetails/" + uid)
      .update(emptyUserBooking)
      .then((res) => {
        return "updated pDdetails booking";
      })
  );

  return Promise.all(promises);
});

exports.bookSession = functions.https.onCall((data, context) => {
  //if (!(context.auth && context.auth.token && context.auth.token.admin)) {
  if (!(context.auth && context.auth.token)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Must be an administrative user to initiate booking."
    );
  }

  let promises = [];
  let uid = context.auth.uid;

  let newBookingDate = data.newSessionDetails.jumaDate;
  let newBookingSession = data.newSessionDetails.jumaSession;
  let oldBookingDate = data.oldSessionDetails.jumaDate;
  let oldBookingSession = data.oldSessionDetails.jumaSession;
  let oldBookingSessionHash = data.oldSessionDetails.sessionHash;
  let newBookingSessionHash = data.newSessionDetails.sessionHash;

  let bookingData = {
    ...data.newSessionDetails,
    firstname: data.userDetails.firstname,
    surname: data.userDetails.surname,
    mobileNum: data.userDetails.mobileNum,
    uid: uid,
    entryTime: data.userDetails.entryTime,
  };

  if (newBookingDate !== "") {
    promises.push(
      admin
        .database()
        .ref(
          "adminSessions/cic/openSessions/" +
            newBookingDate +
            "/" +
            newBookingSession +
            "/booked/" +
            newBookingSessionHash
        )
        .update(bookingData)
        .then((res) => {
          return "updated adminsession";
        })
    );
    promises.push(
      admin
        .database()
        .ref("privUserDetails/" + uid)
        .update(bookingData)
        .then((res) => {
          return "updated pUserDetails";
        })
    );

    promises.push(
      admin
        .database()
        .ref(
          "pubSessions/cic/openSessions/" +
            newBookingDate +
            "/" +
            newBookingSession +
            "/currentBooked"
        )
        .set(admin.database.ServerValue.increment(1))
    );

    if (oldBookingDate !== "") {
      promises.push(
        admin
          .database()
          .ref(
            "adminSessions/cic/openSessions/" +
              oldBookingDate +
              "/" +
              oldBookingSession +
              "/booked/" +
              oldBookingSessionHash
          )
          .remove()
          .then((res) => {
            return "deleted old";
          })
      );

      promises.push(
        admin
          .database()
          .ref(
            "pubSessions/cic/openSessions/" +
              oldBookingDate +
              "/" +
              oldBookingSession +
              "/currentBooked"
          )
          .set(admin.database.ServerValue.increment(-1))
      );
    }
    promises.push(
      admin
        .database()
        .ref("users/" + uid)
        .update(bookingData)
        .then((res) => {
          return "updated user booking";
        })
    );
  }

  return Promise.all(promises);
});

exports.userDetailsUpdated = functions.database
  .ref("/users/{userId}")
  .onUpdate((change, context) => {
    let promises = [];
    let personalDetails = {};
    const after = change.after.val();
    const before = change.before.val();
    if (
      after.firstname !== before.firstname ||
      after.surname !== before.surname ||
      after.mobileNum !== before.mobileNum ||
      after.email !== before.email
    ) {
      personalDetails = {
        firstname: after.firstname,
        surname: after.surname,
        mobileNum: after.mobileNum,
        email: after.email,
        lastupdate: admin.database.ServerValue.TIMESTAMP,
      };
      promises.push(
        admin
          .database()
          .ref("/privUserDetails/" + context.params.userId)
          .update(personalDetails)
      );
    }

    if (after.jumaSession !== "") {
      promises.push(
        admin
          .database()
          .ref(
            "adminSessions/cic/openSessions/" +
              after.jumaDate +
              "/" +
              after.jumaSession +
              "/booked/" +
              after.sessionHash
          )
          .update(personalDetails)
          .then((res) => {
            return "Personal details updated in adminsessions";
          })
      );
    }

    return Promise.all(promises);
  });

exports.newUserDetails = functions.database
  .ref("/users/{userId}")
  .onCreate((snapshot, context) => {
    let privUserDetailsObj = {
      firstname: snapshot.val().firstname,
      surname: snapshot.val().surname,
      mobileNum: snapshot.val().mobileNum,
      email: snapshot.val().email,
      agreeNewsletter: snapshot.val().agreeNewsletter,
      company: snapshot.val().company,
      cancelCount: 0,
      warningCount: 0,
      banned: 0,
      admin: 0,
      uid: snapshot.val().uid,
      lastupdate: admin.database.ServerValue.TIMESTAMP,
      entryTime: snapshot.val().entryTime,
    };

    return admin
      .database()
      .ref("/privUserDetails/" + context.auth.uid)
      .set(privUserDetailsObj);
  });

/* let addMessage = fbfunc.httpsCallable("addMessage");
addMessage({ text: "teh test text" }).then((result) => {
  // Read result of the Cloud Function.
  var sanitizedMessage = result.data.text;
  console.log("sanitizedMessage", sanitizedMessage);
}); */

/* 
// http request 1
exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  console.log(number);
  response.send(number.toString());
});

// http request 2
exports.toTheDojo = functions.https.onRequest((request, response) => {
  response.redirect("https://www.thenetninja.co.uk");
});


// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete((user) => {
  console.log("user deleted: ", user.email, user.uid);
});



 */
