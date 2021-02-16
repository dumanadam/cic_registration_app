import React, { useRef, useState, useEffect } from "react";

import { Link, useHistory } from "react-router-dom";

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

import TEXTDEFINITION from "../text/TextDefinition.js";
import NavButtons from "../components/NavButtons";
import { BsArchive, BsTrash } from "react-icons/bs";
import ShowModal from "../components/ShowModal";
import WithTemplate from "../components/wrappers/WithTemplate";

function AdminDashboard(props) {
  const [error, setError] = useState("");
  const {
    userDetails,
    openSessions,
    superSessions,
    checkAdminStatus,
    adminCheckResult,
    getSupSessions,
    archiveSessions,
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [adminNavButtons, setAdminNavButtons] = useState("");
  const history = useHistory();
  const [session, setSession] = useState({});
  const [showSessions, setShowSessions] = useState(false);
  const [clickedDate, setClickedDate] = useState("");
  const [buttonDetails, setButtonDetails] = useState(null);
  const [modalText, setModalText] = useState(undefined);

  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });

  useEffect(() => {
    setLoading(true);
    setModalText("Connecting to CIC Servers");
    props.setHeaders(TEXTDEFINITION.CARD_HEADER_ADMIN_DASHBOARD);
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
      getSupSessions();
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

  function handleArchive(e) {
    e.preventDefault();
    console.log("e.target.textContent", e);
    //archiveSessions(;)
  }

  function handleSelectDate(e) {
    e.preventDefault();
    console.log("e.target.textContent", e.target.textContent);
    setSession(e.target.textContent.trim());
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
              <style type="text/css">
                {`
    .col-flat {
      background-color: purple;
      color: white;
    }

    .btn-xxl {
      padding: 1rem 1.5rem;
      font-size: 1.5rem;
    }
    `}
              </style>
              <Container>
                <Row>
                  <Col>
                    <ListGroup.Item
                      // disabled={showSessions}
                      action
                      className="d-flex justify-content-between align-items-center"
                      onClick={(clicked) => handleSelectDate(clicked)}
                      key={key}
                      id={key}
                      href={key}
                    >
                      <Row>
                        <Col xl={8} xs={8}>
                          <Button variant="outline-primary">{key}</Button>
                        </Col>
                        <Col
                          xl={2}
                          xs={2}
                          onClick={() => console.log("archive")}
                        >
                          <Button variant="outline">
                            <BsArchive></BsArchive>
                          </Button>
                        </Col>
                        <Col
                          xl={2}
                          xs={2}
                          onClick={() => console.log("archive")}
                        >
                          <Button variant="outline">
                            <BsTrash style={{ color: "black" }}></BsTrash>
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </Col>
                  {/*  <Col
                    style={{
                      backgroundColor: "white",
                      borderBottom: "1px solid lightgray",
                    }}
                  >
                    <span
                      onClick={(clicked) => handleArchive(clicked)}
                      style={{
                        paddingLeft: "3%",
                        float: "right",
                        paddingBottom: "10px",
                      }}
                    >
                      <BsTrash style={{ color: "black" }}></BsTrash>
                    </span>
                    <span
                      classname="text-warning mx-4 text-right pl-4"
                      style={{ float: "right", color: "black" }}
                    >
                      <BsArchive></BsArchive>
                    </span>
                  </Col> */}
                </Row>
              </Container>
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
      <>
        <Row
          className="text-light  "
          style={{
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <Col className=" align-self-center text-center ">
            <Row>
              {!!openSessions ? (
                <Col className="mb-3 text-warning ">
                  <div>
                    {TEXTDEFINITION.ADMIN_DASHBOARD_LINE1}
                    {TEXTDEFINITION.ADMIN_DASHBOARD_LINE2}
                  </div>
                </Col>
              ) : (
                <>
                  <Col className="mb-3 text-warning ">
                    <div>{TEXTDEFINITION.ADMIN_DASHBOARD_NO_SESSION_LINE1}</div>{" "}
                    <div>{TEXTDEFINITION.ADMIN_DASHBOARD_NO_SESSION_LINE2}</div>
                  </Col>
                </>
              )}
            </Row>
            <Row className=" align-items-center text-center ">
              <Col>{SessionList()}</Col>
            </Row>

            <Row>
              <Col>{showSessions ? listSessionTimes() : null}</Col>
            </Row>

            <Row variant="d-flex align-items-stretch h-100"></Row>
          </Col>
        </Row>
      </>
    );
  }
  function showButtons() {
    return adminNavButtons;
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

export default AdminDashboard;
