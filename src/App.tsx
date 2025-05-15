import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import OrderLayout from './layouts/OrderLayout';
import BoothListPage from './pages/booths/BoothListPage';
import OrderStatisticsPage from './pages/orders/OrderStatisticsPage';
import DefaultLayout from './layouts/DefaultLayout';
import LoginPage from './pages/logins/LoginPage';
import OrderRealTime from './pages/orders/OrderRealTimePage';
import OrderReady from './pages/orders/OrderReadyPage';
import OrderCooking from './pages/orders/OrderCookingPage';
import OrderFinish from './pages/orders/OrderFinishPage';
import OrderCancel from './pages/orders/OrderCancelPage';
import OrderTable from './pages/orders/OrderTablePage';
import AuthGuard from '@/components/AuthGuard';
import ModalPage from './pages/modals/ModalPage';
import AppInitializer from './components/AppInitializer';
import TablingPage from './pages/tablings/TablingPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppInitializer />
      <AuthGuard />
      <ModalPage />
      <Routes>
        <Route element={<DefaultLayout />}>
          {/* Main */}
          <Route path="/">
            <Route index element={<BoothListPage />} />
            <Route path="reserve" element={<TablingPage />} />
          </Route>

          {/* Order */}
          <Route path="/order" element={<OrderLayout />}>
            <Route path="realTime" element={<OrderRealTime />} />
            <Route path="ready" element={<OrderReady />} />
            <Route path="cooking" element={<OrderCooking />} />
            <Route path="finish" element={<OrderFinish />} />
            <Route path="cancel" element={<OrderCancel />} />
            <Route path="table" element={<OrderTable />} />
            <Route path="statistics" element={<OrderStatisticsPage />} />
          </Route>

          <Route>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        {/* mobile */}
        <Route path="/mobile" element={<MobileLayout />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;