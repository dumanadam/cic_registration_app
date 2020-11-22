import React, { useRef, useState, useEffect } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import PageTitle from "../components/PageTitle";

import UpdateProfileBody from "../components/contents/UpdateProfileBody";
import TEXTDEFINITION from "../text/TextDefinition";

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
  const [loading, setLoading] = useState(true);
  const [myProps, setMyProps] = useState({});
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [settingsButton, setSettingsButton] = useState(false);
  const [pageTitle, setpageTitle] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (userDetails.firstname) {
      setMyProps({
        userDetails: userDetails,
        loading: loading,
        headerText: TEXTDEFINITION.UPDATEPROFILE_CARD_HEADER,
      });
      console.log("setting false");
      setLoading(false);
    }
    console.log("userDetails updateprofile updated", userDetails);
  }, [userDetails]);

  useEffect(() => {
    setpageTitle(PageTitle("Update Profile"));
  }, []);

  return (
    <>
      <div className="justify-content-center">
        <UpdateProfileBody
          loading={loading}
          userDetails={userDetails}
          myProps={myProps}
        ></UpdateProfileBody>
      </div>
    </>
  );
  /* return (
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
  ); */
}
