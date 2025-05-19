import { useNavigate, useLocation } from 'react-router-dom';
import IconHeaderBack from '@/components/icons/mobiles/IconHeaderBack';
import { useUserStore } from '@/stores/logins/userStore';
import { useBoothDetail } from '@/stores/booths/boothDetail';

const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, isAdmin } = useUserStore();
  const { boothInfo } = useBoothDetail();

  const handleClickBackButton = () => {
    navigate('/mobile');
  };

  const handleClickLogoutButton = async () => {
    await logout();
    navigate('/mobile/login');
  };

  if (location.pathname === '/mobile/login') return null;

  return (
    <div className="w-full h-[60px] bg-white flex justify-between items-center px-6 shadow-xs">
      <div className="w-[42px]">
        {!(location.pathname === '/mobile') && (
          <div onClick={handleClickBackButton}>
            <IconHeaderBack />
          </div>
        )}
      </div>
      <p className="font-medium text-xl text-secondary-700">
        {isAdmin ? '개발팀' : boothInfo.adminName}
      </p>
      <div className="w-[42px] text-xs underline text-[#999999] underline-offset-4">
        {location.pathname === '/mobile' && (
          <p onClick={handleClickLogoutButton} className="cursor-pointer">
            로그아웃
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;