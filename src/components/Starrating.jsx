import React from 'react'
import { assets } from '../assets/assets';

function Starrating({rating = 4}) {
   
  return (
    <div className='flex'>
          {Array(5).fill('').map((_, index) => (
                               <img src={rating > index ? assets.starIconFilled : assets.starIconOutlined} className='w-4.5  h-4.5' alt="star-icon" />
                            ))}
    </div>
  )
}

export default Starrating