import React, { useState, useEffect } from "react";
import {
  Card,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import PageTitle from "../components/PageTitle";
import NavButtons from "../components/NavButtons";
var QRCode = require("qrcode.react");

export default function SessionConfirmed(confirmedSession) {
  const { userDetails, bookSession } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});

  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const sessionOptions = [{ label: "Send QR Code email" }];

  useEffect(() => {
    setError({
      text: "Address :31 Nicholson St, Coburg 3058",
      subtext: "Confirmation has been sent to your email.",
      variant: "success",
    });
  }, []);

  useEffect(() => {
    setpageTitle(PageTitle("Dashboard"));
    console.log(confirmedSession);
  }, []);

  useEffect(() => {
    console.log("userdetails", userDetails);
  }, [userDetails]);

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
  const buttonDetails = {
    b1: {
      buttonText: "Change Session",
      link: "/sessions",
      loading: loading,
    },
    b2: {
      buttonText: "Cancel Booking",
      link: "/",
      loading: loading,
    },
    b3: {
      buttonText: "Return To Dashboard",
      link: "/",
    },
  };
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
              value={userDetails.sessionHash}
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

          {NavButtons(3, buttonDetails)}
        </Card.Body>
      </Card>
    </>
  );
}
