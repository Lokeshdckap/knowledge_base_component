import React from 'react'
import mainLogo from "../../assets/images/mainlogo.png"
import Dashboard from '../../Dashboard/container/Dashboard'


export default function SideNav(props) {

    return (
        <div className='bg-primary h-screen w-[90px]'>

            <div>
                <img src={mainLogo} alt="" srcset="" className='m-5' />
            </div>
            <div className='bg-slate-300 h-6 w-6 rounded-full ml-[78px] mt-2'>
                <span class="material-symbols-outlined cursor-pointer" onClick={props.buttonClicked}>
                    chevron_right
                </span>
            </div>
            <div className='bg-gray-300 h-12 w-14 rounded-sm ml-3 mt-7'>
                <p className='text-2xl font-bold p-2'>DC</p>

            </div>

            <div className='space-y-5  mt-60 ml-7'>
                <div className='bg-white h-8 w-8 rounded-full' >
                    <span class="material-symbols-outlined font-bold text-textPrimary p-1">
                        add
                    </span>
                </div>
                <div>
                    <span class="material-symbols-outlined text-white" >
                        notifications
                    </span>
                </div>
                <div>
                    <span class="material-symbols-outlined text-white">
                        delete
                    </span>
                </div>
                <div>
                    <span class="material-symbols-outlined text-white">
                        Settings
                    </span>
                </div>
            </div>
        </div>


    )





}
