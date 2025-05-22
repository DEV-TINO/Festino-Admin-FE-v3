export interface TableItem {
  tableNumIndex: number | null;
  customTableNum: string | number;
}

export interface BaseModalStore {
  isModalOpen: boolean;
  isMobileModalOpen: boolean;
  modalType: string;
  setModalType: (type: string) => void;
  openModal: () => void;
  closeModal: () => void;
  openMobileModal: () => void;
  closeMobileModal: (type?: string) => void;
}

export interface OrderPopupState {
  menuInfoList: any[];
  orderInfo: any;
  cookingInfo: any;
  selectType: string;
  note: string;

  submitPopup: (params: { type: string }) => Promise<void>;
  openPopup: (params: { type: string, selectOrderInfo: any, selectMenuInfoList: any[], selectCookingInfo?: any }) => void;
  closePopup: () => void;
  deleteOrder: (params: { orderId: string }) => Promise<boolean>;
  patchOrderRestore: (params: { orderId: string, orderType: string }) => Promise<boolean>;
  patchOrderDeposit: (params: { orderId: string }) => Promise<boolean>;
  patchOrderComplete: (params: { orderId: string, orderType: string }) => Promise<boolean>;
  patchCookingComplete: (params: { cookId: string }) => Promise<boolean>;
  getNote: () => Promise<void>;
}

export interface MenuItem {
  menuId: string;
  menuName: string;
  menuPrice: number;
  [key: string]: any;
}

export interface OrderItem {
  menuId: string;
  menuName: string;
  menuPrice: number;
  menuCount: number;
  isService?: boolean;
  tableNum?: number;
  [key: string]: any;
}

export interface ServiceModalStore {
  menuList: MenuItem[];
  memo: string;
  openServiceModal: () => void;
  getMenuList: () => Promise<void>;
  saveService: (orderList: Record<string, OrderItem[]>) => Promise<void>;
  setMemo: (text: string) => void;
}

export interface TableListType {
  success: boolean;
  message: string;
  result: TableItemType[];
}

export interface TableItemType {
  tableNumIndex: number;
  type: 'ready' | 'cooking' | 'complete';
  orderInfo: OrderInfoType | null;
}

export interface OrderInfoType {
  orderNum: number;
  orderId: string;
  orderType: string;
  boothId: string;
  tableNum: number;
  date: number;
  userName: string;
  phoneNum: string;
  note: string;
  totalPrice: number;
  isDeposit: boolean;
  isService: boolean;
  createAt: string; 
  finishAt: string; 
  menuList: MenuInfoType[];
}

export interface MenuInfoType {
  menuId: string;
  menuName: string;
  menuCount: number;
  menuPrice: number;
}

export interface TableVisualizationStore {
  tableList: TableItemType[];
  tableOrderList: OrderInfoType[];
  selectedTableNumIndex: number | null;
  getAllTableVisualization: (params: { boothId: string, date: number }) => Promise<void>;
  getAllOrderByTableNum: (params: { boothId: string, tableNum: number }) => Promise<void>;
  openTableVisualDetail: (params: { tableNumIndex: number }) => void;
  closeTableVisualDetail: () => void;
  initSelectedTableNum: () => void;
}