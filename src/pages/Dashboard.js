import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import TEXTDEFINITION from "../text/TextDefinition.js";
import DashboardBody from "../components/contents/DashBoardBody";

const Dashboard = (props) => {
  const [loading, setLoading] = useState(true);
  const [myProps, setMyProps] = useState({});
  const { logout, userDetails } = useAuth();

  useEffect(() => {
    // console.log("userDetails", userDetails);
    if (userDetails.firstname) {
      console.log("userDetails", userDetails);
      setMyProps({
        userDetails: userDetails,
        loading: loading,
        logout: logout,
        headerText: TEXTDEFINITION.DASHBOARD_CARD_HEADER,
      });

      setLoading(false);
    }
  }, [userDetails]);

  /*  useEffect(() => {
    console.log("dbody in parent refresh", userDetails);
  }, [DashboardBody]); */

  return (
    <>
      <DashboardBody
        loading={loading}
        userDetails={userDetails}
        logout={logout}
        myProps={myProps}
      ></DashboardBody>
    </>
  );
};

export default Dashboard;
