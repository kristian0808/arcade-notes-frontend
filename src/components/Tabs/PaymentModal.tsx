import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { Tab } from '../../types/Tab';

interface PaymentModalProps {
  tab: Tab;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (paymentAmount: number, changeAmount: number) => void;
  isProcessing?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  tab,
  isOpen,
  onClose,
  onPaymentComplete,
  isProcessing = false
}) => {
  // State for payment amount and error handling
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  
  // Reset state when the modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentAmount('');
      setError(null);
    }
  }, [isOpen]);

  // If the modal is not open, don't render anything
  if (!isOpen) return null;
  
  // Common payment amounts - can be adjusted based on your currency and typical payment values
  // We're using 1000, 2000, 3000 and 5000 as examples for Albanian Lek
  const commonPayments = [1000, 2000, 3000, 5000, 10000];
  
  // Format currency for display (Albanian Lek)
  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat('sq-AL').format(amount)} L`;
  };
  
  // Calculate change amount
  const calculateChange = () => {
    if (paymentAmount === '' || typeof paymentAmount !== 'number') return 0;
    const change = paymentAmount - tab.totalAmount;
    return change > 0 ? change : 0;
  };
  
  // Handle payment submission
  const handlePayment = () => {
    if (paymentAmount === '' || typeof paymentAmount !== 'number') {
      setError('Please enter a valid payment amount');
      return;
    }
    
    if (paymentAmount < tab.totalAmount) {
      setError('Payment amount must be at least the total amount');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Calculate change to return
    const changeAmount = calculateChange();
    
    // Call the onPaymentComplete callback with payment and change amounts
    onPaymentComplete(paymentAmount, changeAmount);
  };
  
  // Validation helper
  const isPaymentValid = typeof paymentAmount === 'number' && paymentAmount >= tab.totalAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Process Payment</h2>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Member Info */}
        <div className="text-sm text-gray-600 mb-3">
          <p>Member: <span className="font-medium">{tab.memberAccount}</span></p>
          {tab.pcName && <p>PC: <span className="font-medium">{tab.pcName}</span></p>}
        </div>
        
        {/* Payment Information */}
        <div className="mb-6">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600">Total to pay:</span>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(tab.totalAmount)}</span>
          </div>
        </div>
        
        {/* Payment Amount Input */}
        <div className="mb-5">
          <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount
          </label>
          <div className="relative">
            <input
              id="paymentAmount"
              type="number"
              value={paymentAmount}
              onChange={(e) => {
                const value = e.target.value;
                setPaymentAmount(value === '' ? '' : Number(value));
                setError(null); // Clear error on input change
              }}
              className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              placeholder="Enter amount"
              disabled={isProcessing}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">L</span>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle size={16} className="mr-1" />
              {error}
            </div>
          )}
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 mb-2">Common Amounts:</p>
          <div className="flex flex-wrap gap-2">
            {commonPayments.map(amount => (
              <button
                key={amount}
                onClick={() => {
                  setPaymentAmount(amount);
                  setError(null); // Clear error when selecting a preset amount
                }}
                disabled={isProcessing}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Change Display */}
        <div className="mb-5 bg-gray-50 p-3 rounded-md border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Change to return:</span>
            <span className="text-lg font-semibold text-green-600">
              {paymentAmount !== '' ? formatCurrency(calculateChange()) : '—'}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            className={`flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium flex items-center justify-center gap-2 ${
              isProcessing || !isPaymentValid ? 'opacity-60 cursor-not-allowed' : 'hover:bg-indigo-700'
            } transition-colors`}
            disabled={isProcessing || !isPaymentValid}
            onClick={handlePayment}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Complete Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;