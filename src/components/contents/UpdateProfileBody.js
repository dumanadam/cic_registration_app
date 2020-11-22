import React, { useRef, useState, useEffect } from "react";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import {
  BsChevronBarRight,
  BsChevronBarLeft,
  BsGearFill,
} from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";

import NavButtons from "../NavButtons";
import PageTitle from "../PageTitle";
import TEXTDEFINITION from "../../text/TextDefinition";
import { useAuth } from "../../contexts/AuthContext";
import MainShell from "../MainShell";

var QRCode = require("qrcode.react");

function UpdateProfileBody(props) {
  var emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstnameRef = useRef();
  const surnameRef = useRef();
  const {
    currentUser,
    updatePassword,
    updateEmail,
    updateFirstName,
    updateSurname,
    userDetails,
  } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const mobileRef = useRef();
  const [surName, setSurName] = useState("");
  const [settingsButton, setSettingsButton] = useState(false);
  const [pageTitle, setpageTitle] = useState("");
  const history = useHistory();
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");

  useEffect(() => {
    setDashboardNavButtons(NavButtons(1, buttonDetails));
    console.log("dbody props", props);
  }, [NavButtons]);

  /*   async function handleLogout() {
    console.log("handle logout");
    setError("");

    try {
      await props.logout();
      history.push("/login");
    } catch (e) {
      setError("Failed to Logout");
      console.log("error", e);
    }
  } */

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setLoading(false);
      return setError("Passwords do not match");
    }

    const promises = [];

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }

    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    if (firstnameRef.current.value !== userDetails.firstname) {
      promises.push(updateFirstName(firstnameRef.current.value));
    }

    if (surnameRef.current.value !== userDetails.surname) {
      promises.push(updateSurname(surnameRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to Update Account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function openSettings() {
    setSettingsButton(!settingsButton);
  }

  function renderDelete() {
    return (
      <div className="col-8 pt-2" variant="light">
        <Link to="/delete-profile" className="btn btn-danger w-100 ">
          Delete Profile
        </Link>
      </div>
    );
  }
  let buttonDetails = {
    b1: {
      buttonText: "Confirm",
      link: "/sessions",
      classnames: "primary",
      loading: loading,
    },
    b2: {
      buttonText: "Dashboard",
      classnames: "outline-light w-100 ",
      link: "/",
      loading: loading,
    },
    b3: {
      icon: "icon",
      classnames: "outline-light",
      link: "/",
      openSettings: openSettings,
      renderDelete: renderDelete,
      settingsButton: settingsButton,
      loading: loading,
    },
  };

  return (
    <>
      <div style={{ height: "50vh" }}>
        <Row className="pt-1 text-left " style={{ minHeight: "50vh" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Row>
              <Col>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  ref={firstnameRef}
                  defaultValue={userDetails.firstname}
                  required
                  className="mb-0 pb-0"
                />
              </Col>
              <Col>
                <Form.Label>Surname</Form.Label>
                <Form.Control
                  type="text"
                  ref={surnameRef}
                  required
                  defaultValue={userDetails.surname}
                  className="mb-0 pb-0"
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Form.Label className="mb-0 pb-1 pt-1">Mobile</Form.Label>
                <Form.Control
                  type="email"
                  ref={mobileRef}
                  defaultValue={currentUser.mobile}
                  className="mb-0 pb-0 pt-0"
                />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <Form.Label className="mb-0 pb-1 pt-1">Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  defaultValue={currentUser.email}
                  className="mb-0 pb-0 pt-0"
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Form.Label className="mb-0 pb-1 pt-1">Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Leave blank to keep the same"
                  className="mb-0 pb-0 pt-0"
                />
              </Col>
              <Col>
                <Form.Label className="mb-0 pb-1 pt-1">Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Leave blank to keep the same"
                  className="mb-0 pb-0 pt-0"
                />
              </Col>
            </Form.Row>
          </Form>
        </Row>
      </div>
      {/*  <Button
        disabled={loading}
        className="w-100 "
        variant="outline-success"
        type="submit"
      >
        Confirm
      </Button>
      <Link className="text-light " to="/">
        <Button variant="dark w-100 pt-2 ">Cancel</Button>
      </Link>

         <div className="row ">
        <div className="col">
          <Form.Label
            variant="light"
            onClick={(props) => openSettings(props)}
            className="text-primary"
          >
            {" "}
            <BsGearFill></BsGearFill>
            {settingsButton ? (
              <BsChevronBarRight></BsChevronBarRight>
            ) : (
              <BsChevronBarLeft></BsChevronBarLeft>
            )}
          </Form.Label>
        </div>
        {settingsButton ? renderDelete() : ""}
      </div> */}
      {/*   {<div id="bottom-navigation"> {dashboardNavButtons}</div>} */}
      <Row>
        <Link className="text-light col p-0  " to={buttonDetails.b1.link}>
          <Button disabled={buttonDetails.b1.loading} className=" w-100">
            {buttonDetails.b1.buttonText}
          </Button>
        </Link>
      </Row>
      <Row>
        <Link className="text-light col p-0 pt-2  " to={buttonDetails.b2.link}>
          <Button
            disabled={buttonDetails.b2.loading}
            variant="outline-light border-0 w-100"
          >
            {buttonDetails.b2.buttonText}
          </Button>
        </Link>
      </Row>
      <div className="row ">
        <div className="col text-center pt-2">
          <Form.Label
            variant="light"
            onClick={() => buttonDetails.b3.openSettings()}
            className="text-light"
          >
            {" "}
            <BsGearFill></BsGearFill>
            {buttonDetails.b3.settingsButton ? (
              <BsChevronBarRight></BsChevronBarRight>
            ) : (
              <BsChevronBarLeft></BsChevronBarLeft>
            )}
          </Form.Label>
        </div>
        {buttonDetails.b3.settingsButton ? buttonDetails.b3.renderDelete() : ""}
      </div>
    </>
  );
}

export default MainShell(UpdateProfileBody);
