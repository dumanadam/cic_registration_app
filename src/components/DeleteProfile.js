import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function DeleteProfile() {
  const passwordRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (passwordRef.current.value) {
      currentUser
        .delete()
        .then(function () {
          // User deleted.
          history.push("/");
        })
        .catch(function (error) {
          // An error happened.
          setError("Failed to Delete Account");
          console.log("delete error=>", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <>
      <Card>
        <Card.Header className="h3 text-center text-danger">
          Delete Profile
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Enter password to confirm"
              />
            </Form.Group>
            <Button
              disabled={loading}
              className="w-100"
              variant="danger"
              type="submit"
            >
              Delete Profile
            </Button>
          </Form>
          <Form.Group>
            <Link className="text-light " to="/">
              <Button disabled={loading} className="w-100 mt-2" variant="dark">
                Cancel
              </Button>
            </Link>
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
}
