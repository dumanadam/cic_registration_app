import React, { useRef, useState, useEffect } from "react";
import { Card, Form, Button, Alert, ListGroup, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import SessionList from "./SessionList";
var QRCode = require("qrcode.react");
var md5Qr = require("md5");

export default function Sessions() {
  const passwordRef = useRef();
  const { currentUser, userDetails, bookSession } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});
  const [latestQr, setLatestQr] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
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
    console.log(session);
  }, [session]);

  useEffect(() => {
    setSession(findFriday());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const promises = [];
    promises.push(bookSession(session));
    Promise.all(promises)
      .then(() => {
        history.push("/sessionConfirmed");
      })
      .catch((e) => {
        console.log("delete error=>", error);
        console.log("delete error=>", e);
        setError("Failed to Update Account");
      })
      .finally(() => {
        setLoading(false);
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
      jumaSesssion: sessionTimes[2],
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
  return (
    <>
      <div className="text-light">
        <Card
          className=" border-0 h-100 text-center"
          bg="transparent"
          style={{ minHeight: "57vh" }}
        >
          <Card.Header className="h3 text-center text-light border-1">
            Bookings
          </Card.Header>
          <Card.Body className="mt-0 pt-0 ">
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="mt-4">
              <strong className="mr-5">Next Juma Date :</strong>{" "}
              {session.jumaDate}
            </div>
            <div>
              <div className="text-center mb-4 mt-3 text-">
                <strong>
                  <u>Available Sessions</u>
                </strong>
              </div>{" "}
              <ListGroup
                className="mt-3 mb-5 d-flex justify-content-between align-items-center w-100"
                defaultActiveKey={checkKey()}
              >
                {SessionList(listDetails)}
              </ListGroup>
            </div>
            <div className="text-center mb-4 mt-4">
              <strong className="mt-3 mr-2">Selected Session :</strong>
              {session.jumaSession}
            </div>{" "}
            <Form onSubmit={handleSubmit}>
              <Button disabled={loading} className="w-100" type="submit">
                Book Session
              </Button>
              <Link className="text-light " to="/">
                <Button
                  disabled={loading}
                  variant="outline-light w-100 border-0 mt-2"
                >
                  Cancel
                </Button>
              </Link>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
