export interface ToggleSwitchProps {
  isActive: boolean | undefined;
  width?: number;
  onClick?: () => void;
}

export interface Booth {
  boothId: string;
  boothName: string;
  adminName: string;
  adminCategory: string;
  openTime: string;
  closeTime: string;
  boothIntro: string;
  boothImage: string[]; 
  location: string;
  isOpen: boolean;
  isOrder: boolean;
  isReservation: boolean;
  totalReservationNum: number;
  accountInfo: AccountInfo;
}

export interface BoothRowProps {
  booth: Booth;
  index: number;
  onToggleOpen: () => void;
  onToggleOrder: () => void;
  onToggleReservation: () => void;
  onClickDetail: () => void;
}

export interface BoothListState {
  boothList: BoothInfo[];
  getAllBoothList: () => Promise<Booth[]>;
  setBoothList: (boothList: Booth[]) => void;
  updateBoothOpen: (args: { boothId: string; isOpen: boolean; adminCategory: string }) => Promise<void>;
  updateBoothOrder: (args: { boothId: string; isOrder: boolean; adminCategory: string }) => Promise<void>;
  updateBoothReservation: (args: { boothId: string; isReservation: boolean; adminCategory: string }) => Promise<void>;
  handleClickBoothDetail: (boothId: string) => void;
}

export interface AccountInfo {
  account: string;
  accountHolder: string;
  bankName: string;
}

export interface Menu {
  menuId?: string;
  menuName: string;
  [key: string]: any;
}

export interface BoothInfo {
  boothId: string;
  boothName: string;
  adminName: string;
  adminCategory: string;
  openTime: string;
  closeTime: string;
  boothIntro: string;
  boothImage: any[];
  location: string;
  isOpen: boolean;
  isOrder: boolean;
  isReservation: boolean;
  isKakaoPay: boolean,
  kakaoPay: string,
  isTossPay: boolean,
  tossPay: string,
  totalReservationNum: number;
  accountInfo: AccountInfo;
}

export interface BoothDetailState {
  boothInfo: BoothInfo;
  boothType: string;
  menuList: MenuInfo[] | Menu[];
  originalMenuList: Menu[];
  deleteMenuList: string[];
  createMenuList: Menu[];
  patchMenuList: Menu[];
  updateMenuList: (updateMenu: Partial<Menu>) => void;
  updateBoothInfo: (updatedInfo: Partial<BoothInfo>) => void;
  setBoothInfo: (newBoothInfo: BoothInfo) => void;
  init: (boothId: string) => Promise<boolean | undefined>;
  getBoothInfo: (boothId: string) => Promise<void>;
  getAdminBoothInfo: (boothId: string) => Promise<void>;
  getBoothDetail: (params: { boothId: string; type: string }) => Promise<boolean>;
  getNightBoothInfo: (boothId: string) => Promise<boolean>;
  reset: () => void;
  addMenuList: (menu: Menu) => void;
  patchCurrentMenu: (menu: Menu) => void;
  addCreateMenu: (menu: Menu) => void;
  addPatchMenu: (menu: Menu) => void;
  addDeleteMenu: (menuId: string) => void;
  createMenu: (menu: Menu) => Promise<boolean>;
  patchMenu: (menu: Menu) => Promise<boolean>;
  deleteMenu: (menuId: string) => Promise<boolean>;
  findBoothType: (boothId: string) => Promise<string>;
  setUseOrder: (value: boolean) => void;
  setUseReservation: (value: boolean) => void;
}

export interface TableItem {
  tableNumIndex: number;
  customTableNum: string;
  orderUrl: string;
}

export interface TableDetailState {
  tableNumList: TableItem[];
  tableNum: number;

  openTableDetailModal: () => void;
  closeTableDetailModal: () => void;
  getTableList: (boothId: string) => Promise<void>;
  submitTableDetail: (boothId: string) => Promise<boolean | undefined>;
  getCustomTableNum: (tableNum: number) => string | number;

  setTableNum: (num: number) => void;
  setTableNumList: (list: TableItem[]) => void;
}

export type MenuType = 'MAINMENU' | 'SUBMENU';

export interface MenuInfo {
  menuId?: string;
  menuName: string;
  menuPrice: number | string;
  menuDescription: string;
  menuImage: string;
  menuType: MenuType;
  isSoldOut: boolean;
  menuIndex: number;
}

export interface MenuModalState {
  menuInfo: MenuInfo;
  isNewMenu: boolean;
  openMenuModal: (menu?: Partial<MenuInfo>) => void;
  openMobileModal: (menu?: Partial<MenuInfo>) => void;
  submitModal: () => void;
  closeModal: () => void;
  closeMobileModal: () => void;
  reset: () => void;
  setMenuInfo: (menu: Partial<MenuInfo>) => void;
}