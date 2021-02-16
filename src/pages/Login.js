import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Row,
  Container,
  Col,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import ErrorHeader from "../components/ErrorHeader";
import TEXTDEFINITION from "../text/TextDefinition";
import WithTemplate from "../components/wrappers/WithTemplate";
import { checkError } from "../functions/checkError";

function Login(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [modalText, setModalText] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    console.log("dashboard props", props);
    props.setHeaders(TEXTDEFINITION.LOGIN_CARD_HEADER);
  }, []);

  useEffect(() => {
    console.log("modal text", modalText);
  }, [modalText]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setModalText("Logging you in!");
      setLoading(true);
      let res = await login(emailRef.current.value, passwordRef.current.value);
      console.log("login res", res);
      history.push("/");
    } catch (e) {
      console.log("e", e);
      setModalText(checkError(e.code));

      setTimeout(() => {
        setErrorMessage("");
        setLoading(false);
      }, 3500);
    } finally {
    }
  }

  function showBody() {
    return (
      <>
        <Row
          className="text-light  "
          style={{
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <Col className=" align-self-center">
            <Form
              onSubmit={handleSubmit}
              className="mt-0 text-light "
              id="login-form"
              style={{
                position: "relative",
                top: "20%",
              }}
            >
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  required
                  // placeholder={props.wid}

                  autoComplete="usernmame"
                  className="text-center"
                  // onChange={(change) => setEnteredEmail(change)}
                />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  required
                  //  placeholder={props.hei}
                  autoComplete="current-password"
                  className="text-center"
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </>
    );
  }

  function showButtons() {
    return (
      <Container className="pt-6 mt-2">
        <Button
          disabled={loading}
          className="w-100 "
          type="submit"
          form="login-form"
        >
          Log in
        </Button>

        <Row className="mt-4 ">
          <Col xl={6} xs={6}>
            <Link to="/forgot-password">
              <Button disabled={loading} variant="outline-light border-0 ">
                Forgot Password
              </Button>
            </Link>
          </Col>
          <Col xl={6} xs={6}>
            <Link className="text-light" to="/signup">
              <Button disabled={loading} variant="outline-light border-0">
                User Registraion
              </Button>
            </Link>
          </Col>
        </Row>
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

export default Login;
