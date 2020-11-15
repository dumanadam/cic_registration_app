import React from "react";
import logo from "../cic.png";
import { Card } from "react-bootstrap";

const Header = () => {
  return (
    <div className="text-center ">
      <Card>
        <Card.Body>
          <img src={logo} alt="CIC Logo" className=""></img>
        </Card.Body>
      </Card>
    </div>
  );
};
export default Header;
