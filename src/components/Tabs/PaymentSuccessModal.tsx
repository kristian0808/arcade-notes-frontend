import React, { useEffect } from 'react';
import { CheckCircle, X, CreditCard, Wallet, Banknote, Clock } from 'lucide-react';
import { PaymentResponse, PaymentMethod, PaymentStatus } from '../../types/Tab';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentResponse: PaymentResponse;
  autoCloseDelay?: number; // Auto close after X seconds
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  paymentResponse,
  autoCloseDelay = 3000 // 3 seconds default
}) => {
  // Auto close timer
  useEffect(() => {
    if (isOpen && paymentResponse.paymentStatus === 'paid') {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, paymentResponse.paymentStatus, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat('sq-AL').format(amount)} L`;
  };

  // Get payment method details
  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'cash': return Banknote;
      case 'balance': return Wallet;
      case 'card': return CreditCard;
      default: return Wallet;
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'cash': return 'Cash Payment';
      case 'balance': return 'Member Balance';
      case 'card': return 'Card Payment';
      default: return 'Payment';
    }
  };

  // Get status styling
  const getStatusConfig = () => {
    switch (paymentResponse.paymentStatus) {
      case 'paid':
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          subtitle: 'Your order has been processed successfully',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-900'
        };
      case 'partial':
        return {
          icon: Clock,
          title: 'Partial Payment Completed',
          subtitle: 'Some items were processed successfully',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-900'
        };
      default:
        return {
          icon: CheckCircle,
          title: 'Payment Processed',
          subtitle: 'Payment has been processed',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-900'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const PaymentIcon = getPaymentMethodIcon(paymentResponse.tab.paymentMethod);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative p-6 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
          
          {/* Success Icon */}
          <div className={`mx-auto w-16 h-16 ${statusConfig.bgColor} ${statusConfig.borderColor} border-2 rounded-full flex items-center justify-center mb-4`}>
            <statusConfig.icon size={32} className={statusConfig.iconColor} />
          </div>
          
          {/* Title */}
          <h2 className={`text-xl font-bold ${statusConfig.titleColor} mb-2`}>
            {statusConfig.title}
          </h2>
          <p className="text-gray-600 text-sm">
            {statusConfig.subtitle}
          </p>
        </div>

        {/* Payment Details */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {/* Payment Method */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Payment Method</span>
              <div className="flex items-center gap-2">
                <PaymentIcon size={16} className="text-gray-500" />
                <span className="font-medium text-gray-900">
                  {getPaymentMethodLabel(paymentResponse.tab.paymentMethod)}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Total Amount</span>
              <span className="font-bold text-lg text-gray-900">
                {formatCurrency(paymentResponse.tab.totalAmount)}
              </span>
            </div>

            {/* Processing Summary */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Items Processed</span>
              <span className="font-medium text-green-600">
                {paymentResponse.totalProcessed} successful
              </span>
            </div>

            {/* Failed Items (if any) */}
            {paymentResponse.totalFailed > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Failed Items</span>
                <span className="font-medium text-red-600">
                  {paymentResponse.totalFailed} failed
                </span>
              </div>
            )}

            {/* Order IDs */}
            {paymentResponse.icafeOrders && paymentResponse.icafeOrders.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600 text-sm">Order ID(s)</span>
                <div className="mt-1 space-y-1">
                  {paymentResponse.icafeOrders.map((order, index) => (
                    <div key={index} className="text-xs font-mono text-gray-700 bg-white px-2 py-1 rounded">
                      #{order.orderId}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          {paymentResponse.message && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">{paymentResponse.message}</p>
            </div>
          )}

          {/* Auto Close Notice for Full Payment */}
          {paymentResponse.paymentStatus === 'paid' && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Tab will close automatically in a few seconds...
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {paymentResponse.paymentStatus === 'paid' ? 'Close Tab' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;