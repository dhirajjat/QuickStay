import React from 'react'
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  }}


function BookingForm() {
  return (
    <div>  {activeCard === "bookingForm" && (
        <form onSubmit={checkAvailability} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl">
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
            type="submit"
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-6 py-3 md:py-4 text-base cursor-pointer"
            
          >
            Check Availability
          </button>
        </form>
      )}</div>
  )
}

export default BookingForm