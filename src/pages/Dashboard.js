import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import TEXTDEFINITION from "../text/TextDefinition.js";
import DashboardBody from "../components/contents/DashBoardBody";
import ShowModal from "../components/ShowModal";
import { useHistory } from "react-router-dom";
const Dashboard = (props) => {
  const [loading, setLoading] = useState(true);
  const [myProps, setMyProps] = useState({});
  const {
    logout,
    userDetails,
    openSessions,
    clearUserJumaSession,
    checkUserBooking,
  } = useAuth();
  const history = useHistory();

  useEffect(() => {
    console.log("userDetails dashboard before", userDetails);
    if (!!userDetails) {
      console.log("userDetails dashboard received", userDetails);

      setMyProps({
        userDetails: userDetails,
        loading: loading,
        setLoading: setLoading,
        logout: logout,
        headerText: TEXTDEFINITION.DASHBOARD_CARD_HEADER,
        checkUserBooking: checkUserBooking,
      });

      setLoading(false);
    }

    if (userDetails == "waiting") {
      console.log("dashboard userdetails waiting", userDetails);
    }
  }, [userDetails]);

  useEffect(() => {
    console.log("opensessions dash", openSessions);
  }, [openSessions]);

  /*  useEffect(() => {
    console.log("dbody in parent refresh", userDetails);
  }, [DashboardBody]); */

  return (
    <>
      {loading ? (
        <ShowModal
          loading={loading}
          modalDetails={{ bodyText: "Connecting to CIC" }}
        /> //<ShowModal loading={loading} modalDetails={modalDetails} />
      ) : (
        <DashboardBody
          loading={loading}
          userDetails={userDetails}
          logout={logout}
          myProps={myProps}
          openSessions={openSessions}
          clearUserJumaSession={clearUserJumaSession}
        ></DashboardBody>
      )}
    </>
  );
};

export default Dashboard;
