import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  ListGroup,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import SessionList from "../components/SessionList";
import ShowModal from "../components/ShowModal";
import TEXTDEFINITION from "../text/TextDefinition";
import styled from "styled-components";
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

export default function Sessions() {
  const { currentUser, userDetails, bookSession } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});
  const [latestQr, setLatestQr] = useState("");
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });

  useEffect(() => {
    console.log("userDetails", userDetails);
    if (userDetails.firstname) {
      setLoading(false);
    }
  }, [userDetails]);

  const sessionTimes = [
    { time: "1:30 pm" },
    { time: "2:30 pm" },
    { time: "3:30 pm" },
  ];

  /*   useEffect(() => {
    //  console.log("session", session);
  }, [session]); */

  useEffect(() => {
    console.log("userDetails", userDetails);
    console.log("session", session);
  }, [session]);

  useEffect(() => {
    setSession(findFriday());
  }, []);

  function handleSubmit(e) {
    console.log("hit submit");
    e.preventDefault();
    setLoading(true);

    const promises = [];
    promises.push(bookSession(session));
    Promise.all(promises)
      .then(() => {
        history.push("/session-confirmed");
      })
      .catch((e) => {
        console.log("delete error=>", error);
        console.log("delete error=>", e);
        setModalDetails({ bodyText: e.message });
        setTimeout(() => {
          setLoading(false);
          setModalDetails({ bodyText: TEXTDEFINITION.LOADING_DEFAULT });
        }, 1000);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleCancel(e) {
    console.log("hit submit");
    e.preventDefault();
    setLoading(true);

    const promises = [];
    promises.push(
      bookSession({
        jumaDate: "",
        jumaSession: "",
      })
    );
    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch((e) => {
        console.log("delete error=>", error);
        console.log("delete error=>", e);
        setModalDetails({ bodyText: e.message });
        setTimeout(() => {
          setLoading(false);
          setModalDetails({ bodyText: TEXTDEFINITION.LOADING_DEFAULT });
        }, 1000);
      })
      .finally(() => {
        // setLoading(false);
      });
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

    return {
      jumaDate: nextFriday,
      jumaSession: sessionTimes[2].time,
    };
  }

  function handleClick(time) {
    let toMD5 = {
      firstname: userDetails.firstname,
      surname: userDetails.surname,
      jumaDate: session.jumaDate,
      jumaSession: time,
    };

    console.log(md5Qr(JSON.stringify(toMD5)));

    setSession({
      ...session,
      jumaSession: time,
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
  let listDetails = {
    defaultActiveKey: checkKey,
    sessionTimes: sessionTimes,
    handleClick: handleClick,
    session: session,

    checkKey: checkKey,
  };

  function checkJuma() {
    if (userDetails.jumaDate) {
      return (
        <>
          <Row>
            <Col>
              <div className=" text-center w-100">
                {TEXTDEFINITION.SESSIONS_CONFIRMED_JUMA}
              </div>
              <div className=" text-center w-100"> {session.jumaDate}</div>
            </Col>
            <Col>
              <Button
                disabled={loading}
                variant="danger w-100 border-0 mt-2"
                onClick={handleCancel}
              >
                Cancel Session
              </Button>
            </Col>
          </Row>
        </>
      );
    } else {
      return (
        <>
          <div className=" text-center w-100">
            {TEXTDEFINITION.SESSIONS_NEXT_JUMA}
          </div>
          <div className=" text-center w-100"> {session.jumaDate}</div>
        </>
      );
    }
  }

  function showBody(params) {
    return (
      <CARD
        className=" border-0 "
        bg="transparent"
        style={{
          WebkitBoxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
          MozBoxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
          boxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
        }}
      >
        <CARD.Header className="h3 text-center text-light border-1">
          <div>{TEXTDEFINITION.BOOKINGS_SESSION_CARD_HEADER}</div>
          {console.log("userDetails", userDetails)}
        </CARD.Header>
        <CARD.Body className="mt-0 pt-0 ">
          <div style={{ height: "50vh" }}>
            {checkJuma()}
            <div className="text-center mb-2 mt-3 text-">
              <strong>
                <u>Available Sessions</u>
              </strong>
            </div>{" "}
            <ListGroup
              className="d-flex justify-content-between align-items-center w-100 "
              defaultActiveKey={checkKey()}
            >
              {SessionList(listDetails)}
            </ListGroup>
            <div className="text-center pb-4">
              <strong className=" mr-2">Selected Session :</strong>
              {session.jumaSession}
            </div>{" "}
          </div>

          <Form onSubmit={handleSubmit}>
            <Button disabled={loading} className="w-100" type="submit">
              {checkButton()}
            </Button>
            <Link className="text-light " to="/">
              <Button
                disabled={loading}
                variant="outline-light w-100 border-0 mt-2"
              >
                Dashboard
              </Button>
            </Link>
          </Form>
        </CARD.Body>
      </CARD>
    );
  }

  function checkButton() {
    if (userDetails.jumaDate) {
      return "Update Session";
    } else {
      return "Book Session";
    }
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
