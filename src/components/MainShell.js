import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import TEXTDEFINITION from "../text/TextDefinition.js";
import { Card, Alert, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import ShowModal from "./ShowModal.js";
import ErrorHeader from "./ErrorHeader.js";

const MainShell = (WrappedComponent) => {
  function printSpinner(props) {
    let modelDetails = {
      bodyText: "Connecting to CIC",
    };
    return (
      <>
        <ShowModal
          loading={props.loading}
          modalDetails={modelDetails}
        ></ShowModal>
        );
      </>
    );
  }

  function mainBody(props) {
    // console.log("sehell props", props);
    return (
      <div className="text-light">
        <Card className=" border-0 " bg="transparent">
          {ErrorHeader({
            headerText: props.myProps.headerText,
            errorMessage: props.myProps.error,
          })}
          <Card.Body className="mt-0 pt-0 ">
            <WrappedComponent {...props} />
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (props) => {
    return <>{props.loading ? printSpinner(props) : mainBody(props)}</>;
  };
};
export default MainShell;
