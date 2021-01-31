import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

function SessionList(
  listKey,
  latestSessionTimes,
  handleClick,
  openSessions,
  userDetails,
  globalFriday
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
    let result = latestSessionTimes.map((sessionDetails) => {
      // console.log("globalFriday subs", globalFriday.substring(7));
      let sub = globalFriday.substring(7);
      console.log("loopSessions sub", sub);
      /*       console.log("userDetails jumadate", userDetails.jumaDate);
      console.log("openSessions[max.", openSessions);
      console.log(
        "openSessions[max.",
        openSessions[globalFriday][sessionDetails.time].maxPerSession -
          openSessions[globalFriday][sessionDetails.time].currentBooked
      ); */
      /*   console.log(
        "openSessions[booked.",
        openSessions[globalFriday][sessionDetails.time].currentBooked
      );
      console.log("subs = > ", openSessions[sub]); */
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
            {openSessions[globalFriday][sessionDetails.time].maxPerSession -
              openSessions[globalFriday][sessionDetails.time].currentBooked}
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
