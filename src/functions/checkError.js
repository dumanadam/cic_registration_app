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
    default:
    // code block
  }
  return errorText;
};
