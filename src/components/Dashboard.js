import React, { useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout, userDetails } = useAuth();
  const history = useHistory();

  async function handleLogout(e) {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to Logout");
      console.log("error", e);
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div>
            <strong>As SalamuAleykum </strong> {userDetails.firstname}
          </div>
          {false ? (
            <div>
              <strong>
                You have a reservation for the following Juma session
              </strong>
              {userDetails.jumaDate}
            </div>
          ) : (
            <div>
              <strong>You currently have no Juma sessions booked</strong>
            </div>
          )}
          <div className="btn-group" role="group">
            <Link to="/sessions" className="btn btn-primary  mt-3 mr-1">
              Book Session
            </Link>
            <Link to="/update-profile" className="btn btn-info mt-3 mr-1">
              Update Profile
            </Link>
            <Link to="/update-profile" className="btn btn-warning mt-3 mr-1">
              New Mosque
            </Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <div className="w-100 text-center mt-2">
        <Link to="/delete-profile">Delete Profile</Link>
      </div>
    </>
  );
}
