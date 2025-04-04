export interface TabItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
    addedAt: string;
  }
  
  export interface Tab {
    id: string;
    memberId: number;
    memberAccount: string;
    pcName?: string;
    status: 'active' | 'closed';
    items: TabItem[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
    notes?: string;
  }
  
  export interface CreateTabRequest {
    memberId: number;
    memberAccount: string;
    pcName?: string;
  }
  
  export interface UpdateTabItemQuantityRequest {
    quantity: number;
  }