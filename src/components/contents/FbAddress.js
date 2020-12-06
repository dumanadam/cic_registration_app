import React from "react";

function FbAddress(addressRequest, userDetails, newSessionDetails, auth) {
  console.log("addressRequest", addressRequest);
  switch (addressRequest) {
    case "newCompanyBookingDBAddress":
      console.log("hit newCompanyBookingDBAddress");
      let addressnew =
        "sessions/" +
        userDetails.company.melbourne.cic +
        "/openSessions/" +
        newSessionDetails.jumaDate +
        "/" +
        newSessionDetails.jumaSession +
        "/confirmed/" +
        auth.currentUser.uid;
      return addressnew;
      break;
    case "oldCompanyBookingDBADdress":
      let addressold =
        "sessions/" +
        userDetails.company.melbourne.cic +
        "/openSessions/" +
        userDetails.jumaDate +
        "/" +
        userDetails.jumaSession +
        "/confirmed/" +
        auth.currentUser.uid;
      return addressold;
      break;
    default:
      console.log("hit default");
      break;
  }
  return <div></div>;
}

export default FbAddress;
