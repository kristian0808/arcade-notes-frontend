import React, { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

interface CustomProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, price: number) => void;
    isLoading?: boolean;
}

const CustomProductModal: React.FC<CustomProductModalProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit,
    isLoading = false
}) => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!productName.trim()) {
            setError('Product name is required');
            return;
        }

        const priceNumber = Number(price);
        if (isNaN(priceNumber) || priceNumber <= 0) {
            setError('Please enter a valid price');
            return;
        }

        onSubmit(productName.trim(), priceNumber);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Custom Product</h2>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Product Name Input */}
                    <div className="mb-4">
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Enter product name"
                            disabled={isLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                        />
                    </div>

                    {/* Price Input */}
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Enter price"
                                min="0"
                                step="1"
                                disabled={isLoading}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">L</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomProductModal;
