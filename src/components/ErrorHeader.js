import React from "react";
import { Card, Alert } from "react-bootstrap";

const ErrorHeader = (errorDetails) => {
  // console.log("errorDetails errorheader", errorDetails);
  let result =
    errorDetails.errorMessage === undefined ? (
      <Card.Header className="h3 text-center text-light border-1">
        <div>{errorDetails.headerText}</div>
      </Card.Header>
    ) : (
      <Card.Header className="h5 text-center text-danger border-1">
        <div bg="warning" style={{ height: "5vh" }}>
          {" "}
          {errorDetails.errorMessage}
        </div>
      </Card.Header>
    );

  return result;
};

export default ErrorHeader;
