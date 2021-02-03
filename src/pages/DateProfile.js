import React, { useRef, useState, useEffect } from "react";
import { Card, Button, Alert, Row, Col } from "react-bootstrap";

import {
  BsChevronBarRight,
  BsChevronBarLeft,
  BsGearFill,
} from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup"; // for everything
import PageTitle from "../components/PageTitle";

import UpdateProfileBody from "../components/contents/UpdateProfileBody";
import TEXTDEFINITION from "../text/TextDefinition";

import NavButtons from "../components/NavButtons";
import MainShell from "../components/MainShell";
import { Formik, FormikProps, Form, Field, ErrorMessage } from "formik";

function DateProfile() {
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

  const validationSchema = Yup.object({
    firstname: Yup.string("Enter a First Name").required(
      "First Name is required"
    ),
    surname: Yup.string("Enter your Last Name").required(
      "Last Name is required"
    ),
    mobile: Yup.string("Enter a mobile Name").required(
      "Mobile Name is required"
    ),
  });

  console.log("rendering date");

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

  function handleSubmit(e, values, { props, setSubmitting }) {
    console.log("e", e);
    console.log("values", values);
    console.log("props", props);

    e.preventDefault();

    setErrorMessage("");
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setSubmitting(false);
      console.log("Passwords do not match");
    }

    const promises = [];

    if (emailRef.current.value !== currentUser.email) {
      console.log("hit email");
      //promises.push(updateEmail(emailRef.current.value));
    }

    if (passwordRef.current.value) {
      console.log("hit passwords");
      // promises.push(updatePassword(passwordRef.current.value));
    }

    if (firstnameRef.current.value !== userDetails.firstname) {
      //promises.push(updateFirstName(firstnameRef.current.value));
      console.log("success firstName >  ", firstnameRef.current.value);

      console.log("success userDetails.firstname", userDetails.firstname);
    } else {
      console.log(
        "fail >> firstName.current.value",
        firstnameRef.current.value
      );
      console.log("fail >> userDetails.firstname", userDetails.firstname);
      setErrorMessage("Invalid Character in Firstname");
    }

    if (surnameRef.current.value !== userDetails.surname) {
      //  promises.push(updateSurname(surnameRef.current.value));
      console.log("success surname >  ", surnameRef.current.value);
    } else {
      console.log(
        " fail >> surnameRef.current.value",
        surnameRef.current.value
      );
      console.log("fail >> userDetails.surname", userDetails.surname);
      setErrorMessage("Invalid Character in Surname");
    }

    if (mobileRef.current.value !== userDetails.mobileNum) {
      //   promises.push(updateMobile(mobileRef.current.value));
      console.log("hit mobileNum>  ", mobileRef.current.value);
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
  setSubmitting(false);
      }); */
    // setErrorMessage("test error sdfdsf sfsfddsf dsfds");
    setSubmitting(false);
    setTimeout(() => setErrorMessage(""), 3500);
  }

  function openSettings() {
    setShowSettings(!showSettings);
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
  const errorHeader = (errorDetails) => {
    console.log("errorDetails errorheader", errorDetails);
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
  return (
    <>
      <Card className=" border-0 " bg="transparent">
        {errorHeader({
          headerText: "Date",
          errorMessage: errorMessage,
        })}
        <Card.Body className="mt-0 pt-0 ">
          <div style={{ height: "50vh" }}>
            <Row className="pt-1 text-left " style={{ minHeight: "50vh" }}>
              <Formik
                initialValues={{
                  firstname: "",
                  surname: "",
                  mobile: "",
                  email: "",
                  password: "",
                }}
                validationSchema={validationSchema}
                validate={(values) => {
                  let errors = {};
                  if (!values.firstname)
                    errors.firstname = "first name Required";
                  if (!values.surname) errors.surname = "Last name Required";
                  //check if my values have errors
                  return errors;
                }}
                onSubmit={handleSubmit}
                render={(formProps) => {
                  return (
                    <Form>
                      <Form.Control
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                      />
                      <ErrorMessage name="firstname" />
                      <Field
                        type="text"
                        name="surname"
                        placeholder="Last Name"
                      />
                      <ErrorMessage name="surname" />
                      <Field type="text" name="mobile" placeholder="Mobile" />
                      <ErrorMessage name="mobile" />
                      <Field type="text" name="email" placeholder="email" />
                      <ErrorMessage name="email" />
                      <Field
                        type="text"
                        name="password"
                        placeholder="Password"
                      />
                      <ErrorMessage name="password" />
                      <Field type="text" name="confirm" placeholder="Confirm" />
                      <ErrorMessage name="confirm" />
                      <button type="submit" disabled={formProps.isSubmitting}>
                        Submit Form
                      </button>
                    </Form>
                  );
                }}
              />
              );
            </Row>
          </div>
          {/*        <Row>
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
          </div> */}
        </Card.Body>
      </Card>
    </>
  );
}

export default DateProfile;
