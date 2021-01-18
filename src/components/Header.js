import React from "react";
import logo from "../assets/images/icon-demo.png";
import covidlogo from "../assets/images/covidsafe.png";
import { Card, Container } from "react-bootstrap";

const Header = () => {
  //console.log("headerprops", props);

  //console.log("headererror", errorText);
  //console.log("eerererer", errorState);

  return (
    <>
      <Container fluid className=" text-center mt-2">
        <Card bg="transparent" className="h3 text-center text-light border-0">
          {" "}
          <Card.Body>
            <div className="row">
              <div className="col">
                <img
                  src={logo}
                  alt="CIC Logo"
                  className=""
                  style={{
                    width: "75px",
                    height: "auto",
                  }}
                ></img>
              </div>
              <div className="col">
                <img
                  src={covidlogo}
                  alt="CIC Logo"
                  className=""
                  style={{
                    width: "75px",
                    height: "auto",
                  }}
                ></img>
                {/*      <Card.Title> CIC Juma Registrations </Card.Title>
                  <div>
                    <Card.Subtitle>Covid Safe Juma</Card.Subtitle>
                  </div> */}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
export default Header;
