import React from "react";
import logo from "../assets/images/cic.png";
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
      <Container className="px-0 mx-0 " style={{ width: "100vw" }}>
        <Row className="mx-auto  " style={{}}>
          <Card.Header className="h3 justify-content-center text-center text-light d-flex align-items-center m-0 p-1 border-0 w-100">
            <Col sm={2} xl={3} className="px-0">
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
            <Col sm={8} xl={6} className="px-1">
              <div>{props.headerTitle}</div>
            </Col>
            <Col sm={2} xl={3} className="px-0">
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
        </Row>
      </Container>
    </>
  );
};
export default Header;
