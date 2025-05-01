import apiClient from './apiClient';
import { ApiResponse } from '../types/ApiResponse';
import { Tab, CreateTabRequest, TabItem, UpdateTabItemQuantityRequest } from '../types/Tab';

// Removed debugging console.log

export const TabsApi = {
    // Get active tab for a member
    getActiveTabForMember: async (memberId: number): Promise<ApiResponse<Tab | { active: false }>> => {
        try {
            // Removed '/api' prefix
            const response = await apiClient.get(`/tabs/member/${memberId}/active`);
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
    createTab: async (request: CreateTabRequest): Promise<ApiResponse<Tab>> => {
        try {
            console.log("TabsApi.createTab called with:", request); // Keep log for now if needed
            // Reverted to use apiClient and removed '/api' prefix
            const response = await apiClient.post('/tabs', request);
            console.log("Axios response data:", response.data); // Keep log for now if needed
            return { data: response.data, success: true };
        } catch (error) {
            console.error("Error in TabsApi.createTab:", error); // Keep log for now if needed
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
            // Removed '/api' prefix
            const response = await apiClient.get(`/tabs/${tabId}`);
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
            // Removed '/api' prefix
            await apiClient.post(`/tabs/${tabId}/items`, item);
            // After adding item, fetch the updated tab to get the complete state
            // Removed '/api' prefix
            const updatedTab = await apiClient.get(`/tabs/${tabId}`);
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
            // Removed '/api' prefix
            const response = await apiClient.put(`/tabs/${tabId}/items/${itemIndex}`, request);
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
            // Removed '/api' prefix
            const response = await apiClient.delete(`/tabs/${tabId}/items/${itemIndex}`);
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
            // Removed '/api' prefix
            const response = await apiClient.post(`/tabs/${tabId}/close`);
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
