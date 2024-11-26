import React from 'react'
import { VscEmptyWindow } from "react-icons/vsc";

const EmptyMessage = () => {
    return (
        <div className='m-auto rounded-lg overflow-auto'>
            <VscEmptyWindow className='w-80 h-80 m-auto text-gray-400' />
            <h1 className='text-gray-400 text-center'>Message</h1>
        </div>
    )
}

export default EmptyMessage;
