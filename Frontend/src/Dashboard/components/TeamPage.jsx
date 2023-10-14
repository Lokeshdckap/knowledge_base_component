import React from 'react'
import Input from '../../common/commonComponents/Input'

export default function TeamPage() {
    return (
        <div>
            {/* <div className='bg-secondary h-[664px] w-screen '> */}
            <div className="bg-white h-[550px] w-[550px] mt-12 ml-[360px] drop-shadow-lg rounded">
                <div className="bg-primary h-5 rounded-t-lg"></div>
                <div className='mt-24'>
                    <h1 className='text-center text-3xl '>Create New Team</h1>
                    <input type="text" name="teamname" id="teamname" class="block w-96 ml-20 rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-900-600 sm:text-sm sm:leading-6  mt-10" placeholder="Team name" />
                    <button class="bg-primary ml-48 mt-10  hover:bg-blue-950 text-white font-bold py-3 px-10 rounded">
                        Create team
                    </button>
                </div>
            </div>

            {/* </div> */}


        </div>
    )
}
