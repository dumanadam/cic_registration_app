import React, { useRef, useState, useEffect } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PageTitle from "./PageTitle";
import {
  BsChevronBarRight,
  BsChevronBarLeft,
  BsGearFill,
} from "react-icons/bs";

export default function UpdateProfile() {
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
  const [surName, setSurName] = useState("");
  const [settingsButton, setSettingsButton] = useState(false);
  const [pageTitle, setpageTitle] = useState("");
  const history = useHistory();

  useEffect(() => {
    console.log("updateprofile userdetails >>", userDetails);
  }, [userDetails]);

  useEffect(() => {
    setpageTitle(PageTitle("Update Profile"));
  }, []);

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

  function openSettings(props) {
    setSettingsButton(!settingsButton);
  }

  function renderDelete() {
    return (
      <div className="col-8" variant="light">
        <Link to="/delete-profile" className="btn btn-danger w-100 ">
          Delete Profile
        </Link>
      </div>
    );
  }

  return (
    <>
      <Card>
        <Card.Header className="h3 text-center" style={{ color: "#004619" }}>
          Update Profile
        </Card.Header>
        <Card.Body style={{ minHeight: "57vh" }}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                ref={firstnameRef}
                defaultValue={userDetails.firstname}
                required
              />
            </Form.Group>
            <Form.Group id="surname">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                ref={surnameRef}
                required
                defaultValue={userDetails.surname}
              />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Form.Group className="mt-4">
              <Button
                disabled={loading}
                className="w-100 "
                variant="outline-success"
                type="submit"
              >
                Confirm
              </Button>
              <Link className="text-light " to="/">
                <Button variant="dark w-100 mt-2 ">Cancel</Button>
              </Link>
            </Form.Group>
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
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
