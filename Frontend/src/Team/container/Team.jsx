import React, { useEffect, useState } from 'react'
import { TeamComponents } from '../components/TeamComponents'
import { useParams } from 'react-router-dom';
import axiosClient from '../../axios-client';

export const Team = () => {

    const [teamName,setTeamName] = useState("");
    const [message,setMessage] = useState("");




    const [invitePopup,setInvitePopup] = useState(false);

    const params = useParams();
    useEffect(() => {
      team();
      allUsers();
      
      }, [params]);



      const team = () => {
        axiosClient.get(`/getTeam/${params.uuid}`)
        .then((res) => {
            setTeamName(res.data[0].name);
        })
        .catch((err) => {
          console.log(err);
        });
      }


      const allUsers = () =>{
        // console.log(params.uuid);
        // axiosClient.get(`/getAciveUsers/${params.uuid}`)
        //   .then((res) => {
        //     console.log(res.data.userDetail);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
        
      }



      const handleUpdate = () => {
        axiosClient.post("/updateTeamName" , {
            "uuid" : params.uuid,
            "name": teamName
        })
        .then((res) => {
            setMessage(res.data.Success);

            team();
            setTimeout(() => {
            setMessage("");

            },1500)
        })
        .catch((err) => {
          console.log(err);
        });
      }



      const handleInvite = () => {
        setInvitePopup(true)
      }

  return (
    <div>
        <TeamComponents 
            teamname = {teamName}
            setTeamName={setTeamName}
            handleUpdate={handleUpdate}
            message={message}
            handleInvite={handleInvite}
            invitePopup={invitePopup}
            setInvitePopup={setInvitePopup}
        />
    </div>
  )
}