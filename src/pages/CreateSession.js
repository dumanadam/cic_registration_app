import React, { useRef, useState, useEffect } from "react";

import { Link, useHistory } from "react-router-dom";

import { Button, Card, Alert, Row, Col, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import moment from "moment";
import PageTitle from "../components/PageTitle";
import TEXTDEFINITION from "../text/TextDefinition.js";
import NavButtons from "../components/NavButtons";

function CreateSession() {
  const [error, setError] = useState("");
  const { currentUser, logout, userDetails } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminNavButtons, setAdminNavButtons] = useState("");
  let buttonDetails = {
    b1: {
      buttonText: "Create Session",
      link: "/create-sessions",
      classnames: "info",
      loading: loading,
    },
    b2: {
      buttonText: "Add User",
      classnames: "success w-100",
      link: "/",
      loading: loading,
    },
    b3: {
      buttonText: "Logout",
      classnames: "outline-light",
      link: "/",
    },
  };
  const history = useHistory();
  const bookingsText = [
    { title: "A.S.Aleykum", detail: userDetails.firstname },
    { title: "Next Juma :", detail: userDetails.jumaDate },
    { title: "Repeat :", detail: userDetails.jumaSession },
    { title: "Sessions :", detail: userDetails.jumaSession },
    { title: "First :", detail: userDetails.jumaSession },
    { title: "Repeat :", detail: userDetails.jumaSession },
    { title: "Interval :", detail: userDetails.jumaSession },
  ];
  const sessionOptions = [{ label: "Send QR Code email" }];

  useEffect(() => {
    setpageTitle(PageTitle("Dashboard"));
    console.log("Dashboard userDetails", userDetails);
    setAdminNavButtons(NavButtons(3, buttonDetails));
  }, []);

  useEffect(() => {
    setAdminNavButtons(NavButtons(3, buttonDetails));
  }, [NavButtons]);

  function sessionButton() {
    if (userDetails.jumaDate === "") {
      return (
        <Link to="/sessions" className="btn btn-primary  mt-3 mr-1">
          Book Session
        </Link>
      );
    } else {
      return (
        <Link to="/sessionConfirmed" className="btn btn-primary  mt-3 mr-1">
          View QrCode
        </Link>
      );
    }
  }

  function sessionSettings() {
    return sessionOptions.map((option) => (
      <div key={`default-radio`} className="mt-1 text-center">
        <Form.Check type={"radio"} id={option.label} label={option.label} />
      </div>
    ));
  }

  function printSessionInfo() {
    let result = bookingsText.map((rowDetails) => {
      let sessionCheck =
        rowDetails.detail === "" ? "No Booking" : rowDetails.detail;

      return (
        <Row className="mt-4 mb-4">
          <Col
            xl={6}
            xs={6}
            className="text-warning text-right"
            style={{ fontSize: "18px" }}
          >
            {rowDetails.title}
          </Col>
          <Col className="text-light text-left" style={{ fontSize: "18px" }}>
            {sessionCheck}
          </Col>
        </Row>
      );
    });
    console.log("result", result);

    return result;
  }

  function sessionCheck(params) {
    return userDetails.jumaDate ? (
      <div className="text-light text-center ">
        <div className="text-center w-100">
          {TEXTDEFINITION.JUMA_BOOKED_CHECK}

          {userDetails.jumaDate}
        </div>
      </div>
    ) : (
      <div className="text-light text-center ">
        <div className="">{TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL1}</div>

        <span className="">{TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL2}</span>
      </div>
    );
  }

  function findFriday() {
    const dayINeed = 5;
    const today = moment().isoWeekday();
    let nextFriday;

    if (today <= dayINeed) {
      // then just give me this week's instance of that day
      nextFriday = moment().isoWeekday(dayINeed).format("dddd DD/MM/YYYY");
    } else {
      // otherwise, give me *next week's* instance of that same day
      nextFriday = moment()
        .add(1, "weeks")
        .isoWeekday(dayINeed)
        .format("dddd DD/MM/YYYY");
    }
  }

  return (
    <div className="text-light">
      <Card
        className=" border-0 h-100"
        bg="transparent"
        style={{ minHeight: "57vh" }}
      >
        <Card.Header className="h3 text-center text-light border-1">
          {TEXTDEFINITION.CR_SESSION_CARD_HEADER}
        </Card.Header>
        <Card.Body className="mt-0 pt-0 ">
          {error && <Alert variant="danger">{error}</Alert>}
          {/*       <Row className="mt-4  justify-content-center">
            You currently have no sessions open
          </Row> */}
          <div className="mt-4 text-center " style={{ minHeight: "50vh" }}>
            {printSessionInfo()}
          </div>
          <Row variant="d-flex align-items-stretch h-100">
            {adminNavButtons}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CreateSession;
