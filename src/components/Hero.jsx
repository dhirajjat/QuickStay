// import React from "react";
// import { assets, cities } from "../assets/assets";

// function Hero() {
//   return (
//     <div className='flex  flex-col text-white items-start justify-center  px-6 md:px-16 lg:px-24 xl:px-32 bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
//       <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">
//         The Ultimate Hotel Experience{" "}
//       </p>
//       <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
//         Discover Your Perfect Gateway Destination
//       </h1>
//       <p className="max-w-130 mt-2 text-sm md:text-base">
//         Unparalleled luxury and comfort await at the world's most exclusive
//         hotels and resorts . Start your journey today.
//       </p>
//       <form className="bg-[#49B9FF]/50 text-white rounded-lg px-6 py-4 mt-8  flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto">
//         <div>
//           <div className="flex items-center  gap-2">
//             <img src={assets.calenderIcon} alt="" className="h-4 " />
//             <label htmlFor="destinationInput">Destination</label>
//           </div>
//           <input
//             list="destinations"
//             id="destinationInput"
//             type="text"
//             className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
//             placeholder="Type here"
//             required
//           />
//           <datalist id="destinations">
//             {cities.map((city, index) => (
//               <option value={city} key={index} />
//             ))}
//           </datalist>
//         </div>

//         <div>
//           <div className="flex items-center gap-2">
//             <img src={assets.calenderIcon} alt="" className="h-4" />
//             <label htmlFor="checkIn">Check in</label>
//           </div>
//           <input
//             id="checkIn"
//             type="date"
//             className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
//           />
//         </div>

//         <div>
//           <div className="flex items-center gap-2">
//             <img src={assets.calenderIcon} alt="" className="h-4" />
//             <label htmlFor="checkOut">Check out</label>
//           </div>
//           <input
//             id="checkOut"
//             type="date"
//             className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
//           />
//         </div>

//         <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
//           <label htmlFor="guests">Guests</label>
//           <input
//             min={1}
//             max={4}
//             id="guests"
//             type="number"
//             className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16"
//             placeholder="0"
//           />
//         </div>

//         <button className="flex items-center justify-center gap-1 hover:shadow-lg shadow-gray-800 hover:-translate-y-0.5 duration-500 rounded-full bg-gray-800 py-2  px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1">
//           <img src={assets.searchIcon} alt="" className="h-7" />
//           <span>Search</span>
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Hero;
import React, { useState } from "react";
import { assets, cities, roomsDummyData, facilityIcons } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import heroImage from '/src/assets/heroImage.png';


// Mock assets for icons
const asset = {
  calenderIcon: "/api/placeholder/24/24",
  searchIcon: "/api/placeholder/24/24",
  locationIcon: "/api/placeholder/24/24",
  personIcon: "/api/placeholder/24/24"
};

const HeroSearch = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Filter rooms based on destination and guests
    let filtered = roomsDummyData;
    
    // Filter by destination if selected
    if (destination) {
      filtered = filtered.filter(room => 
        room.hotel.city.toLowerCase() === destination.toLowerCase()
      );
    }
    
    // For demo purposes, we'll assume each room can accommodate at least the requested number of guests
    // In a real application, you would have a capacity field on each room
    setFilteredRooms(filtered);
    setShowResults(true);
    
    // Optionally redirect to the AllRooms page instead
    // navigate('/rooms', { state: { filteredRooms: filtered, searchParams: { destination, checkIn, checkOut, guests } } });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col text-white items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32  bg-cover bg-center h-screen " style={{ backgroundImage: `url(${heroImage})` }}>
        <p className="bg-blue-400/50 px-3.5 py-1 rounded-full mt-20">
          The Ultimate Hotel Experience
        </p>
        <h1 className="text-2xl md:text-5xl font-bold md:font-extrabold max-w-xl mt-4">
          Discover Your Perfect Gateway Destination
        </h1>
        <p className="max-w-xl mt-2 text-sm md:text-base">
          Unparalleled luxury and comfort await at the world's most exclusive
          hotels and resorts. Start your journey today.
        </p>

        <div className="bg-blue-400/50 text-white rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto w-full max-w-sm">
          <div>
            <div className="flex items-center gap-2">
              <img src={asset.locationIcon} alt="" className="h-4" />
              <label htmlFor="destinationInput">Destination</label>
            </div>
            <input
              list="destinations"
              id="destinationInput"
              type="text"
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-gray-800"
              placeholder="Type here"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <datalist id="destinations">
              {cities.map((city, index) => (
                <option value={city} key={index} />
              ))}
            </datalist>
          </div>

          {/* <div>
            <div className="flex items-center gap-2">
              <img src={asset.calenderIcon} alt="" className="h-4" />
              <label htmlFor="checkIn">Check in</label>
            </div>
            <input
              id="checkIn"
              type="date"
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-gray-800"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div> */}

          {/* <div>
            <div className="flex items-center gap-2">
              <img src={asset.calenderIcon} alt="" className="h-4" />
              <label htmlFor="checkOut">Check out</label>
            </div>
            <input
              id="checkOut"
              type="date"
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-gray-800"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div> */}

          {/* <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
            <div className="flex items-center gap-2">
              <img src={asset.personIcon} alt="" className="h-4" />
              <label htmlFor="guests">Guests</label>
            </div>
            <input
              min={1}
              max={4}
              id="guests"
              type="number"
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-gray-800 max-w-16"
              placeholder="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            />
          </div> */}

          <button 
            onClick={handleSearch}
            className="flex items-center justify-center gap-1 hover:shadow-lg shadow-gray-800 hover:-translate-y-0.5 duration-500 rounded-full bg-gray-800 py-2 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1"
          >
            <img src={asset.searchIcon} alt="" className="h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="px-6 md:px-16  lg:px-24 xl:px-32 py-10">
          <div className="bg-white border border-orange-200 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Search Results</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {destination &&  (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {destination}
                </span>
              )}
              {checkIn && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Check-in: {checkIn}
                </span>
              )}
              {checkOut && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Check-out: {checkOut}
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {guests} {guests === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>

            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map(room => (
                  <div key={room._id} className="border border-orange-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={room.images[0]} 
                      alt="Room" 
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => {
                        navigate(`/rooms/${room._id}`);
                        window.scrollTo(0, 0);
                      }}
                    />
                    <div className="p-4">
                      <p className="text-gray-500 text-sm">{room.hotel.city}</p>
                      <h3 
                        className="font-bold text-lg cursor-pointer"
                        onClick={() => {
                          navigate(`/rooms/${room._id}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {room.hotel.name} - {room.roomType}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2 my-3">
                        {room.amenities.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50"
                          >
                            <img
                              src={facilityIcons[item]}
                              alt={item}
                              className="w-4 h-4"
                            />
                            <p className="text-xs">{item}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-orange-600 font-bold">₹{room.pricePerNight} / night</span>
                        <button 
                          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700"
                          onClick={() => {
                            navigate(`/rooms/${room._id}`);
                            window.scrollTo(0, 0);
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No rooms available for your criteria. Try adjusting your search.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSearch;
