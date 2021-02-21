import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Alert,
  Row,
  Col,
  Spinner,
  Container,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import NavButtons from "../NavButtons";
import TEXTDEFINITION from "../../text/TextDefinition";
import MainShell from "../MainShell";
import { fbfunc, functions } from "../../firebase";
import WithTemplate from "../wrappers/WithTemplate";
import { ListGroupItem } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";

var QRCode = require("qrcode.react");

function DashboardBody(props) {
  const [error, setError] = useState("");
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");
  const history = useHistory();
  const [noSessions, setNoSessions] = useState(true);
  const [bookingsText, setBookingsText] = useState([]);
  const [buttonDetails, setButtonDetails] = useState(true);

  useEffect(() => {
    console.log("Dashboard body props", props);
    console.log("Dashboard body props nf", props.openSessions);

    setBookingsText([
      {
        title: TEXTDEFINITION.DASHBOARD_GREETING,
        detail: props.userDetails.firstname,
      },
      { title: " Date:", detail: props.userDetails.jumaDate },
      { title: "Session:", detail: props.userDetails.jumaSession },
    ]);

    setButtonDetails({
      b1: {
        buttonText:
          props.userDetails.jumaDate == "" ? "Book Session" : "Update Session",
        link: "/sessions",
        variant: "primary w-100",
        loading: false,
        disabled:
          !!props.openSessions &&
          props.openSessions[props.myProps.globalFridayNF]
            ? false
            : true,
      },
      b2: {
        buttonText: "Update Profile",
        variant: "primary w-100",
        link: "/update-profile",
        loading: props.loading,
      },
      b3: {
        buttonText: "Logout",
        variant: "outline-light w-100 border-0 mt-2",
        link: "/",
        loading: props.loading,
        handleLogout: handleLogout,
      },
    });
  }, [props]);

  useEffect(() => {
    if (buttonDetails !== true) {
      console.log("NavButtons buttondewt", buttonDetails);
      setDashboardNavButtons(NavButtons(3, buttonDetails));
    }
  }, [NavButtons]);

  useEffect(() => {
    console.log("dbody nosess", noSessions);
    !noSessions && setDashboardNavButtons(NavButtons(3, buttonDetails));
  }, [noSessions]);

  useEffect(() => {
    !!props.openSessions &&
      console.log(
        "props.openSessions[props.myProps.globalFridayNF] == null",
        props.openSessions[props.myProps.globalFridayNF]
      );
    //  props.myProps.checkUserBooking();
  }, [props.openSessions]);

  useEffect(() => {
    if (buttonDetails !== true) {
      console.log(" buttondewt", buttonDetails);
      setDashboardNavButtons(NavButtons(3, buttonDetails));
    }
  }, [buttonDetails]);

  async function handleLogout() {
    console.log("handle logout");
    setError("");

    try {
      await props.logout();
      history.push("/login");
    } catch (e) {
      setError("Failed to Logout");
      console.log("error", e);
    }
  }

  function noSessionBookedPrintMessage() {
    console.log("qqqq", props.openSessions);
    return (
      <Container className="h-100 ">
        <Row className="text-light text-center h-75 ">
          {!!props.openSessions ? (
            <>
              <Col className="align-self-center">
                <Row>
                  <Col className="mb-4 text-warning" sm={12}>
                    {TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL1}
                  </Col>
                  <Col sm={12}>{TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL2}</Col>
                </Row>
              </Col>
            </>
          ) : (
            <Col className="align-self-center">
              <Row>
                <Col className="mb-4 text-warning" sm={12}>
                  <span className="">
                    {TEXTDEFINITION.NO_SESSIONS_AVAILABLE_USER}
                  </span>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Container>
    );
  }

  function printBody() {
    return (
      <>
        <ListGroup
          style={{
            backgroundColor: "transparent",
            border: "none",
            marginTop: "2vh",
          }}
          className="py-2"
        >
          <ListGroup.Item
            style={{ backgroundColor: "transparent", border: "none" }}
            className="py-2"
          >
            <Row className="text-center">
              <Col xl={12} xs={12} className="text-warning ">
                {TEXTDEFINITION.DASHBOARD_GREETING}
              </Col>
              <Col xl={12} xs={12} className="text-light ">
                {props.userDetails.firstname} {props.userDetails.surname}
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item
            style={{ backgroundColor: "transparent", border: "none" }}
            className="py-2"
          >
            <Row className="text-center">
              <Col>
                <Col xl={12} xs={12} className="text-warning ">
                  Date
                </Col>
                <Col xl={12} xs={12} className="text-light ">
                  {props.userDetails.jumaDate}
                </Col>
              </Col>
              <Col>
                <Col xl={12} xs={12} className="text-warning ">
                  Session
                </Col>
                <Col xl={12} xs={12} className="text-light ">
                  {props.userDetails.jumaSession}
                </Col>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>

        <Row style={{ position: "relative", top: "15%" }}>
          <Col
            bg="light"
            style={{
              padding: "3vw 3vw",
              margin: "0vh 29%",

              //alignSelf: "flex-start",

              backgroundColor: props.userDetails.jumaDate
                ? "white"
                : "transparent",
            }}
          >
            <QRCode
              style={{
                height: "123px",
                width: "128px",
                alignSelf: "space-around",
                paddingLeft: 0,
                paddingRight: 0,
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                /* width: 800px, */
              }}
              renderAs="SVG"
              value={props.userDetails.sessionHash}
              fgColor="#000"
              //bgColor="#faa61a"
            />
          </Col>
        </Row>
      </>
    );
  }
  function checkUsersBooking() {
    if (props.userDetails.jumaDate == "" || props.openSessions == null) {
      return noSessionBookedPrintMessage();
    } else {
      return printBody();
    }
  }

  function checkDateValidity() {}
  return (
    <>
      <Container>
        <div style={{ height: "70vh", maxHeight: "70vh", overflow: "clip" }}>
          {!!props.userDetails && checkUsersBooking()}
        </div>
        <div id="bottom-navigation"> {dashboardNavButtons}</div>
      </Container>
    </>
  );
}

export default DashboardBody;
