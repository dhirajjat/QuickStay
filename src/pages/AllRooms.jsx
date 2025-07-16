import React, { useState } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Starrating from "../components/Starrating";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex items-center gap-3 mt-2 cursor-pointer text-sm">
      <input 
        type="checkbox" 
        checked={selected} 
        onChange={(e) => onChange(e.target.checked, label)}
        className="cursor-pointer" 
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex items-center gap-3 mt-2 cursor-pointer text-sm">
      <input 
        type="radio" 
        checked={selected} 
        onChange={() => onChange(label)}
        name="sortOption"
        className="cursor-pointer"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

function AllRooms() {
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  
  // State for selected filters
  const [selectedRoomTypes, setSelectedRoomTypes] = useState({});
  const [selectedPriceRanges, setSelectedPriceRanges] = useState({});
  const [selectedSortOption, setSelectedSortOption] = useState("");
  
  // Filter options
  const roomTypes = [
    "Single Bed",
    "Double Bed",
    "Luxury Suite",
    "Family Suite",
  ];

  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];
  
  // Handle room type checkbox change
  const handleRoomTypeChange = (checked, label) => {
    setSelectedRoomTypes(prev => ({
      ...prev,
      [label]: checked
    }));
  };
  
  // Handle price range checkbox change
  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges(prev => ({
      ...prev,
      [label]: checked
    }));
  };
  
  // Handle sort option radio button change
  const handleSortOptionChange = (label) => {
    setSelectedSortOption(label);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedRoomTypes({});
    setSelectedPriceRanges({});
    setSelectedSortOption("");
  };

  // Filter rooms based on selected filters
  const filteredRooms = roomsDummyData.filter(room => {
    // If no room types are selected, return all rooms
    const roomTypeSelected = Object.values(selectedRoomTypes).some(value => value);
    
    // If no price ranges are selected, return all rooms
    const priceRangeSelected = Object.values(selectedPriceRanges).some(value => value);
    
    // Room type filter
    const passesRoomTypeFilter = !roomTypeSelected || 
      (room.type && selectedRoomTypes[room.type]);
    
    // Price filter
    const passesPriceFilter = !priceRangeSelected || 
      Object.entries(selectedPriceRanges).some(([range, isSelected]) => {
        if (!isSelected) return false;
        
        const [min, max] = range.split(" to ").map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      });
    
    return passesRoomTypeFilter && passesPriceFilter;
  });
  
  // Sort rooms based on selected sort option
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (selectedSortOption === "Price Low to High") {
      return a.pricePerNight - b.pricePerNight;
    } else if (selectedSortOption === "Price High to Low") {
      return b.pricePerNight - a.pricePerNight;
    } else if (selectedSortOption === "Newest First") {
      // Assuming newer rooms have higher IDs, adjust as needed
      return b._id - a._id;
    }
    return 0;
  });

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-palyfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        {sortedRooms.length > 0 ? (
          sortedRooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
            >
              <img
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  window.scrollTo(0, 0);
                }}
                src={room.images[0]}
                alt="roomImages"
                title="View Room Details"
                className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{room.hotel.city}</p>
                <p
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="text-gray-800 text-3xl font-palyfair cursor-pointer"
                >
                  {room.hotel.name}
                </p>
                <div className="flex items-center">
                  <Starrating />
                  <p className="ml-2">200+ reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="locationIcon" />
                  <span>{room.hotel.address}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-6 mt-3">
                  {room.amenities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5ff]/70"
                    >
                      <img
                        src={facilityIcons[item]}
                        alt={item}
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xl font-medium text-gray-700">
                ₹{room.pricePerNight} /night
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No rooms match your selected filters.</p>
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white w-full lg:w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16 lg:ml-8">
        <div className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${openFilter ? 'border-b' : ''}`}>
          <p>FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span 
              onClick={() => setOpenFilter(!openFilter)}
              className="lg:hidden"
            >
              {openFilter ? 'HIDE' : 'SHOW'}
            </span>
            <span 
              className="hidden lg:block" 
              onClick={clearFilters}
            >
              CLEAR
            </span>
          </div>
        </div>
        
        <div className={`${openFilter ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Room Type</p>
            {roomTypes.map((roomType, index) => (
              <CheckBox 
                key={index} 
                label={roomType} 
                selected={!!selectedRoomTypes[roomType]}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>
          
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox 
                key={index} 
                label={range} 
                selected={!!selectedPriceRanges[range]}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>
          
          <div className="px-5 pt-5 pb-5">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton 
                key={index} 
                label={option} 
                selected={selectedSortOption === option}
                onChange={handleSortOptionChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllRooms;