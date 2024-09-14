import React from 'react'
import { FaAdjust } from 'react-icons/fa';

export default function ModeBall() {
    const mode=()=>{
        document.documentElement.classList.toggle("dark");
    }
  return (
 <>
   <div onClick={mode} className="float modeball text-[20px] flex items-center justify-center z-10">
        <FaAdjust />
      </div>
 </>
  )
}
