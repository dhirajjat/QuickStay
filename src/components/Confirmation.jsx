import React from "react";
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
        const gst = baseAmount * 0.1;
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
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Function to process payment
  const processPayment = (e) => {
    e.preventDefault();

    // Basic validation
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert("Please fill in all payment details");
        return;
      }

      if (cardNumber.replace(/\s/g, "").length !== 16) {
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
    return (
      <div className="py-28 px-4 text-center">Loading room details...</div>
    );
  }
}

function Confirmation() {
  return (
    <div className='mt-10 max-w-6xl mx-auto"'>
      {activeCard === "confirmation" && (
        <div className="bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-green-600 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto text-left">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <p>
                <span className="text-gray-600">Room:</span> {room.roomType}
              </p>
              <p>
                <span className="text-gray-600">Check-in:</span>{" "}
                {new Date(checkInDate).toLocaleDateString()}
              </p>
              <p>
                <span className="text-gray-600">Check-out:</span>{" "}
                {new Date(checkOutDate).toLocaleDateString()}
              </p>
              <p>
                <span className="text-gray-600">Guests:</span> {guests}
              </p>
              <p>
                <span className="text-gray-600">Amount Paid:</span> ₹
                {grandTotal.toFixed(2)}
              </p>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              A confirmation email has been sent to your registered email
              address.
            </p>

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
  );
}

export default Confirmation;
