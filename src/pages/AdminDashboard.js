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
    checkAdminStatus,
    adminCheckResult,
    openSSessions,
  } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminNavButtons, setAdminNavButtons] = useState("");
  const history = useHistory();
  const sessionOptions = [{ label: "Send QR Code email" }];
  const [session, setSession] = useState({});
  const [showSessions, setShowSessions] = useState(false);
  const [clickedDate, setClickedDate] = useState("");
  const [buttonDetails, setButtonDetails] = useState(null);

  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });

  useEffect(() => {
    setLoading(true);
    setpageTitle(PageTitle("Dashboard"));

    checkAdminStatus();

    /*     if (adminResult === "no-sessions") {
      // setAdminNavButtons(NavButtons(3, buttonDetails));
      console.log("admindash supersessions not null", superSessions);
      if (superSessions.code === "unauthenticated") {
      } else if (superSessions === "no-sessions") {
        console.log("admindashboard supersessions", superSessions);

        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      console.log("admindash hit false supersessions");
    } */
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
    console.log(
      "admindash supersessions useeff +++++",
      typeof superSessions,
      superSessions
    );

    if (!!superSessions) {
      setButtonDetails(
        {
          b1: {
            buttonText: Array.isArray(superSessions)
              ? "Create Session"
              : "Update Session",
            link: "/create-session",
            variant: "primary w-100",
            loading: superSessions.length > 1 ? true : false,
          },
          b2: {
            buttonText: "Update Profile",
            variant: "primary w-100",
            link: "/update-profile",
          },
          b3: {
            buttonText: "Logout",
            variant: "outline-light w-100 border-0 mt-2",
            link: "/",
          },
        },
        3
      );
    }
  }, [superSessions]);

  useEffect(() => {
    /*     if (loading === false) {
      console.log("loading admindash hit false ", loading);
      console.log("loading admindash hit false ", userDetails);
      setAdminNavButtons(NavButtons(3, buttonDetails));
    }*/
    if (!!buttonDetails) {
      setAdminNavButtons(NavButtons(3, buttonDetails));
      setLoading(false);
    }
    console.log("buttondet", buttonDetails);
  }, [buttonDetails]);

  useEffect(() => {
    console.log("user details", userDetails);
  }, [userDetails]);

  useEffect(() => {
    console.log("loading admindash", loading);
  }, [loading]);

  useEffect(() => {
    console.log("admindash adminCheckResult", adminCheckResult);

    //  console.log("admin resa", adminCheckResult);
    console.log("admin resa", adminCheckResult);
    // console.log("admin resa", adminCheckResult.message);

    if (adminCheckResult === 401) {
      console.log("admin resa", typeof adminCheckResult);

      setModalDetails({
        bodyText: "Unauthorised Access",
      });
      setTimeout(() => {
        history.push({
          pathname: "/",
        });
      }, 1500);
      return false;
    }

    if (adminCheckResult) {
      console.log("adminCheckResult is true admindash", adminCheckResult);
      openSSessions();
    }
  }, [adminCheckResult]);

  /*   useEffect(() => {
    console.log("admincheck  updated", buttonDetails);
    if (adminCheck == "no-sessions") {
      setButtonDetails({
        ...buttonDetails,
        b1: {
          buttonText: "Create Session",
          link: "/create-session",
          variant: "primary w-100",
          loading: loading,
        },
      });
    }

    //
  }, [adminCheck]); */

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
        superSessions: superSessions,
      },
    });
  }

  function SessionList() {
    console.log("loop superSessions", superSessions);
    function loopSessions() {
      if (superSessions !== "no-sessions" && superSessions !== null) {
        let sessionDates = Object.keys(superSessions).map(function (
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
    console.log("session superSessions", session);
    console.log("superSessions[session]", superSessions[session]);
    let sessionTimes = Object.keys(superSessions[session]).map(function (
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
        <ShowModal loading={loading} modalDetails={modalDetails} />
      ) : (
        showBody()
      )}
    </>
  );
}

export default AdminDashboard;
