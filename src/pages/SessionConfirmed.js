import React, { useState, useEffect } from "react";
import {
  Card,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import NavButtons from "../components/NavButtons";
import ShowModal from "../components/ShowModal";
import TEXTDEFINITION from "../text/TextDefinition";
import WithTemplate from "../components/wrappers/WithTemplate";
var QRCode = require("qrcode.react");

export default function SessionConfirmed(props) {
  const { userDetails, bookSession } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const [modalText, setModalText] = useState(undefined);

  const buttonDetails = {
    b1: {
      buttonText: "Update Session",
      link: "/sessions",
      loading: loading,
      variant: "primary-outline w-100",
      // onclick: handleCancel,
    },
    b2: {
      buttonText: "Return To Dashboard",
      link: "/",
      dashboard: true,
      variant: "primary w-100 mt-2",
    },
  };

  useEffect(() => {
    console.log("props confirmed", props);
    console.log("props confirmed histiry length", history.length);
    props.setHeaders(TEXTDEFINITION.SESSION_CARD_HEADER_CONFIRMED);
  }, []);

  useEffect(() => {
    console.log("userDetails", userDetails);
    if (userDetails.firstname) {
      setLoading(false);
    }
  }, [userDetails]);

  function showBody() {
    return (
      <Row
        className="text-dark  "
        style={{
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Col className=" align-self-center">
          <Card>
            <Card.Body className="mt-0 pt-0 ">
              <div>
                <div className="pt-4 text-center w-100">
                  <QRCode
                    style={{}}
                    renderAs="SVG"
                    value={userDetails.sessionHash}
                    fgColor="#004619"
                    //bgColor="#faa61a"
                  />
                </div>
                <Card.Title className="pt-4 ">
                  {userDetails.jumaSession}
                </Card.Title>
                <Card.Subtitle className="text-muted ">
                  {userDetails.jumaDate}
                </Card.Subtitle>
                <Card.Title className="pt-4 text-center">
                  Please Note :
                </Card.Title>
                <Card.Subtitle className=" text-muted text-left">
                  {TEXTDEFINITION.BOOKING_CONFIRMED_NOTE}
                </Card.Subtitle>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  function showButtons() {
    return (
      <>
        <Link className="w-100" to="/">
          <Button
            variant="primary"
            className=" w-100 "
            disabled={loading}
            loading={loading}
          >
            Return To Dashboard
          </Button>
        </Link>
        <Link className="text-light col p-0 pt-2  " to="/sessions">
          <Button disabled={loading} variant="outline-light border-0 w-100">
            Change Session
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <WithTemplate
        buttons={showButtons()}
        modal={{ loading: loading, modalText: modalText }}
      >
        {showBody()}
      </WithTemplate>
    </>
  );
}
