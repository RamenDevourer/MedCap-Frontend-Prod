import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PencilLine, LogOut, FilePlus2, HeartPulse } from 'lucide-react';
import AnalysisHistory from '../components/AnalysisHistory';
import UserDetails from '../components/UserDetails';
import EditProfileForm from '../components/EditProfileForm';
import serverUrl from '../components/server_url';
import LoadingPopup from '../components/LoadingPopup';
import PageShell, { PageIntro } from '../components/ui/PageShell';
import Avatar from '../components/ui/Avatar';
import { clearSession } from '../lib/session';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${serverUrl}/api/auth/secure`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { user, medicalReports } = response.data;
        setUser(user);
        setAnalysisHistory(medicalReports);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const handleUpdateUser = (updatedUser) => setUser(updatedUser);

  if (loading || !user) {
    return (
      <PageShell>
        <div className="min-h-[60vh]" />
        {loading && <LoadingPopup message="Loading your dashboard…" />}
      </PageShell>
    );
  }

  const count = Array.isArray(analysisHistory) ? analysisHistory.length : 0;

  return (
    <PageShell>
      <div className="container py-10 md:py-14">
        <PageIntro
          eyebrow="Dashboard"
          title={`${greeting()}, ${user.firstName}.`}
          actions={
            <>
              <Link to="/healthcareplan" className="btn-ghost"><HeartPulse size={16} /> My plan</Link>
              <Link to="/medicalreport" className="btn-brand"><FilePlus2 size={16} /> New report</Link>
            </>
          }
        >
          {count
            ? `You have ${count} ${count === 1 ? 'analysis' : 'analyses'} on file. Open any of them to see the details.`
            : 'Upload your first report to get a personal health plan.'}
        </PageIntro>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="card p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-4">
              <Avatar user={user} size="lg" />
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-medium">{`${user.firstName} ${user.lastName}`}</h2>
                <p className="truncate text-sm text-ink-soft">{user.email}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <button className="btn-ghost px-3" onClick={() => setIsEditing(true)}>
                <PencilLine size={16} /> Edit
              </button>
              <button className="btn-danger px-3" onClick={handleLogout}>
                <LogOut size={16} /> Log out
              </button>
            </div>

            <div className="mt-7 border-t border-line pt-6">
              <UserDetails user={user} />
            </div>
          </aside>

          <AnalysisHistory history={analysisHistory} />
        </div>
      </div>

      {isEditing && (
        <EditProfileForm user={user} onClose={() => setIsEditing(false)} onUpdate={handleUpdateUser} />
      )}
    </PageShell>
  );
};

export default UserDashboard;
