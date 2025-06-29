export interface TabItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
    addedAt: string;
  }

  export interface IcafeOrder {
    orderId: string;
    orderResponse: any;
    items: TabItem[];
    createdAt: string;
    amount: number;
  }
  
  export interface Tab {
    id: string;
    memberId: number;
    memberAccount: string;
    pcName?: string;
    status: 'active' | 'closed';
    paymentStatus?: 'pending' | 'paid' | 'partial' | 'failed';
    paymentMethod?: 'cash' | 'balance' | 'card';
    icafeOrders?: IcafeOrder[];
    failedItems?: TabItem[];
    items: TabItem[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
    paidAt?: string;
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

  export enum PaymentMethod {
    CASH = 'cash',
    BALANCE = 'balance',
    CARD = 'card',
  }

  export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    PARTIAL = 'partial',
    FAILED = 'failed',
  }

  export interface ProcessPaymentRequest {
    paymentMethod: PaymentMethod;
  }

  export interface PaymentResponse {
    success: boolean;
    paymentStatus: PaymentStatus;
    message: string;
    icafeOrders: IcafeOrder[];
    failedItems: TabItem[];
    totalProcessed: number;
    totalFailed: number;
    tab: {
      id: string;
      status: string;
      paymentStatus: string;
      paymentMethod?: string;
      totalAmount: number;
      paidAt?: string;
      closedAt?: string;
    };
  }