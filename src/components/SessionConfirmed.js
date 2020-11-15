import React, { useState, useEffect } from "react";
import { Card, Alert, Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import PageTitle from "./PageTitle";

var QRCode = require("qrcode.react");

export default function SessionConfirmed() {
  const { userDetails, bookSession } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});
  const [latestQr, setLatestQr] = useState({});
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const sessionOptions = [{ label: "Send QR Code email" }];
  var qrString = {};

  useEffect(() => {
    setQrString();
    setError({
      text: "Address :31 Nicholson St, Coburg 3058",
      subtext: "Confirmation has been sent to your email.",
      variant: "success",
    });
  }, []);

  useEffect(() => {
    setpageTitle(PageTitle("Dashboard"));
  }, []);

  useEffect(() => {
    console.log("userdetails", userDetails);
  }, [userDetails]);

  useEffect(() => {
    console.log("latestQR", JSON.stringify(latestQr));
    //  console.log("latestQR parse", JSON.parse(latestQr));
  }, []);

  console.log("latestQR", latestQr.toString());

  function setQrString() {
    setLatestQr({
      firstname: userDetails.firstname,
      surname: userDetails.surname,
      jumaDate: userDetails.jumaDate,
      jumaSession: userDetails.jumaSession,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    setError("");
    const promises = [];
    promises.push(bookSession(session));
    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to Update Account");
        console.log("delete error=>", error);
      })
      .finally(() => {});
  }

  function sessionSettings() {
    return sessionOptions.map((option) => (
      <div key={`default-radio`} className="mt-1 text-center">
        <Form.Check type={"radio"} id={option.label} label={option.label} />
      </div>
    ));
  }

  function formatSessionDetails() {
    let sessionDetails = [
      {
        title: "Confirmed",
        text: <FiUserCheck></FiUserCheck>,
      },
      {
        title: "Session",
        text: userDetails.jumaSession,
      },
      {
        title: "Date",
        text: userDetails.jumaDate.substring(7),
      },
    ];

    return sessionDetails.map((detail) => (
      <div className="row ">
        <div className="col text-right">
          <strong className="ml-5 pl-5   text-primary">{detail.title}</strong>
        </div>
        <div className="col text-left">
          <span className="text-success">{detail.text}</span>
        </div>
      </div>
    ));
  }

  return (
    <>
      <Card>
        <Card.Header className="h3 text-center" style={{ color: "#004619" }}>
          Booking Confirmed
        </Card.Header>
        <Card.Body style={{ minHeight: "57vh" }}>
          <div className="mt-4 text-center w-100">
            <QRCode
              style={{}}
              renderAs="SVG"
              value="test"
              fgColor="#004619"
              //bgColor="#faa61a"
            />
          </div>
          <Card.Title className="mt-4 text-left">
            {userDetails.jumaSession}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted text-left">
            {userDetails.jumaDate}
          </Card.Subtitle>
          <Card.Title className="mt-4 text-left">Please Note : </Card.Title>
          <Card.Subtitle className="mb-2 text-muted text-left">
            Screenshot or take a photo with your phone. Please show CIC staff on
            arrival.
          </Card.Subtitle>

          {error && (
            <Alert variant={error.variant} className="mt-4">
              {error.text}
              <div>{error.subtext}</div>
            </Alert>
          )}

          <div class="container mt-4 " id="navigation">
            <div class="row" id="top-navigation">
              <Button disabled={loading} className="col mr-2">
                <Link className="text-light" to="/sessions">
                  Change Session
                </Link>
              </Button>

              <Button variant="danger col">
                <Link className="text-light" to="/">
                  Cancel Booking
                </Link>
              </Button>
            </div>

            <div id="bottom-navigation">
              <Button variant="dark w-100 mt-4">
                <Link className="text-light" to="/">
                  Return to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
