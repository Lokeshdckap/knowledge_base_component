import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "./axios-client";
import image from "../src/assets/images/dummy.png";

export const Invited = () => {
  const params = useParams();
  let hasEffectRun = false;

  useEffect(() => {
    // if (!hasEffectRun) {
    //   axiosClient
    //     .post("/updateInvite", {
    //       team_uuid: params.uuid,
    //       role: params.id,
    //     })
    //     .then((res) => {
    //       console.log(res);
    //     });
    //   hasEffectRun = true;
    // }
  }, []);

  // if (params.uuid && params.id) {
  // axiosClient.post("/updateInvite" , {
  //     "team_uuid" : params.uuid,
  //     "role" : params.id
  // }
  // )
  // .then((res) => {
  //     console.log(res);
  // })
  // }

  //   function invite() {

  //     console.log("kjhgh");
  //         axiosClient.post("/updateInvite" , {
  //         "team_uuid" : params.uuid,
  //         "role" : params.id
  //     }
  //     )
  //     .then((res) => {
  //         console.log(res);
  //     })

  //   }
  // console.log("response");
  // axiosClient.post("/updateInvite" , {
  //     "team_uuid" : params.uuid,
  //     "role" : params.id
  // }
  // )
  // .then((res) => {
  //     console.log(res);
  // })
  //   },[])

  return (
    <div className="relative">
      <img src={image} alt="" className="bg-cover w-screen h-screen" />
      <div className="bg-primary opacity-[0.5] w-[1294px] h-screen absolute top-0 left-0  z-10"></div>
      <div className=" absolute left-0 top-0 z-20">
        <div className="bg-white h-[350px] w-[600px] ml-[350px] mt-[140px] rounded -z-10">
                

        </div>
      </div>
    </div>
  );
};
