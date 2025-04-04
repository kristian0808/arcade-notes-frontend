import React, { useState, useEffect } from 'react';
import { Tab } from '../../types/Tab';
import { Product } from '../../types/Product';

import './Tabs.css';
import LoadingSpinner from '../common/LoadingSpinner';
import { ProductsApi } from '../../api/ProductApi';
import { TabsApi } from '../../api/TabsApi';

interface TabViewProps {
  tab: Tab;
  onCloseTab: () => void;
  onTabUpdated: (tab: Tab) => void;
}

const TabView: React.FC<TabViewProps> = ({ tab, onCloseTab, onTabUpdated }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isItemLoading, setIsItemLoading] = useState<boolean>(false);
  const [itemError, setItemError] = useState<string | null>(null);

  // Search for products
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      
      try {
        const response = await ProductsApi.getProducts(searchQuery);
        
        if (response.success && response.data) {
          setSearchResults(response.data);
        } else {
          setSearchError(response.error || 'Failed to search products');
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchError('An unexpected error occurred');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Add item to tab
  const handleAddItem = async (product: Product) => {
    setIsItemLoading(true);
    setItemError(null);
    
    try {
      // Format the data properly for the API
      const formattedItem = {
        productId: String(product.product_id), // Convert to string
        productName: product.product_name,
        price: Number(product.product_price), // Make sure it's a number
        quantity: 1
      };
      
      console.log('Sending formatted item data:', formattedItem);
      
      const response = await TabsApi.addItemToTab(tab.id, formattedItem);
      
      if (response.success) {
        // Refresh the tab to get updated items and total
        const tabResponse = await TabsApi.getTabById(tab.id);
        
        if (tabResponse.success && tabResponse.data) {
          onTabUpdated(tabResponse.data);
          // Clear search after adding
          setSearchQuery('');
          setSearchResults([]);
        } else {
          setItemError(tabResponse.error || 'Failed to refresh tab');
        }
      } else {
        setItemError(response.error || 'Failed to add item to tab');
      }
    } catch (error) {
      console.error('Error adding item to tab:', error);
      setItemError('An unexpected error occurred');
    } finally {
      setIsItemLoading(false);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (itemIndex: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsItemLoading(true);
    setItemError(null);
    
    try {
      const response = await TabsApi.updateItemQuantity(tab.id, itemIndex, { quantity: newQuantity });
      
      if (response.success && response.data) {
        onTabUpdated(response.data);
      } else {
        setItemError(response.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setItemError('An unexpected error occurred');
    } finally {
      setIsItemLoading(false);
    }
  };

  // Remove item from tab
  const handleRemoveItem = async (itemIndex: number) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    
    setIsItemLoading(true);
    setItemError(null);
    
    try {
      const response = await TabsApi.removeItemFromTab(tab.id, itemIndex);
      
      if (response.success && response.data) {
        onTabUpdated(response.data);
      } else {
        setItemError(response.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setItemError('An unexpected error occurred');
    } finally {
      setIsItemLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    // Round to remove any decimal places
    const roundedAmount = Math.round(amount);
    
    // Format with thousand separators
    const formattedAmount = new Intl.NumberFormat('sq-AL').format(roundedAmount);
    
    return `${formattedAmount} L`;
  };

  return (
    <div className="tab-view">
      <div className="tab-header">
        <div className="tab-title">
          <h3>Active Tab - {tab.memberAccount}</h3>
          <p className="tab-meta">Tab opened: {new Date(tab.createdAt).toLocaleString()}</p>
        </div>
        <button 
          className="close-tab-button"
          onClick={onCloseTab}
          disabled={isItemLoading}
        >
          Close Tab
        </button>
      </div>
      
      {itemError && <div className="tab-error">{itemError}</div>}
      
      <div className="tab-search">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isItemLoading}
        />
        
        {isSearching && <div className="search-loading"><LoadingSpinner size="small" /></div>}
        
        {searchError && <div className="search-error">{searchError}</div>}
        
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(product => (
              <div 
                key={product.product_id} 
                className="search-result-item"
                onClick={() => handleAddItem(product)}
              >
                <div className="product-name">{product.product_name}</div>
                <div className="product-price">{formatCurrency(product.product_price)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="tab-items">
        <h4>Tab Items</h4>
        
        {tab.items.length === 0 ? (
          <div className="no-items">
            <p>No items in this tab yet. Search for products to add.</p>
          </div>
        ) : (
          <>
            <div className="tab-items-list">
              {tab.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="tab-item">
                  <div className="item-info">
                    <div className="item-name">{item.productName}</div>
                    <div className="item-price">{formatCurrency(item.price)}</div>
                  </div>
                  
                  <div className="item-quantity">
                    <button
                      className="quantity-btn minus"
                      onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                      disabled={isItemLoading || item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="quantity-btn plus"
                      onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                      disabled={isItemLoading}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">{formatCurrency(item.totalPrice)}</div>
                  
                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isItemLoading}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className="tab-total">
              <h4>Total</h4>
              <div className="total-amount">{formatCurrency(tab.totalAmount)}</div>
            </div>
          </>
        )}
      </div>
      
      {isItemLoading && <div className="tab-loading-overlay"><LoadingSpinner /></div>}
    </div>
  );
};

export default TabView;