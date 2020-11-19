import React from "react";
import { Card, Alert } from "react-bootstrap";

const ErrorHeader = (errorDdetails) => {
  let result =
    errorDdetails.errorMessage == "" ? (
      <Card.Header className="h3 text-center text-light border-1">
        {errorDdetails.headerText}
      </Card.Header>
    ) : (
      <Alert variant="danger text-center h6 mb-0 " style={{}}>
        {errorDdetails.errorMessage}
      </Alert>
    );

  return result;
};

export default ErrorHeader;
