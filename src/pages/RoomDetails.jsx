import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  assets,
  facilityIcons,
  roomCommonData,
  roomsDummyData,
} from "../assets/assets";

import Starrating from "../components/Starrating";

function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  
  // Display state - controls which card is shown
  const [activeCard, setActiveCard] = useState("bookingForm"); // Options: bookingForm, billDetails, payment, confirmation
  
  // Booking state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [nightsStay, setNightsStay] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  
  // Payment state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const roomData = roomsDummyData.find((room) => room._id === id);

    if (roomData) {
      setRoom(roomData);
      setMainImage(roomData.images[0]);
    }
  }, [id]);

  // Calculate number of nights and total amount when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      
      // Calculate difference in days
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0 && room) {
        setNightsStay(diffDays);
        const baseAmount = room.pricePerNight * diffDays;
        setTotalAmount(baseAmount);
        
        // Calculate 10% GST
        const gst = baseAmount * 0.10;
        setGstAmount(gst);
        
        // Calculate grand total
        setGrandTotal(baseAmount + gst);
      } else {
        setNightsStay(0);
        setTotalAmount(0);
        setGstAmount(0);
        setGrandTotal(0);
      }
    }
  }, [checkInDate, checkOutDate, room]);

  // Function to check room availability
  const checkAvailability = (e) => {
    e.preventDefault();
    
    // Validate dates and guest count
    if (!checkInDate || !checkOutDate || guests < 1) {
      alert("Please fill in all required fields");
      return;
    }
    
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const today = new Date();
    
    // Basic validation
    if (startDate < today) {
      alert("Check-in date cannot be in the past");
      return;
    }
    
    if (endDate <= startDate) {
      alert("Check-out date must be after check-in date");
      return;
    }
    
    if (guests > (room?.maxGuests || 2)) {
      alert(`Maximum ${room?.maxGuests || 2} guests allowed for this room`);
      return;
    }
    
    // In a real app, you would check against a database of bookings
    // For demonstration, we'll simulate availability
    const isAvailable = Math.random() > 0.2; // 80% chance of availability
    
    if (isAvailable) {
      setActiveCard("billDetails");
    } else {
      alert("Sorry, this room is not available for the selected dates.");
    }
  };

  // Function to proceed to payment
  const proceedToPayment = () => {
    setActiveCard("payment");
  };

  // Function to go back to previous card
  const goBack = (targetCard) => {
    setActiveCard(targetCard);
  };

  // Function to format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Function to process payment
  const processPayment = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert("Please fill in all payment details");
        return;
      }
      
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert("Please enter a valid 16-digit card number");
        return;
      }
      
      if (cvv.length !== 3) {
        alert("Please enter a valid 3-digit CVV");
        return;
      }
    }
    
    // Simulate payment processing
    setPaymentStatus("processing");
    
    // In a real application, you would integrate with a payment gateway
    setTimeout(() => {
      setPaymentStatus("success");
      setActiveCard("confirmation");
    }, 2000);
  };

  // Function to reset booking and start over
  const bookAnother = () => {
    setCheckInDate("");
    setCheckOutDate("");
    setGuests(1);
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
    setCvv("");
    setPaymentStatus("");
    setActiveCard("bookingForm");
  };

  if (!room) {
    return <div className="py-28 px-4 text-center">Loading room details...</div>;
  }

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Room Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotel.name}{" "}
          <span className="font-inter text-sm">({room.roomType})</span>
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
          20% OFF
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-2">
        <Starrating />
        <p className="ml-2">200+ reviews</p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 mt-2 text-gray-500">
        <img src={assets.locationIcon} alt="locationIcon" />
        <span>{room.hotel.address}</span>
      </div>

      {/* Room Images */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6 items-center lg:items-start">
        <div className="w-full md:w-[90%] lg:w-1/2 mx-auto">
          <img
            src={mainImage}
            alt="roomImage"
            className="w-full h-full max-h-[400px] object-cover rounded-xl shadow-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 lg:w-1/2 w-full">
          {room?.images.length > 1 &&
            room.images.map((image, index) => (
              <img
                onClick={() => setMainImage(image)}
                key={index}
                src={image}
                alt="room images"
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                  mainImage === image ? "outline-3 outline-orange-500" : ""
                }`}
              />
            ))}
        </div>
      </div>

      {/* Room Details */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h1>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                <img
                  className="w-5 h-5"
                  src={facilityIcons[item]}
                  alt="facilityIcons"
                />
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-2xl font-medium">₹{room.pricePerNight}/night</p>
      </div>

      {/* Dynamic Card Area - Only one card is shown at a time */}
      <div className="mt-10 max-w-6xl mx-auto">
        {/* Booking Form Card */}
        {activeCard === "bookingForm" && (
          <form onSubmit={checkAvailability} className="flex flex-col md:flex-row items-start md:items-center border border-orange-500 justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl">
            <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
              <div className="flex flex-col">
                <label htmlFor="checkInDate" className="font-medium">
                  Check-In
                </label>
                <input
                  type="date"
                  id="checkInDate"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5"
                  required
                />
              </div>
              <div className="w-px h-15 bg-gray-400 max-md:hidden"></div>
              <div className="flex flex-col">
                <label htmlFor="checkOutDate" className="font-medium">
                  Check-Out
                </label>
                <input
                  type="date"
                  id="checkOutDate"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5"
                  required
                />
              </div>
              <div className="w-px h-15 bg-gray-400 max-md:hidden"></div>
              <div className="flex flex-col">
                <label htmlFor="guests" className="font-medium">
                  Guests
                </label>
                <input
                  type="number"
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  min="1"
                  max={room.maxGuests || 4}
                  className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                  required
                />
              </div>
            </div>
            <button
             
             
              className="bg-orange-500 hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-6 py-3 md:py-4 text-base cursor-pointer"

            >
              Check Availability
            </button>
          </form>
        )}

        {/* Bill Details Card */}
        {activeCard === "billDetails" && (
          <div className="bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-playfair">Booking Details</h2>
              <button
                onClick={() => goBack("bookingForm")}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dates
              </button>
            </div>
            
            <div className="space-y-4 border-b border-gray-200 pb-4">
              <div className="flex justify-between">
                <p>Room Type:</p>
                <p className="font-medium">{room.roomType}</p>
              </div>
              <div className="flex justify-between">
                <p>Check-in Date:</p>
                <p className="font-medium">{new Date(checkInDate).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between">
                <p>Check-out Date:</p>
                <p className="font-medium">{new Date(checkOutDate).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between">
                <p>Number of Guests:</p>
                <p className="font-medium">{guests}</p>
              </div>
              <div className="flex justify-between">
                <p>Number of Nights:</p>
                <p className="font-medium">{nightsStay}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <p>Room Rate (per night):</p>
                <p className="font-medium">₹{room.pricePerNight.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Subtotal ({nightsStay} nights):</p>
                <p className="font-medium">₹{totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>GST (10%):</p>
                <p className="font-medium">₹{gstAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                <p>Grand Total:</p>
                <p>₹{grandTotal.toFixed(2)}</p>
              </div>
            </div>
            
            <button
              onClick={proceedToPayment}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md py-3 text-base font-medium cursor-pointer"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Payment Card */}
        {activeCard === "payment" && (
          <div className="bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-playfair">Payment</h2>
              <button
                onClick={() => goBack("billDetails")}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Booking Details
              </button>
            </div>
            
            <form onSubmit={processPayment}>
              <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="cardPayment" 
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mr-2"
                    />
                    <label htmlFor="cardPayment">Credit/Debit Card</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="upiPayment" 
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="mr-2"
                    />
                    <label htmlFor="upiPayment">UPI</label>
                  </div>
                </div>

                {paymentMethod === "card" ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block mb-1 text-gray-700">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cardName" className="block mb-1 text-gray-700">Cardholder Name</label>
                      <input
                        type="text"
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="w-1/2">
                        <label htmlFor="expiryDate" className="block mb-1 text-gray-700">Expiry Date</label>
                        <input
                          type="text"
                          id="expiryDate"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <label htmlFor="cvv" className="block mb-1 text-gray-700">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength="3"
                          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="upiId" className="block mb-1 text-gray-700">UPI ID</label>
                    <input
                      type="text"
                      id="upiId"
                      placeholder="yourname@upi"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Payment Summary</h3>
                <div className="flex justify-between mb-2">
                  <p>Room Charges ({nightsStay} nights):</p>
                  <p>₹{totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>GST (10%):</p>
                  <p>₹{gstAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-medium">
                  <p>Total Amount:</p>
                  <p>₹{grandTotal.toFixed(2)}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={paymentStatus === "processing"}
                className={`w-full bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md py-3 text-base font-medium cursor-pointer ${
                  paymentStatus === "processing" ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {paymentStatus === "processing" ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </span>
                ) : (
                  "Pay Now"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Confirmation Card */}
        {activeCard === "confirmation" && (
          <div className="bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">Your booking has been confirmed.</p>
              <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto text-left">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <p><span className="text-gray-600">Room:</span> {room.roomType}</p>
                <p><span className="text-gray-600">Check-in:</span> {new Date(checkInDate).toLocaleDateString()}</p>
                <p><span className="text-gray-600">Check-out:</span> {new Date(checkOutDate).toLocaleDateString()}</p>
                <p><span className="text-gray-600">Guests:</span> {guests}</p>
                <p><span className="text-gray-600">Amount Paid:</span> ₹{grandTotal.toFixed(2)}</p>
              </div>
              <p className="mt-6 text-sm text-gray-500">A confirmation email has been sent to your registered email address.</p>
              
              <button
                onClick={bookAnother}
                className="mt-6 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md px-6 py-2 text-base font-medium cursor-pointer"
              >
                Book Another Room
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Room Features */}
      <div className="mt-16 space-y-4">
        {roomCommonData && Array.isArray(roomCommonData) && roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <img
              src={spec.icon}
              alt={`${spec.title}-icon`}
              className="w-6 h-6"
            />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Room Description */}
      <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
        <p>
          Guests will be allocated on the ground floor according to
          availability. You get a comfortable Two bedroom apartment has a true
          city feeling. The price quoted is for two guests; at the guest slot,
          please mark the number of guests to get the exact price for groups.
          The Guests will be allocated ground floor according to availability.
          You get the comfortable two bedroom apartment that has a true city
          feeling.
        </p>
      </div>

      {/* Host Information */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <img src={room.hotel.owner.image} alt="Host" className="h-14 w-14 md:h-18 md:w-18 rounded-full" />
          <div>
            <p>Hosted by {room.hotel.name}</p>
            <div className="flex items-center mt-1">
              <Starrating />
              <p className="ml-2">200+ reviews</p>
            </div>
          </div>
        </div>
        <div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-orange-400 hover:bg-gray-800 transition-all cursor-pointer">Contact Now</button>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;