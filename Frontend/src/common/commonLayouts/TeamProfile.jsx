import React from 'react'

export const TeamProfile = (props) => {
  return (

        <div className="bg-white w-[900px] h-[550px]  shadow-md mt-5">
            <div className="w-[800px] m-auto">
              <p className="text-2xl font-bold text-textPrimary pt-10">
                Team Profile
              </p>
              <div className="mt-3">
                <label className="">Team Name</label>
                <div>
                  <input
                    type="text"
                    value={props.teamname && props.teamname}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[500px] pl-2 p-2.5 focus:outline-primary mt-2"
                    placeholder="Team Name"
                    onChange={(e)=> props.setTeamName(e.target.value)}
                    required
                  />
                </div>
                <p className="text-green-700 pt-1">{props.message}</p>
              </div>
              <button className="bg-primary mt-5 h-12 w-48 text-white rounded text-center" onClick={props.handleUpdate}>
                update
              </button>
            </div>
          </div>
 
  )
}
