import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Card, Button, Alert, Row, Col, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BsChevronUp, BsChevronDown, BsGearFill } from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import TEXTDEFINITION from "../text/TextDefinition";
import NavButtons from "../components/NavButtons";
import ShowModal from "../components/ShowModal";
import PushPromises from "../components/contents/PushPromises";
import WithTemplate from "../components/wrappers/WithTemplate";

const CARD = styled(Card)`
  background: #f7f9fa;
  height: auto;
  width: 100%;

  color: snow;
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);

  @media (min-width: 786px) {
    width: 100%;
    height: 50vh;
  }

  /*   label {
    color: #24b9b6;
    font-size: 1.2em;
    font-weight: 400;
  } */

  /*   h1 {
    color: #24b9b6;
    padding-top: 0.5em;
  } */

  .form-group {
    margin-bottom: 0;
    padding-bottom: 1.2em;
  }

  .form-label {
    margin-bottom: 0;
  }

  .error {
    border: 2px solid #ff6565;
  }

  .error-message {
    color: #ff6565;
    padding-left: 0.2em;
    height: 1em;
    position: absolute;
    font-size: 0.8em;
    padding-top: 0.2em;
  }
`;

const MYFORM = styled(Form)`
  width: 90%;
  text-align: left;

  @media (min-width: 786px) {
  }
`;

const BUTTON = styled(Button)`
  border: none;
  margin-top: 1vh;
  font-weight: 400;

  &:hover {
    background: #1d3461;
  }
`;

const UpdateProfile = () => {
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
  const [modalDetails, setModalDetails] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("userDetails updatedetails", userDetails);
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
    setModalDetails({
      bodyText: "Connecting to CIC",
    });
  }, []);

  useEffect(() => {
    console.log("modalDetails", modalDetails);
    console.log("loading modaldetails", loading);
  }, [modalDetails]);

  useEffect(() => {
    console.log("modalDetails", modalDetails);
    console.log("loading", loading);
  }, [loading]);

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

  function handleSubmitf(values, { setErrors }) {
    console.log("hit update profile values", values);
    setIsSubmitting(true);
    setLoading(true);

    if (values.password !== "" && values.confirm == "") {
      setErrors({ confirm: "Please confirm password" });
      setTimeout(() => {
        setIsSubmitting(false);
        setErrors({});
      }, 2500);

      return;
    }

    if (values.firstname !== "") {
      console.log("values.firstname ", values.firstname);
      updateFirstName(values.firstname);
    }

    if (values.surname !== "") {
      console.log("values.surname ", values.surname);
      updateSurname(values.surname);
    }

    if (values.mobileNum !== "") {
      updateMobile(values.mobileNum);
    }

    if (values.email !== "") {
      updateEmail(values.email);
    }

    if (values.password !== "") {
      console.log("values.password ", values.password);
      updatePassword(values.password);
    }
    setModalDetails({
      bodyText: "Updating",
    });
    //console.log("promises", promises);
    /* Promise.all(promises)
      .then((fbreturn) => {
        console.log("fbreturn", fbreturn);
        setModalDetails({
          bodyText: "Success",
        });
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
        }, 1000);
        // history.push("/");
      })
      .catch((e) => {
        console.log("promise erroe", e);
        console.log("promise erroe message", e.message);
        if (e.code == "auth/requires-recent-login") {
          setModalDetails({
            bodyText:
              "Password & email change requires recent authentication. Log in again before retrying this request.",
          });
          setLoading(true);

          setTimeout(() => {
            setLoading(false);
          }, 3500);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      }); */
    setLoading(false);
    setIsSubmitting(false);
  }

  function openSettings() {
    setShowSettings(!showSettings);
  }

  function renderDelete() {
    return (
      <div className="pt-2 w-100" variant="light">
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
      variant: "outline-light w-100",
      link: "/",
      openSettings: openSettings,
      renderDelete: renderDelete,
      showSettings: showSettings,
      loading: loading,
    },
  };

  // RegEx for phone number validation
  const phoneRegExp = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{1}( |-){0,1}[0-9]{3}$/;

  // Schema for yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("*Must be a valid email address")
      .max(100, "*Email must be less than 100 characters"),

    mobileNum: Yup.string().matches(phoneRegExp, "*Phone number is not valid"),

    firstname: Yup.string()
      .min(2, "Min 2 characters")
      .max(20, "*Names can't be longer than 20 characters"),

    surname: Yup.string()
      .min(2, "*Names must have at least 2 characters")
      .max(20, "*Names can't be longer than 20 characters"),

    password: Yup.string()
      .min(6, "*Password must have at least 6 characters")
      .max(128, "*Passwords can't be longer than 128 characters"),

    confirm: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  function showBody() {
    return (
      <>
        <Formik
          initialValues={{
            firstname: "",
            surname: "",
            email: "",
            mobileNum: "",
            password: "",
            confirm: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(
            values,
            {
              setSubmitting,
              resetForm,
              setstatus,

              setErrors,
            }
          ) =>
            handleSubmitf(values, {
              setSubmitting,
              resetForm,
              setstatus,

              setErrors,
            })
          }
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <MYFORM
              onSubmit={handleSubmit}
              className="mx-auto text-light"
              id="update-profile-form"
            >
              {console.log(values)}
              {console.log("errors", errors)}

              <Form.Row>
                <Col>
                  <Form.Group controlId="formFName">
                    <Form.Label>First Name :</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstname"
                      placeholder={userDetails.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstname}
                      className={
                        touched.firstname && errors.firstname ? "error" : null
                      }
                    />
                    {touched.firstname && errors.firstname ? (
                      <div className="error-message">{errors.firstname}</div>
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
                    {touched.surname && errors.surname ? (
                      <div className="error-message">{errors.surname}</div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col>
                  <Form.Group controlId="formmobile">
                    <Form.Label>Mobile :</Form.Label>
                    <Form.Control
                      type="tel"
                      name="mobileNum"
                      placeholder={userDetails.mobileNum}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.mobileNum}
                      className={
                        touched.mobileNum && errors.mobileNum ? "error" : null
                      }
                    />
                    {touched.mobileNum && errors.mobileNum ? (
                      <div className="error-message">{errors.mobileNum}</div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="formemail">
                    <Form.Label>Email :</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      placeholder={currentUser.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className={touched.email && errors.email ? "error" : null}
                    />
                    {touched.email && errors.email ? (
                      <div className="error-message">{errors.email}</div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group controlId="forpassword">
                    <Form.Label className="">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      placeholder="Unchanged"
                    />
                    {touched.password && errors.password ? (
                      <div className="error-message">{errors.password}</div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="forconfirm">
                    <Form.Label className="">Confirmation</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirm"
                      placeholder="Unchanged"
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
                  </Form.Group>
                </Col>
              </Form.Row>
            </MYFORM>
          )}
        </Formik>

        <Row>
          <Col className="text-center pt-2">
            <BsGearFill
              onClick={() => buttonDetails.b3.openSettings()}
              className="text-warning"
            ></BsGearFill>

            {buttonDetails.b3.showSettings
              ? buttonDetails.b3.renderDelete()
              : ""}
          </Col>
        </Row>
      </>
    );
  }

  function showButtons() {
    return (
      <>
        <BUTTON
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          form="update-profile-form"
          className=" w-100 "
          loading={isSubmitting}
        >
          {buttonDetails.b1.buttonText}
        </BUTTON>

        <Link className="text-light col p-0 pt-2  " to={buttonDetails.b2.link}>
          <Button
            disabled={buttonDetails.b2.loading}
            variant="outline-light border-0 w-100"
          >
            {buttonDetails.b2.buttonText}
          </Button>
        </Link>
      </>
    );
  }
  return (
    <>
      <WithTemplate
        buttons={showButtons()}
        modal={{ loading: loading, modalText: "update details text" }}
      >
        {showBody()}
      </WithTemplate>
    </>
  );
};

export default UpdateProfile;
