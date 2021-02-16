import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Modal,
  Row,
  Container,
  Col,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PrivacyPolicy from "../components/PrivacyPolicy";
import { FiSquare, FiCheckSquare } from "react-icons/fi";
import MediaQuery, { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { Formik, ErrorMessage } from "formik";
import MQuery from "../components/MQueury";
import bgImage from "../assets/images/bg2.jpg";
import ErrorHeader from "../components/ErrorHeader";
import ShowModal from "../components/ShowModal";
import TEXTDEFINITION from "../text/TextDefinition";
import WithTemplate from "../components/wrappers/WithTemplate";
import { checkError } from "../functions/checkError";
import * as Yup from "yup";

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

export default function Signup(props) {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");
  const firstnameRef = useRef("");
  const surnameRef = useRef("");
  const mobileRef = useRef("");
  const { signup } = useAuth();

  const [showModal, setShowModal] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [show, setShow] = useState("");
  const [agreePrivacy, setagreePrivacy] = useState(true);
  const [agreeNewsletter, setAgreeNewsletter] = useState(true);
  const [modalText, setModalText] = useState(undefined);
  const [firstRun, setfirstRun] = useState(false);
  const [formErrors, setFormErrors] = useState("");
  const [agreeColour, setAgreeColour] = useState(
    "outline-primary-* text-primary shadow-none"
  );

  //console.log("signup props.errorstate", props.errorState);

  useEffect(() => {
    props.setHeaders(TEXTDEFINITION.SIGNUP_CARD_HEADER);
    if (show == "" && firstRun == true) {
      console.log("setshow");
      setShow(true);
    }
    setfirstRun(false);
  }, []);

  useEffect(() => {
    if (agreeNewsletter === true) {
      setAgreeColour("outline-primary-* text-primary shadow-none");
    } else setAgreeColour(" outline-danger-* text-danger shadow-none");
  }, [agreeNewsletter]);
  useEffect(() => {
    console.log("modal text", modalText);
  }, [modalText]);

  async function handleSubmitold(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      console.log();

      setModalText("Passwords do not match");
      setLoading(true);
      setTimeout(() => {
        setModalText("");
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      setModalText("Signing you up!");
      setLoading(true);

      let signupResult = await signup(
        emailRef.current.value,
        passwordRef.current.value,
        firstnameRef.current.value,
        surnameRef.current.value,
        mobileRef.current.value,
        agreeNewsletter
      );
      console.log("signupResult", signupResult);
      history.push("/");
      console.log("--------after push", e);
    } catch (e) {
      console.log("******signup error", e);
      console.log("******signup error", checkError(e.message));
      setModalText(checkError(e.code));

      setTimeout(() => {
        setModalText("");
        setLoading(false);
      }, 2500);
    }
  }

  function clickedPrivacy() {
    console.log("clicked");
    setShowModal(!showModal);
  }

  const handleAgree = () => {
    setAgreeNewsletter(!agreeNewsletter);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function privacyModal() {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header>
          <Modal.Title className="text-center col">
            <div>CIC Covid-19 App</div> <div>Privacy Policy</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-dialog-scrollable" style={{}}>
          <PrivacyPolicy></PrivacyPolicy>
        </Modal.Body>
        <Modal.Footer>
          <div className="col text-center">
            <div className="col ">
              <Button onClick={handleAgree} variant={agreeColour}>
                CIC and Mosque updates{" "}
                <span className="ml-2 ">
                  {agreeNewsletter ? (
                    <FiCheckSquare></FiCheckSquare>
                  ) : (
                    <FiSquare></FiSquare>
                  )}
                </span>
              </Button>
            </div>

            <div className="mt-2">
              <Button variant="primary w-100" onClick={handleClose}>
                Agree
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  async function handleSubmit(values, { setErrors }) {
    console.log("hit update profile values", values);

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setModalText("Passwords do not match");
      setLoading(true);
      setTimeout(() => {
        setModalText("");
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      setModalText("Signing you up!");
      setLoading(true);

      let signupResult = await signup(
        values.email,
        values.password,
        values.firstname,
        values.surname,
        values.mobileNum,
        agreeNewsletter
      );
      console.log("signupResult", signupResult);
      history.push("/");
    } catch (e) {
      console.log("******signup error", e);
      console.log("******signup error", checkError(e.message));
      setModalText(checkError(e.code));

      setTimeout(() => {
        setModalText("");
        setLoading(false);
      }, 2500);
    }
  }

  useEffect(() => {
    console.log("isvalid seteerrros", formErrors);
  }, [formErrors]);

  function showBody() {
    return (
      <>
        {!show ? null : privacyModal()}
        <Row
          className="text-light  h-100 "
          style={{
            alignItems: "center",
            minHeight: "68vh",
          }}
        >
          <Col className=" align-self-center">
            <Row>
              <Col xs={12} md={12} xl={12} className=" align-self-center">
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
                    handleSubmit(values, {
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
                    isValid,
                  }) => (
                    <MYFORM
                      onSubmit={handleSubmit}
                      className="mx-auto text-light text-center"
                      id="signup-form"
                    >
                      {console.log("isvalid values", values)}
                      {values.firstname !== "" &&
                      values.surname !== "" &&
                      values.mobileNum !== "" &&
                      values.password !== "" &&
                      values.confirm !== "" &&
                      isValid
                        ? setFormErrors(true)
                        : setFormErrors(false)}

                      {console.log("errors", errors)}
                      {console.log("rrr isvalid ", isValid)}

                      <Form.Row>
                        <Col>
                          <Form.Group controlId="formFName">
                            <Form.Label>First Name :</Form.Label>
                            <Form.Control
                              autoComplete
                              type="text"
                              name="firstname"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.firstname}
                              className={
                                touched.firstname && errors.firstname
                                  ? "error"
                                  : null
                              }
                            />
                            {touched.firstname && errors.firstname ? (
                              <div className="text-warning text-left">
                                {errors.firstname}
                              </div>
                            ) : null}
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="formSName">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                              autoComplete
                              type="text"
                              name="surname"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.surname}
                              className={
                                touched.surname && errors.surname
                                  ? "error"
                                  : null
                              }
                            />
                            {touched.surname && errors.surname ? (
                              <div className="text-warning text-left">
                                {errors.surname}
                              </div>
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
                              placeholder="Must begin with 0"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.mobileNum}
                              className={
                                touched.mobileNum && errors.mobileNum
                                  ? "error"
                                  : null
                              }
                            />
                            {touched.mobileNum && errors.mobileNum ? (
                              <div className="text-warning text-left">
                                {errors.mobileNum}
                              </div>
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
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              className={
                                touched.email && errors.email ? "error" : null
                              }
                            />
                            {touched.email && errors.email ? (
                              <div className="text-warning text-left">
                                {errors.email}
                              </div>
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
                              <div className="text-warning text-left">
                                {errors.password}
                              </div>
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
                                touched.confirm && errors.confirm
                                  ? "error"
                                  : null
                              }
                            />
                            {touched.confirm && errors.confirm ? (
                              <div className="text-warning text-left">
                                {errors.confirm}
                              </div>
                            ) : null}
                          </Form.Group>
                        </Col>
                      </Form.Row>
                    </MYFORM>
                  )}
                </Formik>

                {/*       <Form
                  onSubmit={handleSubmit}
                  id="signup-form"
                  class="signup-form "
                >
                  <Row>
                    <Col className="col-6">
                      <Form.Group id="firstname">
                        <Form.Label className="text-light">
                          First Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          ref={firstnameRef}
                          required
                          name="firstname"
                          // placeholder={props.wid}
                        />
                      </Form.Group>
                    </Col>
                    <Col className="col-6">
                      <Form.Group id="surname">
                        <Form.Label className="text-light">Surname</Form.Label>
                        <Form.Control
                          type="text"
                          name="surname"
                          ref={surnameRef}
                          //   placeholder={props.hei}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group id="mobile">
                        <Form.Label className="text-light">Mobile</Form.Label>
                        <Form.Control
                          name="mobile"
                          type="tel"
                          ref={mobileRef}
                          required
                          //onFocus={() => setError("")}
                          onBlur={() => props.flipErrorState()}
                        />
                      </Form.Group>

                      <Form.Group id="email">
                        <Form.Label className="text-light">Email</Form.Label>
                        <Form.Control
                          type="email"
                          ref={emailRef}
                          required
                          name="email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-6">
                      <Form.Group id="password">
                        <Form.Label className="text-light">Password</Form.Label>
                        <Form.Control
                          type="password"
                          autoComplete="current-password"
                          ref={passwordRef}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col className="col-6">
                      <Form.Group id="password-confirm">
                        <Form.Label className="text-light">
                          Confirmation
                        </Form.Label>
                        <Form.Control
                          type="password"
                          ref={passwordConfirmRef}
                          autoComplete="current-password"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form> */}
              </Col>
            </Row>
          </Col>
        </Row>{" "}
        *
      </>
    );
  }

  // RegEx for phone number validation
  const phoneRegExp = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{1}( |-){0,1}[0-9]{3}$/;
  const fNameRegExp = /^[a-zA-Z]+$/;

  // Schema for yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("*Must be a valid email address")
      .max(100, "*Email must be less than 100 characters"),

    mobileNum: Yup.string().matches(phoneRegExp, "*Phone number is not valid"),

    firstname: Yup.string()
      .matches(fNameRegExp, "*Must be a valid name ")
      .min(2, "Min 2 characters")
      .max(20, "*Names can't be longer than 20 characters"),

    surname: Yup.string()
      .matches(fNameRegExp, "*Must be a valid name ")
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

  function showButtons() {
    return (
      <Container className="p-0 pt-2">
        <Button
          disabled={!formErrors}
          className="w-100"
          type="submit"
          form="signup-form"
        >
          Sign Up
        </Button>
        <Row className=" mt-1 pt-4">
          <Col>
            <Link className="" to="/login">
              <Button
                disabled={loading}
                variant="outline-light w-100 mt-2 border-0"
              >
                Already have an account? <span variant="">Log In</span>
              </Button>
            </Link>
          </Col>
        </Row>
        <Button
          onClick={handleShow}
          variant="outline-primary-* text-primary col shadow-none"
        >
          Privacy Policy
        </Button>
      </Container>
    );
  }

  return (
    <WithTemplate
      buttons={showButtons()}
      modal={{ loading: loading, modalText: modalText }}
    >
      {showBody()}
    </WithTemplate>
  );
}
