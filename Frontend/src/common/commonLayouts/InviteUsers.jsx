

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";

export const InviteUsers = (props) => {

  const params = useParams();

  const [changeState, setChangeState] = useState("invite");

  const [pendingData,setPendingData] = useState(null);
  useEffect(() => {
    if(changeState == "pending")
    {
      axiosClient.get(`/pendingList/${params.uuid}`)
      .then((res) => {
        setPendingData(res.data.pendingData);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 400) {
          console.log(response);
        } else {
          console.error("Error:", response.status);
        }
      });
    }
  },[changeState])


 const invite  = (e) => {
  
  props.setInviteEmail(e.target.value)

  }

  return (
    <div>
      <div className="bg-primary opacity-[0.5] w-[1294px] h-[664px] absolute top-0 left-0  z-10"></div>
      <div className=" absolute left-0 top-0 z-20 ">
        <div className="bg-[#fff] h-[500px] w-[600px] ml-[340px] mt-[60px] rounded-lg -z-10">
          <div className="">
            <i
              className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer mr-5"
              onClick={() => props.setInvitePopup(false)}
            ></i>
          </div>
          <div className="w-[500px] m-auto">
            <div className="pt-24">
              <p className="text-textPrimary font-bold text-2xl">
                Invite teammates to {props.team.name}
              </p>
              <p className="text-sm pt-2 text-textPrimary">
                Let's get the rest of your team using Knowledge Base.
              </p>
            </div>
            <div className="flex pt-8 space-x-8 items-center">
              <p className={` ${changeState == "invite" && "text-primary"}  ${changeState == "invite" && "decoration-primary"}  hover:underline underline underline-offset-8 cursor-pointer hover:underline-offset-8 decoration-2 `} onClick={(() => setChangeState("invite"))}>
                Invite
              </p>
              <p className={` ${changeState == "pending" && "text-primary"} ${changeState == "pending" && "decoration-primary"} hover:underline underline underline-offset-8 cursor-pointer hover:underline-offset-8 decoration-2`} onClick={(() => setChangeState("pending"))}>
                Pending
              </p>
            </div>
            {changeState == "invite" ? (
              <div className="mt-6">
                <div className="relative">
                  <input
                    type="text"
                    id="default-input"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:outline-primary block w-full p-4 pl-5 "
                    placeholder="invite teammates"
                    value={props.inviteEmail}
                    onChange={invite}
                  />
                  <select
                    id="countries"
                    className="bg-gray-50 border absolute right-2.5 bottom-2.5 border-gray-300 text-gray-900 text-sm rounded-lg block w-20 p-1.5  "
                    onChange={((e) => 
                      props.setRole(e.target.value))}
                      
                  >
                    <option selected disabled>select</option>
                    <option value="1">Admin</option>
                    <option value="2">Viewer</option>
                    <option value="3">Editor</option>
                  </select>
                </div>
                {props.inviteError && (
                  <p className="text-red-500 text-sm pt-1">{props.inviteError}</p>
                )
                }
                <button
                  type="button"
                  className="text-white bg-primary font-medium rounded-lg text-sm px-12 py-3 text-center mt-5 ml-[150px] mr-2 mb-2"
                  onClick={props.handleInviteUsers}
                >
                  Send Invite
                </button>

              </div>
            ) : (
              <div>
                <div className="bg-slate-300 w-full h-10 pl-1 pr-1 rounded mt-5 flex justify-between ">
                  <p className="pl-3 pt-1.5">email</p>
                  <p className="pr-3 pt-1.5">Action</p>
                </div>
                <div className="h-48 overflow-auto  bg-secondary">

                  {pendingData &&
                  pendingData.length > 0 ? 
                  (pendingData.map((data) => (

                     <div className=" flex justify-between mt-3 cursor-pointer ml-1 mr-1 rounded-sm hover:bg-blue-100 p-2 ">
                     <p className="pl-3">{data.email}</p>
                     <p className="pr-8">X</p>
                      </div>)
                  )
                  ):(
                    <div className="  mt-16 text-center">
                     <p className="text-lg">NO Records Found</p>

                      </div>
                  )
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};
