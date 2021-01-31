const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

let db = admin.database();

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
        `adminSessions/cic/openSessions/${userDetails.jumaDate}/${userDetails.jumaSession}/booked/${context.auth.uid}`
      )
      .once("value")
      .then((snap) => {
        return snap.val();
      });

    console.log("adminSessionUserBooking", adminSessionUserBooking);
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
        "adminSessions/cic/" +
          data.jumaDate +
          "/" +
          data.jumaSession +
          "/" +
          data.uid +
          "/"
      )
      .update(entryTimeUpdateObj)
  );

  return Promise.all(promises);
});

// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete(async (user) => {
  console.log("user deleted: ", user.email, user.uid);
  let deleteDetails = {
    deleteDetails: {
      lastupdate: admin.database.ServerValue.TIMESTAMP,
    },
  };
  let promises = [];

  promises.push(
    admin
      .database()
      .ref("/users/" + user.uid)
      .remove()
  );
  promises.push(
    admin
      .database()
      .ref("privUserDetails/" + user.uid)
      .update(deleteDetails)
  );

  return Promise.all(promises);
});

exports.bookSession = functions.https.onCall((data, context) => {
  //if (!(context.auth && context.auth.token && context.auth.token.admin)) {
  if (!(context.auth && context.auth.token)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Must be an administrative user to initiate delete."
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
    mobile: data.userDetails.mobileNum,
    uid: uid,
  };

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
  }

  if (data.userCancelBooking) {
    console.log("hit cancel -------");
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
          console.log("canceled usersession adminsession");
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
  }

  return Promise.all(promises);
});

exports.userDetailsUpdated = functions.database
  .ref("/users/{userId}")
  .onUpdate((change, context) => {
    const after = change.after.val();
    let privUserDetailsObj = {
      ...after,
      lastupdate: admin.database.ServerValue.TIMESTAMP,
    };

    return admin
      .database()
      .ref("/privUserDetails/" + context.params.userId)
      .update(privUserDetailsObj);
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
      lastupdate: admin.database.ServerValue.TIMESTAMP,
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
