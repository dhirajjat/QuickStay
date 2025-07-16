import React from "react";
import HotelCard from "./HotelCard";
import { roomsDummyData } from "../assets/assets";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
function FeatureDestination() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center  px-6 md:px-16 lg:px-40 bg-slate-50 py-20">
      <Title
        title="Featured Destination "
        subtitle="Discover our handpicked selection of excrptional properties around the world, offring unparalleled luxury and inforgettable experiences."
      />
      <div className="flex flex-wrap justify-center items-center  gap-6 mt-12">
        {roomsDummyData.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <button
          onClick={() => {
            navigate("/rooms");
            scroll(0, 0);
          }}
          className="flex items-center justify-center gap-1 hover:shadow-lg shadow-gray-800 hover:-translate-y-0.5 duration-500 rounded-full bg-gray-800 py-2  px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1"
        >
          View All Destination
        </button>
      </div>
    </div>
  );
}

export default FeatureDestination;
