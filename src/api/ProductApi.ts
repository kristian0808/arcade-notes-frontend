import apiClient from './apiClient';
import { Product } from '../types/Product';
import { ApiResponse } from '../types/ApiResponse';

export const ProductsApi = {
  // Get all products or search by query
  getProducts: async (query?: string): Promise<ApiResponse<Product[]>> => {
    try {
      const params = query ? { query } : {};
      // Removed '/api' prefix from path
      const response = await apiClient.get('/products', { params });
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return {
        error: err.message || 'Failed to fetch products',
        success: false
      };
    }
  },

  // Get product by ID
  getProductById: async (productId: string): Promise<ApiResponse<Product>> => {
    try {
      // Removed '/api' prefix from path
      const response = await apiClient.get(`/products/${productId}`);
      return { data: response.data, success: true };
    } catch (error) {
      const err = error as Error;
      return {
        error: err.message || 'Failed to fetch product details',
        success: false
      };
    }
  }
};