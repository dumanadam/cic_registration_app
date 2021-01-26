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
  const {
    globalFridayFb,
    logout,
    userDetails,
    openSessions,
    superSessions,
    getSessionAttendees,
  } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminNavButtons, setAdminNavButtons] = useState("");
  const history = useHistory();
  const sessionOptions = [{ label: "Send QR Code email" }];
  const [showAttendees, setShowAttendees] = useState("");
  const [session, setSession] = useState({});
  const [showSessions, setShowSessions] = useState(false);
  const [clickedDate, setClickedDate] = useState("");
  const [sessionAttendees, setSessionAttendees] = useState([]);
  const [superSessionsx, setSuperSessionsx] = useState(null);

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
      buttonText:
        superSessions == "no-sessions" ? "Create Session" : "Update Session",
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

    async function adminGetSessions() {
      let res = await getSessionAttendees();
      console.log("attendee getusersess", res);

      return res;
    }
    setSessionAttendees(adminGetSessions());
  }, []);

  /*   useEffect(() => {
    if (openSessions === "unauthenticated") {
      history.push({
        pathname: "/",
      });
    } else {
      setLoading(false);
    }
    console.log("admindashboard opensessions", openSessions);
  }, [openSessions]); */

  useEffect(() => {
    console.log("supersessions useeff", superSessions);
    if (superSessions !== null) {
      console.log("supersessions not null", superSessions);
      if (superSessions.code === "unauthenticated") {
        history.push({
          pathname: "/",
        });
      } else if (superSessions === "no-sessions") {
        console.log("admindashboard supersessions", superSessions);
        setSuperSessionsx(superSessions);
        setLoading(false);
      } else {
        setSuperSessionsx(superSessions);
        setLoading(false);
      }
    }
  }, [superSessions]);

  useEffect(() => {
    setAdminNavButtons(NavButtons(3, buttonDetails));
    console.log("loading admindash", loading);
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
      pathname: "/scanner",
      search: e.target.textContent,
      state: {
        selectedDate: clickedDate,
        selectedTime: e.target.textContent,
        superSessionsx: superSessionsx,
      },
    });
  }

  function SessionList() {
    console.log("loop superSessionsx", superSessionsx);
    function loopSessions() {
      if (superSessionsx !== "no-sessions" && superSessionsx !== null) {
        let sessionDates = Object.keys(superSessionsx).map(function (
          key,
          index
        ) {
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

        return sessionDates;
      } else {
        return (
          <>
            <div className="text-light text-center ">
              {TEXTDEFINITION.NO_SESSIONS_AVAILABLE_ADMIN}
            </div>
          </>
        );
      }
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
    console.log("session superSessionsx", session);
    console.log("superSessionsx[session]", superSessionsx[session]);
    let sessionTimes = Object.keys(superSessionsx[session]).map(function (
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
              <Row className="p-4 justify-content-center ">
                <div className="text-light text-center ">
                  <div className="">{TEXTDEFINITION.ADMIN_DASHBOARD_LINE1}</div>
                </div>
              </Row>

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
