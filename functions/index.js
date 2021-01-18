const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

var db = admin.database();

/* function signup(
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
  } */

exports.createSessions = functions.https.onCall((data, context) => {
  let sessionOwner = "openSessions/" + data.company.toLowerCase() + "/" || null;
  admin
    .database()
    .ref("adminSessions/cic/")
    .set(data.sessionDetails)
    .then(() => {
      // Returning the sanitized message to the client.
      return true;
    })
    .catch((e) => {
      console.log("adminsessions write error");
    });

  return admin
    .database()
    .ref("sessionsPub/cic/")
    .set(data.sessionDetails)
    .then(() => {
      // Returning the sanitized message to the client.
      return true;
    });
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
exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  console.log("user created: ", user.email, user.uid);

  return admin
    .database()
    .ref("/adminUsers/" + user.uid + "/adminDetails")
    .update({
      firstname: user.firstName,
      surname: user.surName,
      mobile: user.mobileNum,
      jumaDate: "",
      jumaSession: "",
      cancelCount: 0,
      warningCount: 0,
      banned: 0,
      newsletter: user.agreeNewsletter,
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
    .then(() => {
      console.log("private degtails written");
      // Returning the sanitized message to the client.
      return true;
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

exports.makeUppercase = functions.database
  .ref("/users/{userId}")
  .onWrite((change, context) => {
    console.log("context is", context);
    console.log("context params is", context.params);
    console.log("context change is", change);
    // Grab the current value of what was written to the Realtime Database.
    const original = change.after.val();
    console.log("context original is", original);
    // Only edit data when it is first created.
    if (change.before.exists()) {
      console.log("context change before exists");
      /*       admin
        .database()
        .ref("/privUserDetails/" + user.uid)
        .update({
          ...original,

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
        .then(() => {
          console.log("private degtails written");
          // Returning the sanitized message to the client.
          return true;
        })
        .catch((e) => {
          console.log("copy error ", e);
        }); */
    }
    // Exit when the data is deleted.
    if (!change.after.exists()) {
      console.log("change context after exists");
      return null;
    }

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return admin
      .database()
      .ref("/privUserDetails/" + context.params.userId)
      .update({
        ...original,
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
      .then(() => {
        console.log("private degtails written");
        // Returning the sanitized message to the client.
        return true;
      })
      .catch((e) => {
        console.log("copy error ", e);
      });
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
