import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

function SessionList(listDetails) {
  function loopSessions() {
    let result = listDetails.sessionTimes.map((sessionDetails) => {
      return (
        <ListGroup.Item
          action
          href={"#" + sessionDetails.time}
          className="d-flex justify-content-between align-items-center"
          onClick={() => listDetails.handleClick(sessionDetails.time)}
        >
          {sessionDetails.time}
          <Badge variant="warning" pill>
            14
          </Badge>
        </ListGroup.Item>
      );
    });

    return result;
  }

  return (
    <ListGroup
      className="mt-3 mb-5 d-flex justify-content-between align-items-center w-100"
      defaultActiveKey={listDetails.checkKey()}
    >
      {loopSessions()}
    </ListGroup>
  );
}

SessionList.propTypes = {};

export default SessionList;
