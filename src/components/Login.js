import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Header from "./Header";

export default function Login(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to sign in");
      console.log("error", e);
    }

    setLoading(false);
  }

  return (
    <>
      <Card className=" border-0" bg="transparent">
        <Card.Header className="h3 text-center text-light border-1">
          Login
        </Card.Header>
        <Card.Body className="mt-0 pt-0" style={{ minHeight: "57vh" }}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="mt-0">
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                placeholder={props.wid}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                required
                placeholder={props.hei}
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Log in
            </Button>
            <div className="container mt-4 " id="navigation">
              <div className="row " id="top-navigation">
                <Link
                  className="text-light col-6 text-left"
                  to="/forgot-password"
                >
                  <Button disabled={loading} variant="outline-light border-0">
                    Forgot Password
                  </Button>
                </Link>

                <Link className="text-light col-6 text-right" to="/signup">
                  <Button
                    disabled={loading}
                    variant="outline-light w-100 border-0"
                  >
                    User Registraion
                  </Button>
                </Link>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
