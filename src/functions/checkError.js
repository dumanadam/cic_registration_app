export const checkError = (errorType) => {
  let errorText = "";
  switch (errorType) {
    case "auth/user-not-found":
      errorText = "Please check user name and password ";
      break;
    case "auth/wrong-password":
      errorText = "Please check password";
      break;
    case "auth/network-request-failed":
      errorText = "Check Network Connection";
      break;
    case "auth/email-already-in-use":
      errorText = "The email address is already in use by another account";
      break;
    case "auth/requires-recent-login":
      errorText =
        "Password change requires recent login. Please logout & login";
      break;
    default:
    // code block
  }
  return errorText;
};
