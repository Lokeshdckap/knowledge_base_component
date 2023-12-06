import React, { useEffect, useState } from "react";
import mainLogo from "../../assets/images/mainlogo.png";
import Input from "../../common/commonComponents/Input";
import axiosClient from "../../axios-client";
import { useNavigate } from "react-router-dom";

export default function TeamPage() {
  const [formValues, setFormValues] = useState({});
  const [errors, setError] = useState({});

  const navigate = useNavigate();

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    delete errors[name];
  };

  const createTeam = () => {
    const validationErrors = {};

    if (!formValues.team_name) {
      validationErrors.team_name = "Team is required";
    }

    setError(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      axiosClient
        .post("/api/teams/team", formValues)
        .then((res) => {
          navigate(`/dashboard/${res.data.newTeam.uuid}`)
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 400) {
            let error = {};
            let keys = Object.keys(response.data);
            let value = Object.values(response.data);
            console.log(value);

            error[keys] = value;

            setError(error);
          } else {
            console.error("Error:", response.status);
          }
        });
    }
  };

  return (
    <div>
      {/* <div className='bg-secondary h-[664px] w-screen '> */}
      <div className="bg-white h-[550px] w-[550px] mt-12 ml-[360px] drop-shadow-lg rounded">
        <div className="bg-primary h-5 rounded-t-lg"></div>
        <div className="mt-24">
          <div className="w-[0px] m-auto">
            <img src={mainLogo} alt="" srcset="" className="m-5" />
          </div>
          <h1 className="text-center text-3xl ">Create New Team</h1>
          <p className="text-center text-base mt-2">
            Teamwork makes what's impossible to do alone possible.
          </p>
          <input
            type="text"
            name="team_name"
            id="teamname"
            className="block w-96 ml-20 rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6  mt-5"
            placeholder="Team name"
            onChange={HandleChange}
          />
          {!errors.team_name ? (
            <div>
              <p className="invisible">Required</p>
            </div>
          ) : (
            <div>
              <p className="text-red-500 ml-20">{errors.team_name}</p>
            </div>
          )}
          <button
            className="bg-primary ml-48 mt-8  hover:bg-blue-950 text-white font-bold py-3 px-10 rounded"
            onClick={createTeam}
          >
            Create team
          </button>
        </div>
      </div>

      {/* </div> */}
    </div>
  );
}
