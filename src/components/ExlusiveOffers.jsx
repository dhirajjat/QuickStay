import React from 'react';
import Title from './Title';
import { assets, exclusiveOffers } from '../assets/assets';

function ExlusiveOffers() {
  return (
    <div className=' flex-col px-6 md:px-16 lg:px-24 bg-slate-50 pb-30 pt-20 xl:px-32'>
      <div className='flex items-start content-start justify-between w-full'>
        <Title 
          align="left"
          title='Exclusive Offers'
          
          subtitle='Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.'
        />
        <button className='flex group items-center gap-2 font-medium cursor-pointer max-md:mt-12'>
          View All Offers
          <img src={assets.arrowIcon} alt="arrow-icon" className='group-hover:translate-x-1 transition-all' />
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className=' flex flex-col  group relative items-start justify-between pt-12 md:pt-28 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center'
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <p className='px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full'>
              {item.priceOff}% OFF
            </p>

            <div className=' '>
              <p className='text-2xl font-medium font-playfair'>{item.title}</p>
              <p className='mt-2'>{item.description}</p>
              <p className='mt-3 text-white/70 text-xs'> Expires {item.expiryDate}</p>
            </div>
            <button className='flex items-center gap2- font-medium cursor-pointer mt-4 mb-5'>
              View Offers
              <img  className="invert group-hover:translate-x-1 transition-all" src={assets.arrowIcon} alt="" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExlusiveOffers;
