import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, Banknote, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Tab, PaymentMethod, PaymentResponse, PaymentStatus } from '../../types/Tab';

interface EnhancedPaymentModalProps {
  tab: Tab;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (paymentData: { paymentMethod: PaymentMethod }) => void;
  isProcessing?: boolean;
}

const EnhancedPaymentModal: React.FC<EnhancedPaymentModalProps> = ({
  tab,
  isOpen,
  onClose,
  onPaymentComplete,
  isProcessing = false
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Reset state when the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPaymentMethod(PaymentMethod.CASH);
      setError(null);
      setShowConfirmation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  // Format currency for display (Albanian Lek)
  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat('sq-AL').format(amount)} L`;
  };

  // Get payment method icon and label
  const getPaymentMethodDetails = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH:
        return { icon: Banknote, label: 'Cash Payment', color: 'text-green-600' };
      case PaymentMethod.BALANCE:
        return { icon: Wallet, label: 'Member Balance', color: 'text-blue-600' };
      case PaymentMethod.CARD:
        return { icon: CreditCard, label: 'Card Payment', color: 'text-purple-600' };
    }
  };

  // Get payment status styling
  const getPaymentStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      case PaymentStatus.PARTIAL:
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
      case PaymentStatus.FAILED:
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setError(null);
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    setShowConfirmation(true);
  };

  // Handle actual payment processing
  const handleProcessPayment = () => {
    setError(null);
    onPaymentComplete({ paymentMethod: selectedPaymentMethod });
  };

  // Payment method options
  const paymentMethods = [
    {
      method: PaymentMethod.CASH,
      title: 'Cash Payment',
      description: 'Process payment with cash',
      icon: Banknote,
    },
    {
      method: PaymentMethod.BALANCE,
      title: 'Member Balance',
      description: 'Deduct from member account balance',
      icon: Wallet,
    },
    {
      method: PaymentMethod.CARD,
      title: 'Card Payment',
      description: 'Process payment with credit/debit card',
      icon: CreditCard,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
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

        {/* Member and Tab Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-600">Member</p>
              <p className="font-medium text-gray-900">{tab.memberAccount}</p>
            </div>
            {tab.pcName && (
              <div className="text-right">
                <p className="text-sm text-gray-600">PC</p>
                <p className="font-medium text-gray-900">{tab.pcName}</p>
              </div>
            )}
          </div>
          
          {/* Payment Status */}
          {tab.paymentStatus && tab.paymentStatus !== PaymentStatus.PENDING && (
            <div className={`flex items-center gap-2 p-2 rounded ${getPaymentStatusStyle(tab.paymentStatus).bg} ${getPaymentStatusStyle(tab.paymentStatus).border} border`}>
              {React.createElement(getPaymentStatusStyle(tab.paymentStatus).icon, { 
                size: 16, 
                className: getPaymentStatusStyle(tab.paymentStatus).color 
              })}
              <span className={`text-sm font-medium ${getPaymentStatusStyle(tab.paymentStatus).color}`}>
                Status: {tab.paymentStatus.charAt(0).toUpperCase() + tab.paymentStatus.slice(1)}
              </span>
            </div>
          )}
        </div>

        {/* Items Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Items ({tab.items.length})</h3>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {tab.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {item.quantity}x {item.productName}
                </span>
                <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
              </div>
            ))}
          </div>
          
          {/* Failed Items */}
          {tab.failedItems && tab.failedItems.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-medium text-red-800 mb-2">Failed Items ({tab.failedItems.length})</p>
              <div className="space-y-1">
                {tab.failedItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm text-red-700">
                    <span>{item.quantity}x {item.productName}</span>
                    <span>{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Total */}
          <div className="flex justify-between items-center py-3 border-t border-gray-200 mt-4">
            <span className="font-medium text-gray-900">Total Amount:</span>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(tab.totalAmount)}</span>
          </div>
        </div>

        {!showConfirmation ? (
          /* Payment Method Selection */
          <>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</h3>
              <div className="space-y-3">
                {paymentMethods.map(({ method, title, description, icon: Icon }) => (
                  <div
                    key={method}
                    onClick={() => handlePaymentMethodSelect(method)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={selectedPaymentMethod === method ? 'text-indigo-600' : 'text-gray-500'} />
                      <div className="flex-1">
                        <p className={`font-medium ${selectedPaymentMethod === method ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {title}
                        </p>
                        <p className={`text-sm ${selectedPaymentMethod === method ? 'text-indigo-700' : 'text-gray-600'}`}>
                          {description}
                        </p>
                      </div>
                      {selectedPaymentMethod === method && (
                        <CheckCircle size={20} className="text-indigo-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle size={16} className="text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

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
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          /* Payment Confirmation */
          <>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Confirm Payment</h3>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  {React.createElement(getPaymentMethodDetails(selectedPaymentMethod).icon, {
                    size: 20,
                    className: getPaymentMethodDetails(selectedPaymentMethod).color
                  })}
                  <span className="font-medium text-gray-900">
                    {getPaymentMethodDetails(selectedPaymentMethod).label}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(tab.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member:</span>
                    <span className="font-medium">{tab.memberAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{tab.items.length} items</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmation(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className={`flex-1 px-4 py-2 bg-green-600 text-white rounded-md font-medium flex items-center justify-center gap-2 ${
                  isProcessing ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'
                } transition-colors`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Complete Payment
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedPaymentModal;