import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { roomsDummyData } from "../assets/assets";

function BillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Room data state
  const [room, setRoom] = useState(null);
  
  // Booking details from location state or default values
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: location.state?.checkInDate || "",
    checkOutDate: location.state?.checkOutDate || "",
    guests: location.state?.guests || 1,
    nightsStay: 0,
    totalAmount: 0,
    gstAmount: 0,
    grandTotal: 0
  });

  // Load room data when component mounts
  useEffect(() => {
    const roomData = roomsDummyData.find((room) => room._id === id);
    if (roomData) {
      setRoom(roomData);
    } else {
      // If no room found with the ID, navigate back to rooms list
      navigate("/rooms");
    }
  }, [id, navigate]);

  // Calculate bill details when room data or dates change
  useEffect(() => {
    if (room && bookingDetails.checkInDate && bookingDetails.checkOutDate) {
      const startDate = new Date(bookingDetails.checkInDate);
      const endDate = new Date(bookingDetails.checkOutDate);
      
      // Calculate difference in days
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        const baseAmount = room.pricePerNight * diffDays;
        const gst = baseAmount * 0.10; // 10% GST
        
        setBookingDetails(prev => ({
          ...prev,
          nightsStay: diffDays,
          totalAmount: baseAmount,
          gstAmount: gst,
          grandTotal: baseAmount + gst
        }));
      }
    }
  }, [room, bookingDetails.checkInDate, bookingDetails.checkOutDate]);

  // Function to go back to room details
  const goBackToRoom = () => {
    navigate(`/rooms/${id}`);
  };

  // Function to proceed to payment
  const proceedToPayment = () => {
    navigate(`/payment/${id}`, { 
      state: { 
        ...bookingDetails,
        roomType: room?.roomType,
        pricePerNight: room?.pricePerNight 
      } 
    });
  };

  // Show loading state while room data is being fetched
  if (!room) {
    return (
      <div className="py-28 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading bill details...</p>
      </div>
    );
  }

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-playfair">Booking Details</h1>
        <button
          onClick={goBackToRoom}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Room
        </button>
      </div>

      {/* Room Summary */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <img
            src={room.images[0]}
            alt={room.roomType}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-2/3">
          <h2 className="text-2xl font-medium mb-2">{room.roomType}</h2>
          <p className="text-gray-600 mb-2">{room.hotel.name}</p>
          <p className="text-gray-600 mb-2">{room.hotel.address}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {room.amenities.slice(0, 4).map((amenity, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bill Details Card */}
      <div className="bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-playfair">Bill Details</h2>
        </div>
        
        <div className="space-y-4 border-b border-gray-200 pb-4">
          <div className="flex justify-between">
            <p>Room Type:</p>
            <p className="font-medium">{room.roomType}</p>
          </div>
          <div className="flex justify-between">
            <p>Check-in Date:</p>
            <p className="font-medium">
              {bookingDetails.checkInDate 
                ? new Date(bookingDetails.checkInDate).toLocaleDateString() 
                : "Not selected"}
            </p>
          </div>
          <div className="flex justify-between">
            <p>Check-out Date:</p>
            <p className="font-medium">
              {bookingDetails.checkOutDate 
                ? new Date(bookingDetails.checkOutDate).toLocaleDateString() 
                : "Not selected"}
            </p>
          </div>
          <div className="flex justify-between">
            <p>Number of Guests:</p>
            <p className="font-medium">{bookingDetails.guests}</p>
          </div>
          <div className="flex justify-between">
            <p>Number of Nights:</p>
            <p className="font-medium">{bookingDetails.nightsStay}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex justify-between">
            <p>Room Rate (per night):</p>
            <p className="font-medium">${room.pricePerNight.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Subtotal ({bookingDetails.nightsStay} nights):</p>
            <p className="font-medium">${bookingDetails.totalAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>GST (10%):</p>
            <p className="font-medium">${bookingDetails.gstAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
            <p>Grand Total:</p>
            <p>₹
            {bookingDetails.grandTotal.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Missing dates warning */}
        {(!bookingDetails.checkInDate || !bookingDetails.checkOutDate) && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 mt-4 rounded-lg">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Please select check-in and check-out dates to calculate accurate billing.
            </p>
          </div>
        )}
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={goBackToRoom}
            className="w-1/2 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all"
          >
            Edit Booking
          </button>
          <button
            onClick={proceedToPayment}
            disabled={!bookingDetails.checkInDate || !bookingDetails.checkOutDate}
            className={`w-1/2 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md py-3 text-base font-medium ${
              (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) 
                ? "opacity-50 cursor-not-allowed" 
                : "cursor-pointer"
            }`}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium mb-4">Booking Information</h3>
        <div className="space-y-4 text-gray-600">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Check-in time starts at 2 PM. Check-out time is 12 PM.</p>
          </div>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Free cancellation up to 48 hours before check-in. Cancellations made less than 48 hours in advance may be subject to charges.</p>
          </div>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p>A security deposit may be required upon arrival, which will be fully refunded at check-out, subject to damage inspection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillDetails;