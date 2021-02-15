import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

function SessionList(
  listKey,
  latestSessionTimes,
  handleClick,
  openSessions,
  userDetails,
  globalFridayNF
) {
  /* console.log(
    "listDetails" +
      "listKey" +
      listKey +
      "latestSessionTimes" +
      latestSessionTimes +
      "handleClick" +
      handleClick +
      "globalFriday" +
      globalFriday
  ); */

  function loopSessions() {
    console.log("cccc", openSessions);
    console.log("cccc", globalFridayNF);

    console.log("cccc", latestSessionTimes);
    let result = latestSessionTimes.map((sessionDetails) => {
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
            {openSessions[globalFridayNF][sessionDetails.time].maxPerSession -
              openSessions[globalFridayNF][sessionDetails.time].currentBooked}
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
