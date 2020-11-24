import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import ErrorHeader from "../components/ErrorHeader";

export default function Login(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch (e) {
      console.log(e.message);
      setErrorState(!errorState);
      setErrorMessage(e.message);
      //setError(e.message);
      setTimeout(() => setErrorMessage(""), 3500);
    }

    setLoading(false);
  }

  return (
    <>
      <Card className=" border-0" bg="transparent">
        {ErrorHeader({
          headerText: "Login",
          errorMessage: errorMessage,
        })}
        <Card.Body className="mt-0 pt-0" style={{ minHeight: "57vh" }}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="mt-0 text-light">
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                placeholder={props.wid}
                autoComplete="usernmame"
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                required
                placeholder={props.hei}
                autoComplete="current-password"
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
