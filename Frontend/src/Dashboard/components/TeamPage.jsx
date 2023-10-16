import React, { useEffect, useState } from "react";
import mainLogo from "../../assets/images/mainlogo.png"
import Input from "../../common/commonComponents/Input";
import axiosClient from "../../axios-client";

export default function TeamPage() {

    const [formValues, setFormValues] = useState({});
    
      const HandleChange = (e) => {
        const { name, value } = e.target;


        setFormValues({ ...formValues, [name]: value });
        // delete errors[name];
      };

    const createTeam = () => {
        
        axiosClient.post("/team",formValues)
        .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      
    }


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
            class="block w-96 ml-20 rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6  mt-5"
            placeholder="Team name"
            onChange={HandleChange}
          

          />
          <button class="bg-primary ml-48 mt-10  hover:bg-blue-950 text-white font-bold py-3 px-10 rounded" onClick={createTeam}>
            Create team
          </button>
        </div>
      </div>

      {/* </div> */}
    </div>
  );
}
