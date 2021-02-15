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
      console.log("snap db", snap.val());
      return snap.val();
    });
});

exports.checkAdminStatus = functions.https.onCall(async (data, context) => {
  let openAdminSession;
  console.log("hit getsession");
  let adminUser = await admin
    .database()
    .ref("adminUsers/" + context.auth.uid)
    .once("value")
    .then((snapshot) => {
      console.log("adminUser adminuser+++++", JSON.stringify(snapshot.val()));
      if (snapshot.val() === null) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "You must be authenticated to call this function."
        );
      } else {
        return true;
      }
      /*   if (snapshot.val() === null) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "You must be authenticated to call this function."
        );
      } */
    })

    .catch((e) => {
      console.log("caught adminuser error", e);
      return e;
    });

  /*   if (adminUser === true) {
    openAdminSession = await admin
      .database()
      .ref("adminSessions/cic/openSessions/")
      .once("value")
      .then(async (snap) => {
        console.log("isAdmin snap", JSON.stringify(snap.val()));
        if (snap.val() === null) {
          return "no-sessions";
        } else {
          return { adminSessions: snap.val() };
        }
      })
      .catch((e) => {
        console.log("caught folder adminuser error", e);
        return e;
      });
  } */
  console.log("adminUser adminuser", JSON.stringify(adminUser));
  console.log("openAdminSession adminuser", JSON.stringify(openAdminSession));
  /* if (Object.keys(adminUser).length === 0 && adminUser.constructor === Object) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be authenticated to call this function."
    );
  } else { */
  /*   if (adminUser) {
    adminSessions = await admin
      .database()
      .ref("adminSessions/")
      .once("value")
      .then((snap) => {
        console.log("snap", snap.val());
        return snap.val();
      });
    console.log("adminSessions", adminSessions);
  } */
  return adminUser;
});

exports.missedBooking = functions.https.onCall(async (userDetails, context) => {
  let promises = [];
  let emptyUserBooking = {
    jumaDate: "",
    jumaSession: "",
    sessionHash: "",
  };

  const [day, month, year] = userDetails.jumaDate.split("-");
  let userSessionDate = new Date(year, month - 1, day);

  if (userSessionDate < Date.now()) {
    promises.push(
      admin
        .database()
        .ref("privUserDetails")
        .child(context.auth.uid)
        .child("cancelCount")
        .transaction((count) => {
          return (count || 0) + 1;
        })
    );
    /*   promises.push(
      admin
        .database()
        .ref("users/" + context.auth.uid)
        .update(emptyUserBooking)
    ); */

    /* promises.push(
      admin
        .database()
        .ref("privUserDetails/" + context.auth.uid + "/cancelCount")
        .update(admin.database.ServerValue.increment(1))
    ); */
  }
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

    console.log("adminSessionUserBooking", adminSessionUserBooking);
    console.log("adminSessionUserBooking userdetails", userDetails);
    console.log(
      "adminSessionUserBooking userDetails.jumaDate",
      userDetails.jumaDate
    );

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
    return adminUser.update(snapshot.val() || "Anonymous");
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

exports.confirmAttendance = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  console.log("attendeance data", data);
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
  console.log("user deleted: ", user.email, user.uid);

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
      console.log("delete res is ", res);
      return admin
        .database()
        .ref("/users/" + user.uid)
        .remove();
    })
    .catch((e) => {
      return e;
    });
});

exports.cancelUserBooking = functions.https.onCall((data, context) => {
  if (!(context.auth && context.auth.token)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Must be an administrative user to initiate booking."
    );
  }

  let promises = [];
  let uid = context.auth.uid;
  let oldBookingDate = data.oldSessionDetails.jumaDate;
  let oldBookingSession = data.oldSessionDetails.jumaSession;
  let oldBookingSessionHash = data.oldSessionDetails.sessionHash;
  let bookingData = {
    firstname: data.userDetails.firstname,
    surname: data.userDetails.surname,
    mobileNum: data.userDetails.mobileNum,
    uid: uid,
    entryTime: data.userDetails.entryTime,
  };

  console.log("hit cancel ------- bookingdata", data);
  promises.push(
    admin
      .database()
      .ref(
        "adminSessions/cancelled/openSessions/" +
          oldBookingDate +
          "/" +
          oldBookingSession +
          "/cancelled/" +
          oldBookingSessionHash
      )
      .update({
        ...bookingData,
        userCancelBooking: admin.database.ServerValue.TIMESTAMP,
      })
      .then((res) => {
        console.log("canceled usersession adminsession", res);
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
  );

  promises.push(
    admin
      .database()
      .ref("users/" + uid)
      .update(bookingData)
      .then((res) => {
        console.log("user details updated", res);
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
  );

  promises.push(
    admin
      .database()
      .ref("privUserDetails/" + uid + "/cancelCount")
      .set(admin.database.ServerValue.increment(1))
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
  console.log("contextauth", context.auth.uid);
  console.log("newBookingDate", newBookingDate);
  console.log("data.newBookingSession", newBookingSession);
  console.log("data.oldBookingDate", oldBookingDate);
  console.log("oldBookingSession", oldBookingSession);
  console.log("usercancel", data.userCancelBooking);
  console.log("qqqqq", uid);

  let bookingData = {
    ...data.newSessionDetails,
    firstname: data.userDetails.firstname,
    surname: data.userDetails.surname,
    mobileNum: data.userDetails.mobileNum,
    uid: uid,
    entryTime: data.userDetails.entryTime,
  };
  console.log(
    "canceled usersession adminsession old date",
    JSON.stringify(data)
  );
  console.log(
    "canceled usersession adminsession old date",
    JSON.stringify(bookingData)
  );
  if (newBookingDate !== "") {
    console.log("hit true adm2 ", data);

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
          console.log("updated adminsession");
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
            console.log("deleted old adminsession");
            return "deleted old";
          })
      );
    }
    promises.push(
      admin
        .database()
        .ref("users/" + uid)
        .update(bookingData)
        .then((res) => {
          console.log("user details updated", res);
          return "updated user booking";
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
            console.log("Personal details updated in adminsessions");
            return "Personal details updated in adminsessions";
          })
      );
    }

    return Promise.all(promises);
  });

exports.newUserDetails = functions.database
  .ref("/users/{userId}")
  .onCreate((snapshot, context) => {
    console.log("newUserDetails user snapshot", snapshot.val());
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

function calculateBooked(before, after, context) {
  /*   console.log("before", before);
  console.log("after", after);
  console.log("context", context); */
}
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

// http callable function
exports.sayHello = functions.https.onCall((data, context) => {
  const name = data.name;
  return `hello ${name} :)`;
});



// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete((user) => {
  console.log("user deleted: ", user.email, user.uid);
});



 */
