import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";
import axiosClient from "../../../axios-client";
function GoogleCallback() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  // const [user, setUser] = useState(null);
  const location = useLocation();

  const { auth, setAuth } = useStateContext();
  // On page load, we take "search" parameters
  // and proxy them to /api/auth/callback on our Laravel API
  useEffect(() => {
    fetch(`http://localhost:4000/auth/google/callback${location.search}`, {
      method: "GET", // or 'GET' or other method
      mode: "cors",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
  }, []);

  // Helper method to fetch User data for authenticated user
  // Watch out for "Authorization" header that is added to this call
  function fetchUserData() {
    fetch(`http://localhost:4000/auth/google`, {
      method: "GET", // or 'GET' or other method
      mode: "cors",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
  }

  if (loading) {
    return <DisplayLoading />;
  } else {
    if (auth != null) {
      return <DisplayData data={auth} />;
    } else {
      return (
        <div>
          <DisplayData data={data} />

          <div style={{ marginTop: 10 }}>
            <button onClick={fetchUserData}>Fetch User</button>
          </div>
        </div>
      );
    }
  }
}

function DisplayLoading() {
  return <div>Loading....</div>;
}

function DisplayData(data) {
  return (
    <div>
      <samp>{JSON.stringify(data, null, 2)}</samp>
    </div>
  );
}

export default GoogleCallback;
