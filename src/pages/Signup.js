import React, { useEffect, useRef, useState } from "react";
import { Card, Form, Button, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PrivacyPolicy from "../components/PrivacyPolicy";
import { FiSquare, FiCheckSquare } from "react-icons/fi";
import MediaQuery, { useMediaQuery } from "react-responsive";

import MQuery from "../components/MQueury";
import bgImage from "../assets/images/bg2.jpg";
import ErrorHeader from "../components/ErrorHeader";
export default function Signup(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstnameRef = useRef();
  const surnameRef = useRef();
  const mobileRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [show, setShow] = useState("");
  const [agreePrivacy, setagreePrivacy] = useState(true);
  const [agreeNewsletter, setAgreeNewsletter] = useState(true);
  const [errorState, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firstRun, setfirstRun] = useState(true);

  const [agreeColour, setAgreeColour] = useState(
    "outline-primary-* text-primary shadow-none"
  );

  console.log("signup props", props);
  console.log("signup show", show);
  //console.log("signup props.errorstate", props.errorState);

  useEffect(() => {
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

  /* useEffect(() => {
    console.log("props.errorState", props.errorState);
  }, [props.errorState]); */

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setErrorMessage("Passwords do not match");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        firstnameRef.current.value,
        surnameRef.current.value,
        mobileRef.current.value,
        agreeNewsletter
      );
      history.push("/");
    } catch (e) {
      console.log("e", e);
      setErrorState(!errorState);
      setErrorMessage(e.message);
      //setError(e.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }

    setLoading(false);
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

  return (
    <>
      {!show ? null : privacyModal()}
      <Card className=" border-0" bg="transparent">
        {ErrorHeader({
          headerText: "Juma Registration",
          errorMessage: errorMessage,
        })}

        <Card.Body className="mt-2 pt-0" style={{ minHeight: "57vh" }}>
          <Form onSubmit={handleSubmit}>
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
                  <Form.Label className="text-light">Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    autoComplete="current-password"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
          <Link className="" to="/login">
            <Button
              disabled={loading}
              variant="outline-light w-100 mt-2 border-0"
            >
              Already have an account? <span variant="">Log In</span>
            </Button>
          </Link>

          <Button
            onClick={handleShow}
            variant="outline-primary-* text-primary col shadow-none"
          >
            Privacy Policy
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}
