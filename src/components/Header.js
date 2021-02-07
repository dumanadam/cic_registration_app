import React from "react";
import logo from "../assets/images/icon-demo.png";
import covidlogo from "../assets/images/covidsafe.png";
import { Card, Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import TEXTDEFINITION from "../text/TextDefinition";

const Header = (props) => {
  console.log("headerprops", props);

  //console.log("headererror", errorText);
  //console.log("eerererer", errorState);

  return (
    <>
      <Card.Header className="h3 d-flex justify-content-center text-center text-light d-flex align-items-center mt-0 mb-0 border-0">
        <Col sm={2} xl={3}>
          <img
            src={logo}
            alt="CIC Logo"
            className=""
            style={{
              width: "50px",
              height: "auto",
              marginRight: "15px",
            }}
          ></img>
        </Col>
        <Col sm={5} xl={6}>
          <div>{props.headerTitle}</div>
        </Col>
        <Col sm={2} xl={3}>
          <img
            src={covidlogo}
            alt="CIC Logo"
            className=""
            style={{
              width: "55px",
              height: "auto",
              marginLeft: "15px",
            }}
          ></img>
        </Col>
      </Card.Header>
    </>
  );
};
export default Header;
