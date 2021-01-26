const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

let db = admin.database();

exports.getSessionAttendees = functions.https.onCall(async (data, context) => {
  let asd;
  result = await admin
    .database()
    .ref("adminUsers/" + context.auth.uid)
    .once("value")
    .then((snapshot) => {
      console.log("result adminuser+++++", JSON.stringify(snapshot.val()));
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

  if (result === true) {
    asd = await admin
      .database()
      .ref("adminSessions/cic/openSessions/")
      .once("value")
      .then(async (snap) => {
        console.log("isAdmin snap", JSON.stringify(snap.val()));
        if (snap.val() === null) {
          return "no-sessions";
        } else {
          return snap.val();
        }
      })
      .catch((e) => {
        console.log("caught folder adminuser error", e);
        return e;
      });
  }
  console.log("result adminuser", JSON.stringify(result));
  console.log("asd adminuser", JSON.stringify(asd));
  /* if (Object.keys(result).length === 0 && result.constructor === Object) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be authenticated to call this function."
    );
  } else { */
  /*   if (result) {
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
  return asd === undefined ? result : asd;
});

exports.checkUserSession = functions.https.onCall(async (data, context) => {
  let user = admin.database().ref("users/" + context.auth.uid);
  let adminSessionUserBooking = await admin
    .database()
    .ref(
      `adminSessions/cic/openSessions/${data.jumaDate}/${data.jumaSession}/confirmed/${context.auth.uid}`
    )
    .once("value")
    .then((snap) => {
      return snap.val();
    });

  /* user.once('value', function(snap)  {
    newRef.set( snap.value(), function(error) {
         if( error && typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
    });
}); */
  console.log("adminSessionUserBooking", adminSessionUserBooking);
  console.log("adminSessionUserBooking data", data.jumaDate);
  res = await admin
    .database()
    .ref(
      "adminSessions/cic/openSessions/" +
        data.jumaDate +
        "/" +
        data.jumaSession +
        "/confirmed/" +
        context.auth.uid
    )
    .once("value")
    .then((snap) => {
      return snap.val();
    });

  console.log("adminSessionUserBooking booking res", res);
  return res;
});

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

// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.addMessage = functions.https.onCall((data, context) => {
  // Message text passed from the client.
  const text = data.text;
  // Authentication / user information is automatically added to the request.
  const uid = context.auth.uid;
  const name = context.auth.token.name || null;
  const picture = context.auth.token.picture || null;
  const email = context.auth.token.email || null;

  let myret = {
    text: "sanitizedMessage",
    author: { uid, name, picture, email },
  };

  return admin
    .database()
    .ref("/messages")
    .push({
      text: "sanitizedMessage",
      author: { uid, name, picture, email },
    })
    .then(() => {
      console.log("New Message written");
      // Returning the sanitized message to the client.
      return myret;
    });
});

// auth trigger (new user signup)
exports.newUserSignUp = functions.https.onCall((data, context) => {
  let promises = [];
  console.log("data new user", data);
  console.log("context new user", context.auth.uid);

  /*   promises.push(
    admin
      .database()
      .ref("/adminUsers/" + context.auth.uid + "/adminDetails")
      .set({
        firstname: data.firstName,
        surname: data.surName,
        mobile: data.mobileNum,
        jumaDate: "",
        jumaSession: "",
        cancelCount: 0,
        warningCount: 0,
        banned: 0,
        newsletter: data.agreeNewsletter,
        admin: 0,
        deleted: false,
        deleteDate: "",
        lastupdate: admin.firestore.FieldValue.serverTimestamp(),
        company: {
          melbourne: {
            cic: "cic",
          },
        },
      })
  ); */

  return admin
    .database()
    .ref("users/" + context.auth.uid)
    .set({
      firstname: data.firstName,
      surname: data.surName,
      mobile: data.mobileNum,
      jumaDate: "",
      jumaSession: "",
      newsletter: data.agreeNewsletter,
      lastupdate: admin.firestore.FieldValue.serverTimestamp(),
      company: {
        melbourne: {
          cic: "cic",
        },
      },
    });
});

// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete((user) => {
  console.log("user deleted: ", user.email, user.uid);
  return admin
    .database()
    .ref("/adminUsers/" + user.uid)
    .remove()
    .then(() => {
      console.log("private degtails deleted");
      // Returning the sanitized message to the client.
      return true;
    });
});

exports.bookSession = functions.https.onCall((data, context) => {
  console.log("contextauth", context.auth.uid);

  console.log("data2", JSON.stringify(data));

  //if (!(context.auth && context.auth.token && context.auth.token.admin)) {
  if (!(context.auth && context.auth.token)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Must be an administrative user to initiate delete."
    );
  }

  let promises = [];
  let prepPromises = [];
  let userBookingDate = data.newSessionDetails.jumaDate;
  let userBookingSession = data.newSessionDetails.jumaSession;
  let userBookingHash = data.newSessionDetails.sessionHash;
  let uid = context.auth.uid;
  console.log(
    "data.newSessionDetails.userCancelBooking",
    data.newSessionDetails.userCancelBooking
  );
  console.log("qqqqq", uid);
  let newBookingDate = data.newSessionDetails.jumaDate;
  let newBookingSession = data.newSessionDetails.jumaSession;
  let oldBookingDate = data.currentUserSession.jumaDate;
  let oldBookingSession = data.currentUserSession.jumaSession;

  console.log("oldBookingSession", oldBookingSession);

  let bookingData = {
    ...data.newSessionDetails,
    firstname: data.userDetails.firstname,
    surname: data.userDetails.surname,
    mobile: data.userDetails.mobile,
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
            "/confirmed/" +
            uid
        )
        .update(bookingData)
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
              "/confirmed/" +
              uid
          )
          .remove()
      );
    }
  }

  if (data.newSessionDetails.userCancelBooking) {
    console.log("hit cancel -------");
    promises.push(
      admin
        .database()
        .ref(
          "adminSessions/cic/openSessions/" +
            oldBookingDate +
            "/" +
            oldBookingSession +
            "/confirmed/" +
            uid
        )
        .update({ userCancelBooking: true })
    );
  }

  return Promise.all(promises);
});

/* exports.jumaDate = functions.database
  .ref("/users/{userId}/jumaDate")
  .onWrite((change, context) => {
    let promises = [];
    console.log("context params is", context.params.jumaDate);
    const after = change.after.val();
    const before = change.before.val();
    console.log("context params after ", after);
    console.log("context params before", before);
    let updatedKey = context.params.jumaDate;

    if (updatedKey === "jumaDate" && after === "") {
      promises.push(
        admin
          .database()
          .ref(
            "adminSessions/cic/openSessions/" +
              userBookingDate +
              "/" +
              userBookingSession +
              "/confirmed/" +
              before
          )
          .remove()
      );
    }
    return Promise.all([]);
  });
 */
exports.copyPrivUserDetails = functions.database
  .ref("/users/{userId}")
  .onWrite((change, context) => {
    let promises = [];
    const after = change.after.val();
    //console.log("exists after log", after);

    // Only edit data when it is first created.
    if (change.before.exists()) {
      /*   console.log(
        "context change before exists",
        JSON.stringify(change.before.val())
      ); */
    }
    if (after.jumaDate === "") {
      //  console.log("change context after exists", JSON.stringify(after));
    }
    promises.push(
      admin
        .database()
        .ref("/privUserDetails/" + context.params.userId)
        .update({
          ...after,
          cancelCount: 0,
          warningCount: 0,
          banned: 0,

          admin: 0,
          deleted: false,
          deleteDate: "",

          company: {
            melbourne: {
              cic: "cic",
            },
          },
        })
    );

    return Promise.all(promises);
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
