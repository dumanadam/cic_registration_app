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
import CheckModal from "../components/modals/CheckModal";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedArchiveDate, setSelectedArchiveDate] = useState(undefined);
  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });

  useEffect(() => {
    props.setHeaders(TEXTDEFINITION.CARD_HEADER_ADMIN_DASHBOARD);
    setModalText("Connecting to CIC Servers");
    checkAdminStatus();
  }, []);

  useEffect(() => {
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
    if (!!buttonDetails) {
      setAdminNavButtons(NavButtons(3, buttonDetails));
      setLoading(false);
    }
    console.log("buttondet", buttonDetails);
  }, [buttonDetails]);

  useEffect(() => {
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
      getSupSessions();
    }
  }, [adminCheckResult]);

  async function handleArchive(e) {
    e.preventDefault();
    setShowSessions(false);
    setShowModal(!showModal);

    console.log("archive target parentnode", e.target.parentNode.id);

    setSelectedArchiveDate(e.target.parentNode.id);
  }

  async function handleConfirm(params) {
    let res = await archiveSessions(selectedArchiveDate);

    if (res) {
      setShowModal(!showModal);
    }
  }

  useEffect(() => {
    console.log("selected archive date", selectedArchiveDate);
  }, [selectedArchiveDate]);
  function handleReject(params) {
    setShowModal(!showModal);
  }

  function handleSelectDate(e) {
    e.preventDefault();
    console.log("HANDLE DATE", e.target.textContent);
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
              <ListGroup.Item
                // disabled={showSessions}

                className="d-flex align-items-center "
                style={{ backgroundColor: "transparent" }}
              >
                <Row className="mx-auto">
                  <Col className="align-self-center">
                    <Button
                      onClick={(clicked) => handleSelectDate(clicked)}
                      key={key}
                      id={key}
                      href={key}
                    >
                      {key}
                    </Button>
                  </Col>
                  <Col className="align-self-center">
                    <Row>
                      <Col xl={12} id={key}>
                        <BsArchive
                          variant="outline text-light"
                          onClick={(clicked) => handleArchive(clicked)}
                          id={key}
                          name={key}
                          style={{ cursor: "pointer" }}
                        ></BsArchive>
                      </Col>
                      <Col>
                        <div
                          className="text-light "
                          style={{ fontSize: "x-small" }}
                        >
                          Archive
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/*      <Col onClick={() => console.log("archive")}>
                    <Row>
                      <Col xl={12}>
                        <Button variant="outline text-light">
                          <BsTrash></BsTrash>
                        </Button>
                      </Col>
                      <Col>
                        <div
                          className="text-light "
                          style={{ fontSize: "x-small" }}
                        >
                          Delete
                        </div>
                      </Col>
                    </Row>
                  </Col> */}
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
        className="pt-3 pb-3 d-flex align-items-center w-100 "
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
                  <div>{TEXTDEFINITION.ADMIN_DASHBOARD_LINE1} </div>
                  <div> {TEXTDEFINITION.ADMIN_DASHBOARD_LINE2}</div>
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
              <Col>
                <ListGroup>
                  {showSessions ? listSessionTimes() : null}
                </ListGroup>
              </Col>
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
      {showModal &&
        CheckModal({
          text1:
            "This will remove the session. All attendees sessions for this date will be cancelled.",
          text2: "Are you sure?",
          handleConfirm: handleConfirm,
          handleReject: handleReject,
          show: showModal,
        })}
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
