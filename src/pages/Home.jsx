import React from 'react'
import Hero from '../components/Hero'
import FeatureDestination from '../components/FeatureDestination'
import ExlusiveOffers from '../components/ExlusiveOffers'
import Testimonial from '../components/Testimonial'
import NewsLatter from '../components/NewsLatter'

function Home() {
  return (
    <div>
        <Hero/>
        <FeatureDestination/>
        <ExlusiveOffers/>
        <Testimonial/>
        <NewsLatter/>
    </div>
  )
}

export default Home