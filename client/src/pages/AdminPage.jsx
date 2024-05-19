import { Navigate } from 'react-router-dom';
import VerifyPass from '../components/VerifyPass';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const { authUser } = useAppContext();

  return authUser?.userDetails?.role === 'admin' ? (
    <div>
      <VerifyPass />
    </div>
  ) : (
    <>
      {
        <>
          {toast.error('Your are not authorized')}
          <Navigate to="/" />
        </>
      }
    </>
  );
};
export default AdminPage;
