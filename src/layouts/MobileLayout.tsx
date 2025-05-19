import { Outlet } from "react-router-dom";
import MobileHeader from "@/components/header/MobileHeader";

const MobileLayout : React.FC = () => {
  return (
    <div className="min-w-[375px] max-w-[500px] bg-white min-h-screen shadow-xs mx-auto">
      <MobileHeader />
      <Outlet />
    </div>
  );
};

export default MobileLayout;