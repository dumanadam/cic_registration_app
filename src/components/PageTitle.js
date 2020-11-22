import React from "react";
import { Card } from "react-bootstrap";

const PageTitle = (pageString) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title className="text-center">{pageString}</Card.Title>
      </Card.Body>
    </Card>
  );
};
export default PageTitle;
