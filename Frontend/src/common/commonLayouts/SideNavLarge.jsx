import React from 'react'
import mainLogo from "../../assets/images/mainlogo.png"


export default function SideNavLarge(props) {

    return (
        <div className='bg-primary h-[664px] w-[280px]'>

            <div>
                <img src={mainLogo} alt="" srcset="" className='max-w-md m-auto mt-4' />
            </div>
            <div className='bg-slate-300 h-6 w-6 rounded-full absolute mt-4 left-[217px]'>
                <span class="material-symbols-outlined cursor-pointer" onClick={props.buttonClicked}>
                    chevron_left
                </span>
            </div>
            <div className='mt-8 flex items-center ml-3'>
                <span class="material-symbols-outlined text-white">
                    group
                </span>
                <p className='text-xl font-bold p-2 text-white'>Dckap Tea.</p>
                <span class="material-symbols-outlined text-white">
                    expand_more
                </span>
            </div>
            <div className=' ml-[27px] space-y-4 mt-72'>
                <div className='border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer '>
                    <p className='text-base text-white pt-1 pl-5 ' ><i class="fa-regular fa-plus"></i> Add</p>
                </div>
                <div className='border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer '>
                    <p className='text-base text-white pt-1 pl-5 ' ><i class="fa-regular fa-bell"></i> Notifications</p>
                </div>
                <div className='border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer '>
                    <p className='text-base text-white pt-1 pl-5 ' ><i class="fa-solid fa-trash"></i> Trash</p>
                </div>
                <div className='border-gray-400	 h-[35px] w-[170px] border-[1px] rounded cursor-pointer '>
                    <p className='text-base text-white pt-1 pl-5 ' ><i class="fa-solid fa-gear"></i>Settings</p>
                </div>               
            </div>
        </div>
    )
}
