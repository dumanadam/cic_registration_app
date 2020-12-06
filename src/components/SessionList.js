import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

function SessionList(listKey, latestSessionTimes, handleClick, checkKey) {
  console.log(
    "listDetails" +
      "listKey" +
      listKey +
      "latestSessionTimes" +
      latestSessionTimes +
      "handleClick" +
      handleClick +
      "checkKey" +
      checkKey
  );
  function loopSessions() {
    let result = latestSessionTimes.map((sessionDetails) => {
      console.log(" loopsessions sessionDetails", sessionDetails);
      return (
        <ListGroup.Item
          action
          href={"#" + sessionDetails.time}
          className="d-flex justify-content-between align-items-center"
          onClick={() => handleClick(sessionDetails.time)}
          key={sessionDetails.time}
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
      className="pt-3 pb-3 d-flex justify-content-between align-items-center w-100"
      defaultActiveKey={listKey}
    >
      {loopSessions()}
    </ListGroup>
  );
}

SessionList.propTypes = {};

export default SessionList;
