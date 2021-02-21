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
    cancelUserBooking,
    globalFridayNF,
  } = useAuth();
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [session, setSession] = useState({});
  const [latestSessionTimes, setLatestSessionTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [listKey, setListKey] = useState("");
  const [dataReady, setDataReady] = useState(false);
  const history = useHistory();
  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });
  const [modalText, setModalText] = useState(TEXTDEFINITION.LOADING_DEFAULT);

  useEffect(() => {
    console.log("sessions props", props);
    console.log(" globalFridayNF, ", globalFridayNF);
  }, []);

  useEffect(() => {
    console.log("session userDetails", userDetails);
    if (!!userDetails && !!openSessions) {
      !!userDetails.jumaDate
        ? props.setHeaders(TEXTDEFINITION.SESSION_CARD_HEADER_UPDATE)
        : props.setHeaders(TEXTDEFINITION.SESSION_CARD_HEADER_BOOKING);
      setSession({
        jumaDate: globalFridayNF,
        jumaSession: !!userDetails.jumaSession
          ? userDetails.jumaSession
          : undefined,
      });
      setDataReady(true);
      setLoading(false);
    }
  }, [userDetails, openSessions]);

  /*   useEffect(() => {
    console.log("sessiosn listkey", listKey);
  }, [listKey]); */

  useEffect(() => {
    console.log("session modaltext", modalText);
  }, [modalText]);

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
    console.log("session modaltext", modalText);
    if (openSessions && modalText === TEXTDEFINITION.LOADING_DEFAULT) {
      setModalText("Getting latest sessions");
      getSessionTimes();
      setListKey(checkKey());

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

    let bookingResult = await bookSession(session, currentUserSession);
    console.log("booksession res", bookingResult);
    if (!!bookingResult) {
      setModalText("");
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
    setModalText("Cancelling Booking");
    setShow(!show);
    setLoading(true);

    e.preventDefault();

    const promises = [];
    promises.push(cancelUserBooking());
    Promise.all(promises)
      .then((res) => {
        console.log("res from cancel", res);
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
          cancel current booking
        </BUTTON>
      );
    }
  }

  function showBody(params) {
    return (
      <>
        <Row
          className="text-light  "
          style={{
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <Col className=" align-self-center">
            <Row>
              <Col xs={5} md={5} className=" align-self-center">
                <Row>
                  <Col xs={12} md={12}>
                    {userDetails.jumaDate === "" && "New Booking"}
                  </Col>
                  <Col xs={12} md={12} className=" text-center">
                    <div>{userDetails.jumaDate && userDetails.jumaDate}</div>
                  </Col>
                  <Col xs={12} md={12}>
                    <div>{userDetails.jumaSession}</div>
                  </Col>
                </Row>
              </Col>
              <Col xs={2} className=" align-self-center">
                <TiChevronRightOutline size={25} color="#ffc107 " />
              </Col>
              <Col xs={5} md={5}>
                <Row>
                  <Col xs={12} md={12}>
                    {session.jumaDate}
                  </Col>
                  <Col xs={12} md={12}>
                    {session.jumaSession}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={5}>
                {userDetails.jumaDate ? checkUserSession() : null}
              </Col>
            </Row>
            <Row>
              <Col>
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
              </Col>
            </Row>
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
          <Col className="text-light col p-0 ">
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

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(!show);
  };

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
      {show && cancelModal()}
      <WithTemplate
        buttons={dataReady && showButtons()}
        modal={{ loading: loading, modalText: modalText }}
      >
        {dataReady && showBody()}
      </WithTemplate>
    </>
  );
}
