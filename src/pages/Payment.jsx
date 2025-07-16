import React, { useState } from 'react';
import { CreditCard, CheckCircle, PlusCircle, ChevronsUpDown } from 'lucide-react';

const Payment = () => {
  // Sample cards - in a real app, these would come from an API or context
  const [cards, setCards] = useState([
    {
      id: 1, 
      cardNumber: '•••• •••• •••• 4242',
      cardHolder: 'Dhiraj Jat',
      expiryDate: '12/25',
      cardType: 'visa'
    },
    {
      id: 2, 
      cardNumber: '•••• •••• •••• 5555',
      cardHolder: 'Narendra Modi',
      expiryDate: '09/26',
      cardType: 'mastercard'
    }
  ]);
  
  // State to track the active/selected card
  const [activeCardId, setActiveCardId] = useState(1);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Handle selecting a card
  const handleCardSelect = (cardId) => {
    setActiveCardId(cardId);
  };

  // Handle showing/hiding add card form
  const toggleAddCardForm = () => {
    setShowAddCard(!showAddCard);
  };

  // Handle input changes for new card
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({
      ...newCard,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new card object with masked number
    const displayNumber = '•••• •••• •••• ' + newCard.cardNumber.slice(-4);
    
    const newCardObject = {
      id: cards.length + 1,
      cardNumber: displayNumber,
      cardHolder: newCard.cardHolder,
      expiryDate: newCard.expiryDate,
      cardType: 'visa' // In a real app, detect the card type
    };
    
    // Add new card to the array
    setCards([...cards, newCardObject]);
    
    // Select the new card
    setActiveCardId(newCardObject.id);
    
    // Reset form and hide it
    setNewCard({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    });
    setShowAddCard(false);
  };

  // Get card type icon/logo
  const getCardTypeClass = (type) => {
    switch (type) {
      case 'visa':
        return 'bg-blue-600 text-white';
      case 'mastercard':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="w-full lg:mt-20 max-w-md mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
      
      {/* Saved Cards */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700">Saved Cards</h3>
          <button 
            onClick={toggleAddCardForm}
            className="flex items-center text-orange-700 hover:text-gray-800"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            <span>Add New Card</span>
          </button>
        </div>
        
        {cards.map(card => (
          <div 
            key={card.id}
            className={` border  rounded-lg p-4 cursor-pointer transition-all ${
              card.id === activeCardId 
                ? 'border-blue-500 bg-blue-50 shadow-sm' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleCardSelect(card.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-md ${getCardTypeClass(card.cardType)}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">{card.cardNumber}</p>
                  <p className="text-sm text-gray-500">{card.cardHolder} • Expires {card.expiryDate}</p>
                </div>
              </div>
              
              {card.id === activeCardId && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Card Form */}
      {showAddCard && (
        <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Add New Card</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={newCard.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">Card Holder</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={newCard.cardHolder}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={newCard.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={newCard.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={toggleAddCardForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Card
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Payment Summary/Button */}
      <div className="mt-6">
        <button
          className="w-full bg-blue-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-500 transition-colors"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;