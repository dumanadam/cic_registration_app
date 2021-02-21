import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import TEXTDEFINITION from "../text/TextDefinition.js";
import DashboardBody from "../components/contents/DashBoardBody";
import ShowModal from "../components/ShowModal";
import { useHistory } from "react-router-dom";

const Dashboard = (props) => {
  const [loading, setLoading] = useState(true);
  const [modalDetails, setModalDetails] = useState();

  const [myProps, setMyProps] = useState({});
  const {
    logout,
    userDetails,
    openSessions,
    checkUserBooking,
    missedBooking,
    globalFridayNF,
    cancelUserBooking,
    globalFridayNU,
  } = useAuth();
  const history = useHistory();

  useEffect(() => {
    console.log("dashboard props", props);

    props.setHeaders(TEXTDEFINITION.DASHBOARD_CARD_HEADER);

    //TODO move this to own function after date test change
  }, []);

  useEffect(() => {
    console.log("userDetails dashboard before", userDetails);
    if (!!userDetails) {
      console.log("userDetails dashboard received", userDetails);
      const [day, month, year] = userDetails.jumaDate.split("-");
      let userSessionDate = new Date(year, month, day);
      var today = new Date();

      setMyProps({
        userDetails: userDetails,
        loading: loading,
        setLoading: setLoading,
        logout: logout,
        headerText: TEXTDEFINITION.DASHBOARD_CARD_HEADER,
        checkUserBooking: checkUserBooking,
        globalFridayNF: globalFridayNF,
      });
      if (today > userSessionDate) {
        alertMissedBooking();
      } else {
        setLoading(false);
      }
    }
  }, [userDetails, openSessions]);

  useEffect(() => {
    console.log("opensessions dash", openSessions);
  }, [openSessions]);

  function alertMissedBooking(params) {
    console.log("missed Juma");
    setModalDetails({
      titleL1: TEXTDEFINITION.MISSED_SESSION_ASK_L1,
      bodyText:
        TEXTDEFINITION.MISSED_SESSION_ASK_L2 + " " + userDetails.jumaDate + "?",
      //modalType: "error",
      handleConfirm: true,
      buttonDetails: {
        handleAccept: handleMissAccept,
        handleReject: handleMissReject,
        textAccept: { text: "yes" },
        textReject: { text: "no", variant: "outline" },
      },
    });
    setLoading(true);
    //  missedBooking();
  }

  /*  useEffect(() => {
    console.log("dbody in parent refresh", userDetails);
  }, [DashboardBody]); */

  async function handleMissAccInfo() {
    let res = await missedBooking(userDetails);

    console.log(("res missed", res));
    !!res && setLoading(false);
  }

  async function handleMissRejInfo() {
    let res = await cancelUserBooking();

    !!res && setLoading(false);
  }

  async function handleMissAccept() {
    console.log("modal", modalDetails);
    setModalDetails({
      ...modalDetails,
      titleL1: TEXTDEFINITION.MISSED_SESSION_Attended_L1,
      bodyText: TEXTDEFINITION.MISSED_SESSION_Attended_L2,
      handleConfirm: true,
      buttonDetails: {
        handleAccept: handleMissAccInfo,
        textAccept: { text: "OK" },
      },
    });
  }

  async function handleMissReject(params) {
    const promises = [];
    let currentUserSession = {
      jumaDate: userDetails.jumaDate,
      jumaSession: userDetails.jumaSession,
      sessionHash: userDetails.sessionHash,
    };
    setModalDetails({
      ...modalDetails,
      titleL1: TEXTDEFINITION.MISSED_SESSION_ALERT_L1,
      bodyText: TEXTDEFINITION.MISSED_SESSION_ALERT_L2,
      handleConfirm: true,
      buttonDetails: {
        handleAccept: handleMissRejInfo,
        textAccept: { text: "OK" },
      },
    });
  }

  return (
    <>
      {loading ? (
        !!modalDetails ? (
          <ShowModal loading={loading} modalDetails={modalDetails} />
        ) : null
      ) : (
        <DashboardBody
          loading={loading}
          userDetails={userDetails}
          logout={logout}
          myProps={myProps}
          openSessions={openSessions}
        ></DashboardBody>
      )}
    </>
  );
};

export default Dashboard;
