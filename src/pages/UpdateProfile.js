import React, { useRef, useState, useEffect } from "react";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import {
  BsChevronBarRight,
  BsChevronBarLeft,
  BsGearFill,
} from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup"; // for everything
import PageTitle from "../components/PageTitle";

import UpdateProfileBody from "../components/contents/UpdateProfileBody";
import TEXTDEFINITION from "../text/TextDefinition";
import ErrorHeader from "../components/ErrorHeader";
import NavButtons from "../components/NavButtons";
import MainShell from "../components/MainShell";
import { Formik } from "formik";

function UpdateProfile() {
  const {
    currentUser,
    updatePassword,
    updateEmail,
    updateFirstName,
    updateSurname,
    userDetails,
    updateMobile,
  } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [myProps, setMyProps] = useState({});
  const [formErrors, setFormErrors] = useState({});
  var emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstnameRef = useRef();
  const surnameRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const mobileRef = useRef();
  const [surName, setSurName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (userDetails.firstname) {
      setMyProps({
        userDetails: userDetails,
        loading: loading,
        headerText: TEXTDEFINITION.UPDATEPROFILE_CARD_HEADER,
      });

      setLoading(false);
    }
    console.log("userDetails updateprofile updated", userDetails);
  }, [userDetails]);

  useEffect(() => {
    setDashboardNavButtons(NavButtons(1, buttonDetails));
    // console.log("updateProfileBody props nav", props);
  }, [NavButtons]);

  useEffect(() => {
    /*  console.log("showSettings flipped", showSettings);
    console.log("buttonD after flip", props); */
    setDashboardNavButtons(NavButtons(1, buttonDetails));
  }, [showSettings]);

  /*   async function handleLogout() {
    console.log("handle logout");
    setErrorMessage("");

    try {
      await props.logout();
      history.push("/login");
    } catch (e) {
      setErrorMessage("Failed to Logout");
      console.log("error", e);
    }
  } */

  function handleSubmit(e) {
    console.log("hit update profile function");
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setLoading(false);
      return setErrorMessage("Passwords do not match");
    }

    const promises = [];

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }

    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    if (
      isAlpha(firstnameRef.current.value) &&
      firstnameRef.current.value !== userDetails.firstname
    ) {
      promises.push(updateFirstName(firstnameRef.current.value));
      console.log("success firstName >  ", firstnameRef.current.value);
      console.log("firstName.current.value", firstnameRef.current.value);
      console.log("userDetails.firstname", userDetails.firstname);
    } else {
      console.log(
        "fail >> firstName.current.value",
        firstnameRef.current.value
      );
      console.log("fail >> userDetails.firstname", userDetails.firstname);
      setErrorMessage("Invalid Character in Firstname");
    }

    if (
      isAlpha(surnameRef.current.value) &&
      surnameRef.current.value !== userDetails.surname
    ) {
      promises.push(updateSurname(surnameRef.current.value));
      console.log("success surname >  ", surnameRef.current.value);
    } else {
      console.log(
        " fail >> surnameRef.current.value",
        surnameRef.current.value
      );
      console.log("fail >> userDetails.surname", userDetails.surname);
      setErrorMessage("Invalid Character in Surname");
    }

    if (mobileRef.current.value !== userDetails.mobile) {
      promises.push(updateMobile(mobileRef.current.value));
      console.log("hit mobile>  ", mobileRef.current.value);
    }
    console.log("promises", promises);
    /*   Promise.all(promises)
      .then((fbreturn) => {
        console.log("fbreturn", fbreturn);
        history.push("/");
      })
      .catch((e) => {
        console.log("promise erroe", e);
        setErrorMessage(e.message);
        setTimeout(() => setErrorMessage(""), 3500);
      })
      .finally(() => {
        setLoading(false);
      }); */
    // setErrorMessage("test error sdfdsf sfsfddsf dsfds");
    setLoading(false);
    setTimeout(() => setErrorMessage(""), 3500);
  }

  function openSettings() {
    setShowSettings(!showSettings);
  }

  function checkNumber(value) {
    console.log("checknumber >>", value);
    //  let result = /^04[0-9]{8}+$/.test(value);
    //  console.log("result", result);

    //  return result;
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
      link: "/update-profile",
      variant: "primary w-100",
      loading: loading,
      onClick: handleSubmit,
    },
    b2: {
      buttonText: "Dashboard",
      variant: "outline-light w-100 border-0  ",
      link: "/",
      loading: loading,
    },
    b3: {
      icon: "icon",
      variant: "outline-light",
      link: "/",
      openSettings: openSettings,
      renderDelete: renderDelete,
      showSettings: showSettings,
      loading: loading,
    },
  };

  useEffect(() => {
    setpageTitle(PageTitle("Update Profile"));
  }, []);

  function isAlpha(input) {
    console.log("input", input);
    let result = /^[a-zA-Z ]+$/.test(input);
    console.log("result", result);
    return result;
  }

  function errorHeader(errorDetails) {
    console.log("errorDetails errorheader", errorDetails);
    let result =
      errorDetails.errorMessage === "" ? (
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
  }

  return (
    <>
      <Card className=" border-0 " bg="transparent">
        {errorHeader({
          headerText: myProps.headerText,
          errorMessage: errorMessage,
        })}
        <Card.Body className="mt-0 pt-0 ">
          <div style={{ height: "50vh" }}>
            <Row className="pt-1 text-left " style={{ minHeight: "50vh" }}>
              <Form onSubmit={handleSubmit} id="update-profile">
                <Form.Row>
                  <Col>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      id="firstname"
                      type="text"
                      defaultValue={userDetails.firstname}
                      ref={firstnameRef}
                      required
                      className="mb-0 pb-0"
                      onChange={(value) => isAlpha(value)}
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
                      type="tel"
                      ref={mobileRef}
                      defaultValue={userDetails.mobile}
                      className="mb-0 pb-0 pt-0"
                      onChange={(value) => checkNumber(value.target.value)}
                      pattern="^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{1}( |-){0,1}[0-9]{3}$"
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
                    <Form.Label className="mb-0 pb-1 pt-1">
                      Confirmation
                    </Form.Label>
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
          <Row>
            <Link className="text-light col p-0  " to={buttonDetails.b1.link}>
              <Button
                disabled={buttonDetails.b1.loading}
                className=" w-100"
                onClick={handleSubmit}
              >
                {buttonDetails.b1.buttonText}
              </Button>
            </Link>
          </Row>
          <Row>
            <Link
              className="text-light col p-0 pt-2  "
              to={buttonDetails.b2.link}
            >
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
                {buttonDetails.b3.showSettings ? (
                  <BsChevronBarRight></BsChevronBarRight>
                ) : (
                  <BsChevronBarLeft></BsChevronBarLeft>
                )}
              </Form.Label>
            </div>
            {buttonDetails.b3.showSettings
              ? buttonDetails.b3.renderDelete()
              : ""}
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default UpdateProfile;
