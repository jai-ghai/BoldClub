"use client"

import { ReactNode } from "react"

interface IPhoneFrameProps {
  children: ReactNode
}

export function IPhoneFrame({ children }: IPhoneFrameProps) {
  return (
    <div className="relative mx-auto w-[375px] h-[812px] bg-[#1C1C1C] rounded-[55px] p-3 shadow-2xl">
      {/* Side buttons */}
      <div className="absolute left-[-3px] top-[120px] w-[3px] h-[30px] bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute left-[-3px] top-[170px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute left-[-3px] top-[240px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute right-[-3px] top-[170px] w-[3px] h-[80px] bg-[#2a2a2a] rounded-r-sm" />
      
      {/* Inner frame */}
      <div className="relative w-full h-full bg-white rounded-[45px] overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-[#1C1C1C] rounded-full z-50" />
        
        {/* Screen content */}
        <div className="w-full h-full overflow-hidden">
          {children}
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-[#1C1C1C] rounded-full z-50" />
      </div>
    </div>
  )
}
