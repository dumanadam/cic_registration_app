import React, { useRef, useState, useEffect } from "react";

import { Link, useHistory } from "react-router-dom";
import CustomLink from "../components/CustomLink";

import {
  Button,
  Card,
  Alert,
  Row,
  Col,
  Form,
  ListGroup,
  Badge,
  Container,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

import PageTitle from "../components/PageTitle";
import TEXTDEFINITION from "../text/TextDefinition.js";
import NavButtons from "../components/NavButtons";
import Attendees from "../components/Attendees";
import ShowModal from "../components/ShowModal";

function AdminDashboard(props) {
  const [error, setError] = useState("");
  const { globalFridayFb, logout, userDetails, openSessions } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminNavButtons, setAdminNavButtons] = useState("");
  const history = useHistory();
  const sessionOptions = [{ label: "Send QR Code email" }];
  const [showAttendees, setShowAttendees] = useState("");
  const [session, setSession] = useState({});
  const [showSessions, setShowSessions] = useState(false);
  const [clickedDate, setClickedDate] = useState("");

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
    setAdminNavButtons(NavButtons(3, buttonDetails));
  }, []);

  useEffect(() => {
    if (openSessions !== "") {
      setLoading(false);
    }
  }, [openSessions]);

  useEffect(() => {
    setAdminNavButtons(NavButtons(3, buttonDetails));
  }, [loading]);

  useEffect(() => {
    console.log("user details", userDetails);
  }, [userDetails]);

  useEffect(() => {
    console.log("showAttendees", showAttendees);
    //  setShowAttendees(Attendees);
  }, [Attendees]);

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
    //  if (openSessions) {
    let sessionDates = Object.keys(openSessions).map(function (key, index) {
      /*  console.log("key", key);
      console.log("admin key", openSessions[key]);
      let l = openSessions[key]; */
      return (
        <>
          <Col>
            <Button variant="warning m-1 " onClick={(e) => handleSelectDate(e)}>
              {key}
            </Button>
          </Col>
        </>
      );
    });
    console.log("sessionDates", sessionDates);
    return sessionDates;
    //  return sessionDates;
    //}
    /* return (
      <div className="mt-4 text-center "> 
        {TEXTDEFINITION.EMPTY_ADMIN_SESSIONS}
      </div>
    ); */
  }

  function handleSelectDate(e) {
    e.preventDefault();
    console.log("e.target.textContent", e.target.textContent);
    setSession(e.target.textContent);
    setClickedDate(e.target.textContent);
    setShowSessions(true);
  }

  function handleSelectSessionTime(e) {
    console.log("e.target.textContent", e);
    history.push({
      pathname: "/attendees",
      search: e.target.textContent,
      state: {
        selectedDate: clickedDate,
        selectedTime: e.target.textContent,
      },
    });
  }

  function checkKey() {
    if (userDetails.jumaSession === "") {
      return "#";
    } else {
      return Object.keys(openSessions)[2];
    }
  }

  function handleClick(clicked) {
    console.log("clicked", clicked);
  }
  function SessionList() {
    function loopSessions() {
      let sessionDates = Object.keys(openSessions).map(function (key, index) {
        /*   console.log(" handle key is", key);
        console.log("index is", index); */
        return (
          <>
            <ListGroup.Item
              // disabled={showSessions}
              action
              className="d-flex justify-content-between align-items-center"
              onClick={(clicked) => handleSelectDate(clicked)}
              key={key}
              id={key}
              href={key}
            >
              <Row className="w-100 text-center">
                <Col>{key}</Col>
              </Row>
            </ListGroup.Item>
          </>
        );
      });
      console.log(("sessionDates", sessionDates));
      return sessionDates;
    }

    return (
      <ListGroup
        defaultActiveKey={clickedDate}
        className="pt-3 pb-3 d-flex justify-content-between align-items-center w-100"
      >
        {loopSessions()}
      </ListGroup>
    );
  }

  function listSessionTimes() {
    console.log("session", session);
    console.log("openSessions[session]", openSessions[session]);
    let sessionTimes = Object.keys(openSessions[session]).map(function (
      key,
      index
    ) {
      /*   console.log("listsession key is", key);
      console.log("index is", index); */
      return (
        <>
          <Col>
            <Button
              className=""
              variant="warning "
              onClick={(clicked) => handleSelectSessionTime(clicked)}
              key={key}
              id={key}
              style={{}}
            >
              {key}
            </Button>
          </Col>
        </>
      );
    });

    return (
      <Row style={{}} className="justify-content-center ">
        {sessionTimes}
      </Row>
    );
  }

  function showBody() {
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
              {/*  <ListGroup
              className="d-flex justify-content-between align-items-center w-100 "
              defaultActiveKey={checkKey()}
            >
              {SessionList(listDetails)}
            </ListGroup> */}
              {SessionList()}
              {/* <Row>Select Date : {printSessionDates()}</Row> */}
              {showSessions ? listSessionTimes() : null}
            </div>
            <Row variant="d-flex align-items-stretch h-100">
              {adminNavButtons}
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <>
      {loading === true ? (
        <ShowModal
          loading={loading}
          modalDetails={{ bodyText: "Connecting to CIC" }}
        />
      ) : (
        showBody()
      )}
    </>
  );
}

export default AdminDashboard;
