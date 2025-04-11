// src/components/Tabs/TabView.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Tab, TabItem } from '../../types/Tab';
import { Product } from '../../types/Product';
import { ProductsApi } from '../../api/ProductApi';
import { TabsApi } from '../../api/TabsApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { Search, PlusCircle, MinusCircle, Trash2, XCircle, ShoppingCart, DollarSign } from 'lucide-react'; // Icons

interface TabViewProps {
  tab: Tab;
  onCloseTab: () => void; // Propagate close action
  onTabUpdated: (tab: Tab) => void; // Propagate updates
  isClosing?: boolean; // Optional flag for close loading state
}

const TabView: React.FC<TabViewProps> = ({ tab, onCloseTab, onTabUpdated, isClosing = false }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [isItemLoading, setIsItemLoading] = useState<boolean>(false); // For add/update/remove
  const [itemError, setItemError] = useState<string | null>(null);

  // Debounced Product Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null); // Clear error when query is empty
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      setItemError(null); // Clear item errors when searching

      try {
        const response = await ProductsApi.getProducts(searchQuery);
        if (response.success && response.data) {
          setSearchResults(response.data);
        } else {
          setSearchError(response.error || 'Failed to search products');
          setSearchResults([]);
        }
      } catch (error: any) {
        console.error('Error searching products:', error);
        setSearchError(error.message || 'An unexpected error occurred');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);


  // --- API Call Abstraction ---
  const performTabAction = async (action: () => Promise<{success: boolean; data?: any; error?: string }>, loadingSetter: (loading: boolean) => void) => {
    loadingSetter(true);
    setItemError(null); // Clear previous errors
    try {
        const response = await action();
        if (response.success && response.data) {
            // On success, call the onTabUpdated prop with the fresh tab data
            onTabUpdated(response.data);
            return true; // Indicate success
        } else {
            setItemError(response.error || 'Tab operation failed');
            return false; // Indicate failure
        }
    } catch (error: any) {
        console.error('Tab action error:', error);
        setItemError(error.message || 'An unexpected error occurred');
        return false; // Indicate failure
    } finally {
        loadingSetter(false);
    }
  };

  // --- Item Handlers ---
  const handleAddItem = async (product: Product) => {
    setSearchQuery(''); // Clear search immediately
    setSearchResults([]);

    const success = await performTabAction(
      async () => TabsApi.addItemToTab(tab.id, {
          productId: String(product.product_id),
          productName: product.product_name,
          price: Number(product.product_price),
          quantity: 1
      }),
      setIsItemLoading
    );
    // Optionally handle success/failure feedback if needed
  };

  const handleUpdateQuantity = async (itemIndex: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent negative or zero quantity

    await performTabAction(
        async () => TabsApi.updateItemQuantity(tab.id, itemIndex, { quantity: newQuantity }),
        setIsItemLoading
    );
  };

  const handleRemoveItem = async (itemIndex: number) => {
    // Optional: Confirmation dialog
    // if (!window.confirm('Are you sure you want to remove this item?')) return;

     await performTabAction(
        async () => TabsApi.removeItemFromTab(tab.id, itemIndex),
        setIsItemLoading
    );
  };

  // Format currency utility
  const formatCurrency = (amount: number) => {
    const roundedAmount = Math.round(amount);
    return `${new Intl.NumberFormat('sq-AL').format(roundedAmount)} L`;
  };

  // Render individual tab item
  const renderTabItem = (item: TabItem, index: number) => (
    <div key={`${item.productId}-${index}`} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0 text-sm">
      {/* Item Info */}
      <div className="flex-grow pr-2 min-w-0">
        <p className="font-medium text-gray-800 truncate">{item.productName}</p>
        <p className="text-xs text-gray-500">{formatCurrency(item.price)} each</p>
      </div>

      {/* Quantity Controls & Total */}
      <div className="flex items-center flex-shrink-0 ml-2">
        <button
          onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
          disabled={isItemLoading || item.quantity <= 1}
          className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <MinusCircle size={18} />
        </button>
        <span className="mx-2 text-sm font-medium w-5 text-center tabular-nums">{item.quantity}</span>
        <button
          onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
          disabled={isItemLoading}
          className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <PlusCircle size={18} />
        </button>
        <span className="ml-4 w-16 text-right text-sm font-semibold text-gray-700 tabular-nums">
            {formatCurrency(item.totalPrice)}
        </span>
         <button
          onClick={() => handleRemoveItem(index)}
          disabled={isItemLoading}
          className="ml-3 p-1 text-gray-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );


  return (
    // Use flex-col and h-full if this component should fill its container
    <div className="tab-view relative flex flex-col h-full">

        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex justify-between items-start flex-shrink-0">
            <div>
                 <h3 className="font-semibold text-base text-gray-800">
                    Active Tab - {tab.memberAccount}
                 </h3>
                 <p className="text-xs text-gray-500">
                    Opened: {new Date(tab.createdAt).toLocaleString()} {tab.pcName && `(PC: ${tab.pcName})`}
                 </p>
            </div>
            <button
              onClick={onCloseTab}
              disabled={isItemLoading || isClosing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <XCircle size={14}/>
              {isClosing ? 'Closing...' : 'Close Tab'}
            </button>
        </div>

        {/* Potential Item Action Error */}
        {itemError && (
            <div className="p-3 flex-shrink-0">
                <ErrorMessage message={itemError} />
            </div>
        )}

        {/* Product Search Area */}
        <div className="p-3 relative flex-shrink-0">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <input
              type="text"
              placeholder="Search products to add..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              disabled={isItemLoading || isClosing}
              className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {isSearching && (
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="small" />
                </div>
            )}
            {/* Search Results Dropdown */}
            {!isSearching && searchResults.length > 0 && (
                <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                    {searchResults.map(product => (
                        <div
                            key={product.product_id}
                            onClick={() => handleAddItem(product)}
                            className="flex justify-between items-center px-4 py-2.5 text-sm hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            <span className="text-gray-800">{product.product_name}</span>
                            <span className="text-xs font-semibold text-indigo-600">{formatCurrency(product.product_price)}</span>
                        </div>
                    ))}
                </div>
            )}
             {/* Search Error */}
            {searchError && (
                 <p className="text-xs text-red-600 mt-1 pl-1">{searchError}</p>
            )}
        </div>

        {/* Tab Items List */}
        <div className="tab-items flex-grow overflow-y-auto px-3 pb-3">
            {tab.items.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <ShoppingCart size={36} className="mx-auto mb-3 text-gray-300"/>
                    <p className="text-sm">Tab is empty.</p>
                    <p className="text-xs">Use the search above to add items.</p>
                </div>
            ) : (
                 <div className="border-t border-gray-100">
                    {tab.items.map(renderTabItem)}
                 </div>
            )}
        </div>

        {/* Footer - Total Amount */}
        {tab.items.length > 0 && (
             <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-between items-center flex-shrink-0">
               <h4 className="text-sm font-semibold text-gray-800">Total:</h4>
               <div className="text-lg font-bold text-gray-900 tabular-nums">
                    {formatCurrency(tab.totalAmount)}
               </div>
             </div>
        )}

        {/* Loading Overlay for item actions */}
        {isItemLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <LoadingSpinner message="Updating tab..." />
            </div>
        )}
    </div>
  );
};

export default TabView;