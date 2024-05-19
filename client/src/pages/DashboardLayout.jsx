import { Navigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Sidebar } from '../components';
import { useAppContext } from '../context/AppContext';
import DashboardNavbar from '../components/DashboardNavbar';

const DashboardLayout = () => {
  const { authUser } = useAppContext();

  return authUser?.userDetails?.role === 'admin' ? (
    <>{<Navigate to="/admin" />}</>
  ) : authUser ? (
    <Wrapper>
      <main className="dashboard">
        {/* <BigSidebar /> */}
        <Sidebar />
        <div>
          <DashboardNavbar />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
      {/* <DashboardNavbar />
      <MainDashboard>
        <Sidebar />
        <Outlet />
      </MainDashboard> */}
    </Wrapper>
  ) : (
    <>{<Navigate to="/auth" />}</>
  );
};

const Wrapper = styled.section`
  .dashboard {
    display: grid;
    grid-template-columns: 1fr;
  }
  .dashboard-page {
    width: 90vw;
    margin: 0 auto;
    padding: 2rem 0;
  }
  @media (min-width: 992px) {
    .dashboard {
      grid-template-columns: auto 1fr;
    }
    .dashboard-page {
      width: 90%;
    }
  }
`;
export default DashboardLayout;
