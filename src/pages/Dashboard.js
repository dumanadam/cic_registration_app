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
    // console.log("userDetails", userDetails);
    if (userDetails.firstname) {
      console.log("userDetails", userDetails);

      setMyProps({
        userDetails: userDetails,
        loading: loading,
        setLoading: setLoading,
        logout: logout,
        headerText: TEXTDEFINITION.DASHBOARD_CARD_HEADER,
      });

      setLoading(false);
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
