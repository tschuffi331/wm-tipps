import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { HomePage }       from './pages/HomePage';
import { LoginPage }      from './pages/LoginPage';
import { RegisterPage }   from './pages/RegisterPage';
import { TipsPage }       from './pages/TipsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage }    from './pages/ProfilePage';
import { AdminPage }      from './pages/AdminPage';
import { RulesPage }      from './pages/RulesPage';
import { NotFoundPage }   from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HashRouter>
          <div className="min-h-screen bg-wm-light">
            <Navbar />
            <main className="pb-12">
              <Routes>
                <Route path="/"           element={<HomePage />} />
                <Route path="/login"      element={<LoginPage />} />
                <Route path="/register"   element={<RegisterPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/rules"      element={<RulesPage />} />

                <Route path="/tips" element={
                  <ProtectedRoute><TipsPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
                } />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
          <Toaster position="top-right" />
        </HashRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
