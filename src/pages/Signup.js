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

import MQuery from "../components/MQueury";
import bgImage from "../assets/images/bg2.jpg";
import ErrorHeader from "../components/ErrorHeader";
import ShowModal from "../components/ShowModal";
import TEXTDEFINITION from "../text/TextDefinition";
import WithTemplate from "../components/wrappers/WithTemplate";
import { checkError } from "../functions/checkError";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [firstRun, setfirstRun] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      console.log();

      setModalText("Passwords do not match");
      setLoading(true);
      setTimeout(() => {
        setModalText("pass");
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
      setModalText(checkError(e.code));
      setTimeout(() => setModalText(""), 1000);
    } finally {
      // setLoading(false);
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

  function showBody() {
    return (
      <>
        {!show ? null : privacyModal()}
        <Row>
          <Card
            className="d-flex justify-content-between align-items-center w-100 border-0"
            bg="transparent"
          >
            <Card.Body className="mt-6 pt-0 ">
              <Form
                onSubmit={handleSubmit}
                id="signup-form"
                class="signup-form "
                style={{
                  position: "relative",
                  top: "33%",
                }}
              >
                <div className="row">
                  <div className="col-6">
                    <Form.Group id="firstname">
                      <Form.Label className="text-light">First Name</Form.Label>
                      <Form.Control
                        type="text"
                        ref={firstnameRef}
                        required
                        placeholder={props.wid}
                      />
                    </Form.Group>{" "}
                  </div>
                  <div className="col-6">
                    <Form.Group id="surname">
                      <Form.Label className="text-light">Surname</Form.Label>
                      <Form.Control
                        type="text"
                        ref={surnameRef}
                        placeholder={props.hei}
                      />
                    </Form.Group>
                  </div>
                </div>
                <Form.Group id="mobile">
                  <Form.Label className="text-light">Mobile</Form.Label>
                  <Form.Control
                    type="tel"
                    ref={mobileRef}
                    required
                    //onFocus={() => setError("")}
                    onBlur={() => props.flipErrorState()}
                  />
                </Form.Group>
                <Form.Group id="email">
                  <Form.Label className="text-light">Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <div className="row">
                  <div className="col-6">
                    <Form.Group id="password">
                      <Form.Label className="text-light">Password</Form.Label>
                      <Form.Control
                        type="password"
                        autoComplete="current-password"
                        ref={passwordRef}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-6">
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
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Row>
      </>
    );
  }

  function showButtons() {
    return (
      <Container className="p-0 pt-2">
        <Button
          disabled={loading}
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
