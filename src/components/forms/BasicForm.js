import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Card, Button, Alert, Row, Col, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  BsChevronBarRight,
  BsChevronBarLeft,
  BsGearFill,
} from "react-icons/bs";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import TEXTDEFINITION from "../../text/TextDefinition";
import NavButtons from "../NavButtons";
import ShowModal from "../../components/ShowModal";

const CONTAINER = styled.div`
background: #f7f9fa;
height: auto;
width: 90%;
margin: 5em auto;
zIndex: : 555555;
color: snow;
-webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
-moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);

@media (min-width: 786px) {
  width: 100%;
  height: 50vh

}

label {
  color: #24b9b6;
  font-size: 1.2em;
  font-weight: 400;
}

h1 {
  color: #24b9b6;
  padding-top: 0.5em;
}

.form-group {
  margin-bottom: 2.5em;
}

.error {
  border: 2px solid #ff6565;
}

.error-message {
  color: #ff6565;
  padding: 0.5em 0.2em;
  height: 1em;
  position: absolute;
  font-size: 0.8em;
}
`;

const MYFORM = styled(Form)`
  width: 90%;
  text-align: left;
  padding-top: 2em;
  padding-bottom: 2em;
  backgroundcolor: white;

  @media (min-width: 786px) {
  }
`;

const BUTTON = styled(Button)`
  background: #1863ab;
  border: none;
  font-size: 1.2em;
  font-weight: 400;

  &:hover {
    background: #1d3461;
  }
`;

const BasicForm = () => {
  const {
    currentUser,
    updatePassword,
    updateEmail,
    updateFirstName,
    updateSurname,
    userDetails,
    updateMobile,
    logout,
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myProps, setMyProps] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");
  const history = useHistory();

  useEffect(() => {
    // console.log("userDetails", userDetails);
    if (userDetails.firstname) {
      setMyProps({
        userDetails: userDetails,
        loading: loading,
        logout: logout,
        headerText: TEXTDEFINITION.DASHBOARD_CARD_HEADER,
      });

      setLoading(false);
    }
  }, [userDetails]);

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

  /*  function handleSubmit(e) {
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
  //  setLoading(false);
  // setTimeout(() => setErrorMessage(""), 3500);
  // } */

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
      // onClick: handleSubmit,
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
  let modelDetails = {
    bodyText: "Connecting to CIC",
  };

  // RegEx for phone number validation
  const phoneRegExp = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{1}( |-){0,1}[0-9]{3}$/;

  // Schema for yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "*Names must have at least 2 characters")
      .max(100, "*Names can't be longer than 100 characters")
      .required("*Name is required"),
    email: Yup.string()
      .email("*Must be a valid email address")
      .max(100, "*Email must be less than 100 characters")
      .required("*Email is required"),
    mobile: Yup.string()
      .matches(phoneRegExp, "*Phone number is not valid")
      .required("*Phone number required"),
    blog: Yup.string()
      .url("*Must enter URL in http://www.example.com format")
      .required("*URL required"),
    fullname: Yup.string()
      .min(2, "*Names must have at least 2 characters")
      .max(20, "*Names can't be longer than 20 characters")
      .required("*Name is required"),
  });
  return (
    <>
      {loading == true ? (
        <div>
          <ShowModal loading={loading} modalDetails={modelDetails} />{" "}
        </div>
      ) : null}
      <Card
        className=" border-0 "
        bg="transparent"
        style={{
          WebkitBoxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
          MozBoxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
          boxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Card.Header className="h3 text-center text-light border-1">
          <div>Update Degtails</div>
          {console.log("userDetails", userDetails)}
        </Card.Header>
        <Card.Body className="mt-0 pt-0 text-light">
          <Row className="pt-1 text-left " style={{ minHeight: "50vh" }}>
            <Formik
              initialValues={{
                firstname: userDetails.firstname,
                surname: userDetails.surname,
                email: currentUser.email,
                mobile: userDetails.mobile,
                password: "Leave blank to keep same",
                confirm: "Leave blank to keep same",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                // When button submits form and form is in the process of submitting, submit button is disabled
                setSubmitting(true);

                // Simulate submitting to database, shows us values submitted, resets form
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  resetForm();
                  setSubmitting(false);
                }, 500);
              }}
            >
              {/* Callback function containing Formik state and helpers that handle common form actions */}
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <MYFORM onSubmit={handleSubmit} className="mx-auto">
                  {console.log(values)}
                  <Form.Row>
                    <Col>
                      <Form.Group controlId="formFName">
                        <Form.Label>First Name :</Form.Label>
                        <Form.Control
                          type="text" /* This name property is used to access the value of the form element via values.nameOfElement */
                          name="firstname"
                          placeholder={userDetails.firstname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            touched.name && errors.name ? "error" : null
                          }
                          value={values.firstname}
                        />
                        {touched.name && errors.name ? (
                          <div className="error-message">{errors.name}</div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formSName">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                          name="surname"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.surname}
                          placeholder={userDetails.surname}
                          className={
                            touched.surname && errors.surname ? "error" : null
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Row>
                    <Col>
                      <Form.Group controlId="formmobile">
                        <Form.Label>Mobile :</Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobile"
                          placeholder={userDetails.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.mobile}
                          className={
                            touched.mobile && errors.mobile ? "error" : null
                          }
                        />
                        {touched.mobile && errors.mobile ? (
                          <div className="error-message">{errors.mobile}</div>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Form.Row>

                  <Form.Label>Email :</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={touched.email && errors.email ? "error" : null}
                  />
                  {touched.email && errors.email ? (
                    <div className="error-message">{errors.email}</div>
                  ) : null}

                  <Form.Row>
                    <Col>
                      <Form.Label className="mb-0 pb-1 pt-1">
                        Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Leave to keep pass"
                        className={
                          touched.password && errors.password ? "error" : null
                        }
                        //className={touched.password && errors.password ? "error" : null}
                      />
                      {touched.password && errors.password ? (
                        <div className="error-message">{errors.password}</div>
                      ) : null}
                    </Col>
                    <Col>
                      <Form.Label className="mb-0 pb-1 pt-1">
                        Confirmation
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="confirm"
                        placeholder="confirm"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirm}
                        className={
                          touched.confirm && errors.confirm ? "error" : null
                        }
                      />
                      {touched.confirm && errors.confirm ? (
                        <div className="error-message">{errors.confirm}</div>
                      ) : null}
                    </Col>
                  </Form.Row>

                  <Row>
                    <BUTTON
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="text-light col mt-2  w-100  "
                    >
                      {buttonDetails.b1.buttonText}
                    </BUTTON>
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
                </MYFORM>
              )}
            </Formik>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default BasicForm;
