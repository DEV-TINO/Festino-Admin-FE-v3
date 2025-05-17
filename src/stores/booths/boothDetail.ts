import { create } from 'zustand';
import { useBoothList } from './boothList';
import { useTableDetail } from './tableDetail';
import { api, alertError } from '@/utils/api';
import { ADMIN_CATEGORY } from '@/constants/constant';
import { Menu, BoothInfo, BoothDetailState } from '@/types/booths/booth.types';

const initialBoothInfo: BoothInfo = {
  boothId: '',
  boothName: '',
  adminName: '',
  adminCategory: '주간부스',
  openTime: '',
  closeTime: '',
  boothIntro: '',
  boothImage: [],
  location: '',
  isOpen: true,
  isOrder: true,
  isReservation: true,
  isKakaoPay: true,
  kakaoPay: '',
  isTossPay: true,
  tossPay: '',
  totalReservationNum: 0,
  accountInfo: {
    account: '',
    accountHolder: '',
    bankName: '',
  },
};

export const useBoothDetail = create<BoothDetailState>((set, get) => ({
  boothInfo: initialBoothInfo,
  boothType: '',
  menuList: [],
  originalMenuList: [],
  deleteMenuList: [],
  createMenuList: [],
  patchMenuList: [],
  
  setBoothInfo: (newBoothInfo: BoothInfo) => {
    set({ boothInfo: newBoothInfo });
  },
  
  updateMenuList: (updateMenu: Partial<Menu>) => {
    const { menuList } = get();
  
    const updatedMenuList = menuList.map((menu) =>
      menu.menuId === updateMenu.menuId
        ? { ...menu, ...updateMenu }
        : menu
    );
  
    set({ menuList: updatedMenuList });
  },

  updateBoothInfo: (updatedInfo: Partial<BoothInfo>) => {
    const { boothInfo } = get();
    set({ boothInfo: { ...boothInfo, ...updatedInfo } });
  },

  init: async (boothId) => {
    if (!boothId) return;
    const boothType = await get().findBoothType(boothId);
    set({ boothType });
    return await get().getBoothDetail({ boothId, type: boothType });
  },

  getBoothInfo: async (boothId) => {
    const { boothList, getAllBoothList } = useBoothList.getState();

    await getAllBoothList();
    const booth = boothList.find((b) => b.boothId === boothId);
    if (!booth) return;

    set({ boothInfo: booth, boothType: ADMIN_CATEGORY[booth.adminCategory] });

    if (ADMIN_CATEGORY[booth.adminCategory] === 'night') {
      try {
        const res = await api.get(`/admin/booth/night/${boothId}`);
        if (res.data.success) {
          set({ boothInfo: res.data.data });
        } else {
          alertError(res.data.message);
        }
      } catch (error: any) {
        alertError(error);
      }
    }
  },

  getAdminBoothInfo: async (boothId) => {
    const { boothList, getAllBoothList } = useBoothList.getState();

    await getAllBoothList();
    const booth = boothList.find((b) => b.boothId === boothId);
    if (!booth) return;

    set({ boothInfo: booth, boothType: ADMIN_CATEGORY[booth.adminCategory] });

    if (ADMIN_CATEGORY[booth.adminCategory] === 'night') {
      try {
        const res = await api.get(`/admin/booth/night/${boothId}`);
        if (res.data.success) {
          set({ boothInfo: res.data.data });
        } else {
          alertError(res.data.message);
        }
      } catch (error: any) {
        alertError(error);
      }
    }
  },

  getBoothDetail: async ({ boothId, type }) => {
    try {
      const [boothRes, menuRes] = await Promise.all([
        api.get(`/admin/booth/${type}/${boothId}`),
        api.get(`/admin/menu/all/booth/${boothId}`),
      ]);

      if (boothRes.data.success && menuRes.data.success) {
        set({
          boothInfo: boothRes.data.data,
          menuList: menuRes.data.data,
          originalMenuList: JSON.parse(JSON.stringify(menuRes.data.data)),
        });

        if (boothRes.data.data?.isOrder) {
          const { getTableList } = useTableDetail.getState();
          await getTableList(boothId);
        }

        return true;
      } else {
        alertError(boothRes.data.message + menuRes.data.message);
        return false;
      }
    } catch (error: any) {
      alertError(error);
      return false;
    }
  },

  getNightBoothInfo: async (boothId) => {
    try {
      const res = await api.get(`/admin/booth/night/${boothId}`);
      if (res.data.success) {
        set({ boothInfo: res.data.data });
        return true;
      } else {
        alertError(res.data.message);
        return false;
      }
    } catch (error: any) {
      alertError(error);
      return false;
    }
  },

  reset: () => {
    set({
      boothInfo: initialBoothInfo,
      boothType: '',
      menuList: [],
      deleteMenuList: [],
      createMenuList: [],
      patchMenuList: [],
    });
  },

  addMenuList: (menu) => {
    const { menuList } = get();
    const filtered = menuList.filter((m) => m.menuName !== menu.menuName);
    set({ menuList: [...filtered, menu] });
  },

  patchCurrentMenu: (menu) => {
    const { menuList } = get();
    const updated = menuList.map((m) => (m.menuId === menu.menuId ? menu : m));
    set({ menuList: updated });
  },

  addCreateMenu: (menu) => {
    const { createMenuList } = get();
    const filtered = createMenuList.filter((m) => m.menuName !== menu.menuName);
    set({ createMenuList: [...filtered, menu] });
  },

  addPatchMenu: (menu) => {
    const { patchMenuList } = get();
    const filtered = patchMenuList.filter((m) => m.menuId !== menu.menuId);
    set({ patchMenuList: [...filtered, menu] });
  },

  addDeleteMenu: (menuId) => {
    const { deleteMenuList } = get();
    const filtered = deleteMenuList.filter((id) => id !== menuId);
    set({ deleteMenuList: [...filtered, menuId] });
  },

  createMenu: async (menu) => {
    try {
      const { boothId } = get().boothInfo;
      if (!boothId) throw '부스 정보가 없습니다.';
      const res = await api.post('/admin/menu', { ...menu, boothId });
      return res.data.success;
    } catch (error: any) {
      alertError(error);
      return false;
    }
  },

  patchMenu: async (menu) => {
    try {
      const { boothId } = get().boothInfo;
      if (!boothId) throw '부스 정보가 없습니다.';
      const res = await api.put('/admin/menu', { ...menu, boothId });
      return res.data.success;
    } catch (error: any) {
      alertError(error);
      return false;
    }
  },

  deleteMenu: async (menuId) => {
    try {
      const { boothId } = get().boothInfo;
      if (!boothId || !menuId) throw '메뉴 혹은 부스 정보가 없습니다.';
      const res = await api.delete('/admin/menu', {
        data: { boothId, menuId },
      });
      return res.data.success;
    } catch (error: any) {
      alertError(error);
      return false;
    }
  },

  findBoothType: async (boothId: string) => {
    const { getAllBoothList } = useBoothList.getState();
    await getAllBoothList();
    const boothList = useBoothList.getState().boothList;
    const booth = boothList.find((b) => b.boothId === boothId);
    return ADMIN_CATEGORY?.[booth?.adminCategory ?? ''] ?? '';
  },

  setUseOrder: (value: boolean) => {
    const { boothInfo } = get();
    set({ boothInfo: { ...boothInfo, isOrder: value } });
  },

  setUseReservation: (value: boolean) => {
    const { boothInfo } = get();
    set({ boothInfo: { ...boothInfo, isReservation: value } });
  },
}));