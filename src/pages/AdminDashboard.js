import React, { useRef, useState, useEffect } from "react";

import { Link, useHistory } from "react-router-dom";
import CustomLink from "../components/CustomLink";

import { Button, Card, Alert, Row, Col, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

import PageTitle from "../components/PageTitle";
import TEXTDEFINITION from "../text/TextDefinition.js";
import NavButtons from "../components/NavButtons";

function AdminDashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout, userDetails } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminNavButtons, setAdminNavButtons] = useState("");
  const history = useHistory();
  const sessionOptions = [{ label: "Send QR Code email" }];

  const bookingsText = [
    {
      title: "Salamu Aleykum",
      detail: userDetails.firstname,
    },
    { title: " Date:", detail: userDetails.jumaDate },
    { title: "Session:", detail: userDetails.jumaSession },
  ];
  let buttonDetails = {
    b1: {
      buttonText: userDetails.jumaDate ? "Update Session" : "Create Session",
      link: "/create-session",
      variant: "primary w-100",
      loading: loading,
    },
    b2: {
      buttonText: "Update Profile",
      variant: "primary w-100",
      link: "/update-profile",
      loading: loading,
    },
    b3: {
      buttonText: "Logout",
      variant: "outline-light w-100 border-0 mt-2",
      link: "/",
      loading: loading,
    },
  };

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
            xl={7}
            xs={7}
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
  function printSessionDates() {
    return (
      <div className="mt-4 text-center ">
        {TEXTDEFINITION.EMPTY_ADMIN_SESSIONS}
      </div>
    );
  }
  return (
    <div className="text-light">
      <Card
        className=" border-0 h-100"
        bg="transparent"
        style={{ minHeight: "57vh" }}
      >
        <Card.Header className="h3 text-center text-light border-1">
          {TEXTDEFINITION.ADMIN_CARD_HEADER}
        </Card.Header>
        <Card.Body className="mt-0 pt-0 ">
          <div style={{ height: "50vh" }}>
            <Row>{printSessionDates()}</Row>
          </div>
          <Row variant="d-flex align-items-stretch h-100">
            {adminNavButtons}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminDashboard;
