import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { roomsDummyData } from "../assets/assets";

function BillingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [nightsStay, setNightsStay] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Get booking details from navigation state
  const bookingDetails = location.state || {};

  useEffect(() => {
    // If no booking details, redirect back to room page
    if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
      navigate(`/rooms/${id}`);
      return;
    }

    // Find room data
    const roomData = roomsDummyData.find((room) => room._id === id);
    if (roomData) {
      setRoom(roomData);
    } else {
      navigate("/rooms");
      return;
    }

    // Calculate bill details
    if (bookingDetails.checkInDate && bookingDetails.checkOutDate && roomData) {
      const startDate = new Date(bookingDetails.checkInDate);
      const endDate = new Date(bookingDetails.checkOutDate);
      
      // Calculate difference in days
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setNightsStay(diffDays);
        const baseAmount = roomData.pricePerNight * diffDays;
        setTotalAmount(baseAmount);
        
        // Calculate 10% GST
        const gst = baseAmount * 0.10;
        setGstAmount(gst);
        
        // Calculate grand total
        setGrandTotal(baseAmount + gst);
      }
    }
  }, [id, bookingDetails, navigate]);

  // Function to proceed to payment
  const proceedToPayment = () => {
    navigate(`/booking/${id}/payment`, {
      state: {
        ...bookingDetails,
        nightsStay,
        totalAmount,
        gstAmount,
        grandTotal
      }
    });
  };

  if (!room) {
    return <div className="py-28 px-4 text-center">Loading billing details...</div>;
  }

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair">Booking Summary</h1>
          <button 
            onClick={() => navigate(`/rooms/${id}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            Edit Booking
          </button>
        </div>

        <div className="bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/3">
              <img 
                src={room.images[0]} 
                alt={room.roomType}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-playfair mb-2">{room.hotel.name}</h2>
              <p className="text-lg font-medium text-gray-800 mb-1">{room.roomType}</p>
              <div className="flex items-center gap-1 text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{room.hotel.address}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">{new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">{new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium">{bookingDetails.guests}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xl font-medium mb-4">Price Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <p>Room Rate (per night)</p>
                <p className="font-medium">${room.pricePerNight.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Duration</p>
                <p className="font-medium">{nightsStay} {nightsStay === 1 ? 'night' : 'nights'}</p>
              </div>
              <div className="flex justify-between">
                <p>Room Total</p>
                <p className="font-medium">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>GST (10%)</p>
                <p className="font-medium">${gstAmount.toFixed(2)}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <p>Total Amount (Including GST)</p>
                  <p>₹
                  {grandTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={proceedToPayment}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md py-4 text-lg font-medium cursor-pointer"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>By proceeding, you agree to the terms and conditions, cancellation policy, and house rules.</p>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
