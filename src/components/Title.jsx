import React from 'react'

function Title( {title , subtitle ,align ,font}) {
  return (
    <div className='{`flex flex-col  justify-center items-center  ${align =="left" && "md:items-start md:text-left"} `}'>
        <h1 className={`text-4xl md:text-[40px ] ${font || "font-playfair"}`}>{title}</h1>
        <span className='text-sm md:text-base  content-center  text-gray-500/90 mt-2  max-w-174'>{subtitle}</span>
    </div>
  )
}

export default Title