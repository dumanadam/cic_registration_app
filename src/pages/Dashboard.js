import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import TEXTDEFINITION from "../text/TextDefinition.js";
import DashboardBody from "../components/contents/DashBoardBody";
import ShowModal from "../components/ShowModal";

const Dashboard = (props) => {
  const [loading, setLoading] = useState(true);
  const [myProps, setMyProps] = useState({});
  const { logout, userDetails, openSessions, clearUserJumaSession } = useAuth();

  useEffect(() => {
    console.log("userDetails dashboard", userDetails);
    if (userDetails !== null) {
      if (
        Object.keys(userDetails).length === 0 &&
        userDetails.constructor === Object
      ) {
        console.log("userDetails true", userDetails);
      } else {
        console.log("userDetails false", userDetails);

        setMyProps({
          userDetails: userDetails,
          loading: loading,
          setLoading: setLoading,
          logout: logout,
          headerText: TEXTDEFINITION.DASHBOARD_CARD_HEADER,
        });

        setLoading(false);
      }
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
      {loading ? null : ( //<ShowModal loading={loading} modalDetails={modalDetails} />
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
