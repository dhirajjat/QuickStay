import React from 'react'
import Title from './Title'
import { assets,testimonials } from '../assets/assets'

import Starrating from './Starrating'

function Testimonial() {
  return (
    <div className='items-center justify-center flex flex-col py-20 px-4 md:px-8'>
        <Title title="What our Guests Say" subtitle ="Discover why discerning travelers consistently choose QuickStay for thire exclusive and luxurious accommodations around the world"/>
       

            <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow ">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="font-playfair text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                          <Starrating/>
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
                    </div>
                ))}
            </div>
        </div>
 
   
  )
}

export default Testimonial