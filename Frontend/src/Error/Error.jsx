import React from 'react'
import { Link } from 'react-router-dom'

export default function Error() {
    return (
        <div className='text-center mt-10'>
            <div className='text-3xl'>
                404 Not Found
            </div>
            <div className='mt-5'>
               <Link to="/dashboard"><button type="button" class="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Back</button></Link>            </div>



        </div>
    )
}
