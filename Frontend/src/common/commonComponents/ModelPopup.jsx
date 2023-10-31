import React from 'react'
import { PopupInput } from './PopupInput'
import { PopupButton } from './PopupButton'

export const ModelPopup = (props) => {

    
  return (
    <div>
        <div className="bg-primary opacity-[0.5] w-[1289px] h-[664px] absolute top-0 left-0  z-10"></div>
        <div className=" absolute left-0 top-0 z-30">
          <div className="bg-white h-[350px] w-[600px] ml-[350px] mt-[140px] rounded -z-10" >
            <div className="">
              <i className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer mr-5" onClick={props.click}></i>
            </div>
            <div className="w-[480px] m-auto">
              <div className="flex pt-16 items-center space-x-2">
                <i class="fa-solid fa-user-plus text-2xl " ></i>
                <p className="text-2xl text-textPrimary">Create Team</p>
              </div>
              <p className="pt-3">
                Teamwork makes what's impossible to do alone possible.
              </p>
              <div>
                <PopupInput lableName={"Team Name"} HandleChange={props.HandleChange} columnName={props.columnName}/>
                        {!props.error.team_name ? (
                    <div>
                        <p className="invisible">Required</p>
                    </div>
                    ) : (
                    <div>
                        <p className="text-red-500">{props.error.team_name}</p>
                    </div>
                    )}
              </div>
              <div>
                <PopupButton width="100px" createTeam={props.createTeam}/>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}