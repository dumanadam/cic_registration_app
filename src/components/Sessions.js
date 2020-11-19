import React, { useRef, useState, useEffect } from "react";
import { Card, Form, Button, Alert, ListGroup, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
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

  useEffect(() => {
    //  console.log("session", session);
  }, [session]);

  useEffect(() => {
    console.log("userDetails", userDetails);
  }, [userDetails]);

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
      .catch(() => {
        setError("Failed to Update Account");
        console.log("delete error=>", error);
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
    console.log("index is ", time);
    setSession({
      ...session,
      jumaSession: time,
    });
  }

  function checkKey() {
    if (userDetails.jumaSession === "") {
      return "#" + "2:30 pm";
    } else {
      return "#" + userDetails.jumaSession;
    }
  }

  return (
    <>
      <div className="text-light">
        <Card
          className=" border-0 h-100"
          bg="transparent"
          style={{ minHeight: "57vh" }}
        >
          <Card.Header className="h3 text-center text-light border-1">
            Bookings
          </Card.Header>
          <Card.Body className="mt-0 pt-0">
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
                className="mt-3 mb-5 d-flex justify-content-between align-items-center"
                defaultActiveKey={checkKey()}
              >
                <ListGroup.Item
                  action
                  href={"#" + sessionTimes[0].time}
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => handleClick(sessionTimes[0].time)}
                >
                  1:30 pm
                  <Badge variant="warning" pill>
                    14
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  href={"#" + sessionTimes[1].time}
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => handleClick(sessionTimes[1].time)}
                >
                  2:30 pm
                  <Badge variant="warning" pill>
                    6
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  href={"#" + sessionTimes[2].time}
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => handleClick(sessionTimes[2].time)}
                >
                  3:30 pm
                  <Badge variant="warning" pill>
                    25
                  </Badge>
                </ListGroup.Item>
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
                  variant="outline-light w-100 border-0"
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
