import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  ListGroup,
  Row,
  Col,
  Container,
  InputGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import SessionList from "../components/SessionList";
import ShowModal from "../components/ShowModal";
import TEXTDEFINITION from "../text/TextDefinition";
import styled from "styled-components";
import FindFriday from "../components/FindFriday";
import WithTemplate from "../components/wrappers/WithTemplate";
import {
  BsChevronBarRight,
  BsChevronBarLeft,
  BsGearFill,
} from "react-icons/bs";
import { TiChevronRightOutline, TiTimesOutline } from "react-icons/ti";
var QRCode = require("qrcode.react");
var md5Qr = require("md5");

const CARD = styled(Card)`
  background: #f7f9fa;
  height: auto;
  width: 100%;

  color: snow;
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);

  @media (min-width: 786px) {
    width: 100%;
    height: 50vh;
  }

  /*   label {
    color: #24b9b6;
    font-size: 1.2em;
    font-weight: 400;
  } */

  /*   h1 {
    color: #24b9b6;
    padding-top: 0.5em;
  } */

  .form-group {
    margin-bottom: 0;
    padding-bottom: 1.2em;
  }

  .form-label {
    margin-bottom: 0;
  }

  .error {
    border: 2px solid #ff6565;
  }

  .error-message {
    color: #ff6565;
    padding-left: 0.2em;
    height: 1em;
    position: absolute;
    font-size: 0.8em;
    padding-top: 0.2em;
  }
`;

const MYFORM = styled(Form)`
  width: 90%;
  text-align: left;

  @media (min-width: 786px) {
  }
`;

const BUTTON = styled(Button)`
  border: none;
  margin-top: 1vh;
  font-weight: 400;

  &:hover {
    background: #1d3461;
  }
`;

export default function Sessions(props) {
  const {
    openSessions,
    userDetails,
    bookSession,

    globalFridayNF,
  } = useAuth();
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [session, setSession] = useState({});
  const [latestSessionTimes, setLatestSessionTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [listKey, setListKey] = useState("");
  const history = useHistory();
  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });
  const [modalText, setModalText] = useState(undefined);

  useEffect(() => {
    console.log("sessions props", props);
    console.log(" globalFridayNF, ", globalFridayNF);
    !!userDetails.jumaDate
      ? props.setHeaders(TEXTDEFINITION.SESSION_CARD_HEADER_UPDATE)
      : props.setHeaders(TEXTDEFINITION.SESSION_CARD_HEADER_BOOKING);
    setSession({
      jumaDate: globalFridayNF,
      jumaSession: !!userDetails.jumaSession
        ? userDetails.jumaSession
        : undefined,
    });
  }, []);

  useEffect(() => {
    console.log("session userDetails", userDetails);
  }, [userDetails]);

  /*   useEffect(() => {
    console.log("sessiosn listkey", listKey);
  }, [listKey]); */

  useEffect(() => {
    console.log("session obj listkey", session);
  }, [session]);

  /*   useEffect(() => {
    //  console.log("session", session);
  }, [session]); */

  useEffect(() => {
    console.log("userDetails", userDetails);
    console.log("session+++", session);
  }, [session]);

  useEffect(() => {
    console.log("session loading", loading);
  }, [loading]);

  useEffect(() => {
    console.log("session openSessions", openSessions);
    console.log("session modaldetails", modalDetails);
    console.log("session modaldetails", TEXTDEFINITION.LOADING_DEFAULT);
    if (
      openSessions &&
      modalDetails.bodyText === TEXTDEFINITION.LOADING_DEFAULT
    ) {
      setModalText("Getting latest sessions");
      getSessionTimes();
      setListKey(checkKey());
      setLoading(false);
      console.log("sessions opensessions loading", loading);
    }
  }, [openSessions]);

  function getSessionTimes() {
    let sessionTimes = Object.keys(openSessions);
    console.log("sessionTimes", sessionTimes);
    console.log("Object.keys(openSessions)[0]", Object.keys(openSessions)[0]);
    let friday = FindFriday(1, true);
    console.log("friday", friday);
    let sessionTimes2 = Object.keys(
      openSessions[Object.keys(openSessions)[0]]
    ).map((key) => {
      //console.log("mapkey", key);
      return { time: key };
    });
    //let sessionTimes2 = Object.keys(openSessions[friday]);
    console.log("sessionTimes2", sessionTimes2);
    setLatestSessionTimes(sessionTimes2);
  }

  async function handleSubmit(e) {
    let currentUserSession = {
      jumaDate: userDetails.jumaDate,
      jumaSession: userDetails.jumaSession,
      sessionHash: userDetails.sessionHash,
    };
    e.preventDefault();
    setLoading(true);
    setModalText("Booking Session");
    console.log("listKey.substring(1, 8)", listKey.substring(1, 9));
    console.log("listkey jumasession", session.jumaSession);

    if (
      !session.jumaSession ||
      session.jumaSession === listKey.substring(1, 9)
    ) {
      setModalText("Selected Session hasnt changed\n Please try again");

      setTimeout(() => {
        setLoading(false);
        console.log("sessions jumasession loading", loading);
        setModalText(TEXTDEFINITION.LOADING_DEFAULT);
      }, 2000);
      return;
    }
    let cancelBooking = false;
    let bookingResult = await bookSession(
      session,
      currentUserSession,
      cancelBooking
    );
    console.log("booksession res", bookingResult);
    if (!!bookingResult) {
      history.push("/session-confirmed");
    } else {
      setLoading(true);
      setModalText("Booking Failed, Try again in 5 mins");

      setTimeout(() => {
        history.push("/");
      }, 1000);
    }
  }

  function handleCancel(e) {
    console.log("hit cancel");

    let currentUserSession = {
      jumaDate: userDetails.jumaDate,
      jumaSession: userDetails.jumaSession,
      sessionHash: userDetails.sessionHash,
    };
    e.preventDefault();

    const promises = [];
    promises.push(
      bookSession(
        {
          jumaDate: "",
          jumaSession: "",
        },
        currentUserSession,
        true
      )
    );
    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch((e) => {
        console.log("delete error=>", error);
        console.log("delete error=>", e);
        setModalText(e.message);
        setTimeout(() => {
          console.log("sessions handlecancel promise loading", loading);
          // setLoading(false);
          setModalText(TEXTDEFINITION.LOADING_DEFAULT);
        }, 1000);
      })
      .finally(() => {
        // setLoading(false);
      });
  }

  function handleClick(time) {
    console.log("time+++", time);
    console.log("jumadate+++", globalFridayNF);
    console.log("listke+++", listKey.substring(1, 8));
    let toMD5 = {
      firstname: userDetails.firstname,
      surname: userDetails.surname,
      jumaDate: globalFridayNF,
      jumaSession: time,
    };

    setSession({
      jumaSession: time,
      jumaDate: globalFridayNF,
      sessionHash: md5Qr(JSON.stringify(toMD5)),
    });
  }

  function checkKey() {
    if (userDetails.jumaSession === "") {
      return "#" + "2:30 pm";
    } else {
      return "#" + userDetails.jumaSession;
    }
  }

  function checkUserSession() {
    if (userDetails.jumaDate) {
      return (
        <BUTTON
          variant="outline-danger text-warning mt-0"
          style={{ fontWeight: "lighter", fontSize: ".8em" }}
          disabled={loading}
          className=" w-100 "
          loading={loading}
          onClick={() => setShow(!show)}
          size="sm"
        >
          cancel booking
        </BUTTON>
      );
    }
  }

  function showBody(params) {
    return (
      <>
        <Row
          className="text-light  h-100 "
          style={{
            height: "7vh",
            alignItems: "center",
          }}
        >
          <Col>
            <Row>
              <Col xs={5} md={5} className=" align-self-center">
                <Row>
                  <Col xs={12} md={12}>
                    {userDetails.jumaDate === "" && "New Booking"}
                  </Col>
                  <Col className=" text-center">
                    <div>{userDetails.jumaDate && userDetails.jumaDate}</div>
                  </Col>
                  <Col>
                    <div>{userDetails.jumaSession}</div>
                  </Col>
                  <Col>{userDetails.jumaDate ? checkUserSession() : null}</Col>
                </Row>
              </Col>
              <Col xs={2} className=" align-self-center">
                <TiChevronRightOutline size={25} color="#ffc107 " />
              </Col>
              <Col xs={5} md={5}>
                <Row style={{ minHeight: "7vh" }} className=" w-100">
                  <Col xs={12} md={12} className=" align-self-center">
                    {session.jumaDate}
                  </Col>
                  <Col xs={12} md={12} className=" align-self-center">
                    {session.jumaSession}
                  </Col>
                </Row>
              </Col>
            </Row>

            <ListGroup
              className="d-flex justify-content-between align-items-center w-100 "
              defaultActiveKey={listKey}
            >
              <div
                style={{
                  position: "relative",

                  minWidth: "100%",
                  marginBottom: "8vh",
                }}
              ></div>
              {loading
                ? null
                : SessionList(
                    listKey,
                    latestSessionTimes,
                    handleClick,
                    openSessions,
                    userDetails,
                    globalFridayNF
                  )}
            </ListGroup>
          </Col>
        </Row>
        {/*         <div className="pb-4 mt-4 text-warning">
          <strong className=" mr-2 ">Selected Session :</strong>
          {session.jumaSession}
        </div> */}

        {/* {showButtons()} */}
      </>
    );
  }

  function showButtons() {
    return (
      <>
        <Row className="w-100">
          <Col className="text-light col p-0 mr-2 ">
            <BUTTON
              variant="primary "
              disabled={loading}
              className=" w-100 "
              loading={loading}
              onClick={(e) => handleSubmit(e)}
            >
              {userDetails.jumaDate ? "Update Session" : "Book Session"}
            </BUTTON>
          </Col>
        </Row>
        <Link className="text-light col p-0 pt-2  " to="/">
          <Button
            disabled={loading}
            variant="outline-light  w-100 mt-2 border-0"
          >
            Dashboard
          </Button>
        </Link>
      </>
    );
  }
  function checkButton() {
    if (userDetails.jumaDate) {
      return "Update Session";
    } else {
      return "Book Session";
    }
  }
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(!show);
  function cancelModal() {
    return (
      <Modal
        show={show}
        onHide={modalDetails.handleClose}
        backdrop="static"
        keyboard={true}
        centered
        aria-labelledby="example-custom-modal-styling-title"
        className="d-flex align-items-center text-dark justify-content-center "
        size="sm"
      >
        <Modal.Body className="modal-dialog-scrollable text-center">
          <div className="w-100">
            <Card.Text>Cancel Current Booking? </Card.Text>
            <div className="mt-2">
              <Button variant="danger w-100" onClick={(e) => handleCancel(e)}>
                Yes
              </Button>
              <Button
                variant="outline-primary w-100 mt-2"
                onClick={() => handleClose()}
              >
                Back
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
  return (
    <>
      {cancelModal()}
      <WithTemplate
        buttons={showButtons()}
        modal={{ loading: loading, modalText: modalText }}
      >
        {showBody()}
      </WithTemplate>
    </>
  );
}
