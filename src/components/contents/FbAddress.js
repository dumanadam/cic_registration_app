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
        newSessionDetails.sessionHash;
      return addressnew;

    case "oldCompanyBookingDBADdress":
      console.log("hit old");
      let addressold =
        "sessions/" +
        userDetails.company.melbourne.cic +
        "/openSessions/" +
        userDetails.jumaDate +
        "/" +
        userDetails.jumaSession +
        "/confirmed/" +
        userDetails.sessionHash;
      return addressold;

    default:
      console.log("hit default");
      break;
  }
  return <div></div>;
}

export default FbAddress;
