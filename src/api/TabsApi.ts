import apiClient from './apiClient';
import { ApiResponse } from '../types/ApiResponse';
import { Tab, CreateTabRequest, TabItem, UpdateTabItemQuantityRequest } from '../types/Tab';


// At the top of TabsApi.ts, add:
console.log('API Client configuration:', {
    baseURL: apiClient.defaults.baseURL,
    headers: apiClient.defaults.headers
});
export const TabsApi = {
    // Get active tab for a member
    getActiveTabForMember: async (memberId: number): Promise<ApiResponse<Tab | { active: false }>> => {
        try {
            const response = await apiClient.get(`/api/tabs/member/${memberId}/active`);
            return { data: response.data, success: true };
        } catch (error) {
            const err = error as Error;
            return {
                error: err.message || 'Failed to fetch active tab',
                success: false
            };
        }
    },


    // Create a new tab
    // In TabsApi.ts
    // Use this as a temporary replacement for createTab in TabsApi.ts
 // Replace your current TabsApi.createTab implementation with this one
// Replace your current TabsApi.createTab implementation with this one
createTab: async (request: CreateTabRequest): Promise<ApiResponse<Tab>> => {
    try {
      console.log("TabsApi.createTab called with:", request);
      
      // Use fetch directly since we know it works
      const baseUrl = apiClient.defaults.baseURL || "http://localhost:3000";
      const url = `${baseUrl}/api/tabs`;
      console.log("Making fetch request to:", url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      
      console.log("Fetch response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetch response data:", data);
      
      return { data, success: true };
    } catch (error) {
      console.error("Error in TabsApi.createTab:", error);
      const err = error as Error;
      return { 
        error: err.message || 'Failed to create tab',
        success: false 
      };
    }
  },

    // Get tab by ID
    getTabById: async (tabId: string): Promise<ApiResponse<Tab>> => {
        try {
            const response = await apiClient.get(`/api/tabs/${tabId}`);
            return { data: response.data, success: true };
        } catch (error) {
            const err = error as Error;
            return {
                error: err.message || 'Failed to fetch tab',
                success: false
            };
        }
    },

    // Add item to tab
    addItemToTab: async (tabId: string, item: {
        productId: string,
        productName: string,
        price: number,
        quantity: number
    }): Promise<ApiResponse<Tab>> => {
        try {
            const response = await apiClient.post(`/api/tabs/${tabId}/items`, item);
            // After adding item, fetch the updated tab to get the complete state
            const updatedTab = await apiClient.get(`/api/tabs/${tabId}`);
            return { data: updatedTab.data, success: true };
        } catch (error) {
            const err = error as Error;
            return {
                error: err.message || 'Failed to add item to tab',
                success: false
            };
        }
    },

    // Update item quantity
    updateItemQuantity: async (
        tabId: string,
        itemIndex: number,
        request: UpdateTabItemQuantityRequest
    ): Promise<ApiResponse<Tab>> => {
        try {
            const response = await apiClient.put(`/api/tabs/${tabId}/items/${itemIndex}`, request);
            return { data: response.data, success: true };
        } catch (error) {
            const err = error as Error;
            return {
                error: err.message || 'Failed to update item quantity',
                success: false
            };
        }
    },

    // Remove item from tab
    removeItemFromTab: async (tabId: string, itemIndex: number): Promise<ApiResponse<Tab>> => {
        try {
            const response = await apiClient.delete(`/api/tabs/${tabId}/items/${itemIndex}`);
            return { data: response.data, success: true };
        } catch (error) {
            const err = error as Error;
            return {
                error: err.message || 'Failed to remove item from tab',
                success: false
            };
        }
    },

    // Close tab
    closeTab: async (tabId: string): Promise<ApiResponse<Tab>> => {
        try {
            const response = await apiClient.post(`/api/tabs/${tabId}/close`);
            return { data: response.data, success: true };
        } catch (error) {
            const err = error as Error;
            return {
                error: err.message || 'Failed to close tab',
                success: false
            };
        }
    }
};
