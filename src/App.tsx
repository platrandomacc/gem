import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { PageTransition } from './components/ui/PageTransition';
import { LoadingScreen } from './components/ui/LoadingScreen';

const HomePage = lazy(() => import('./pages/HomePage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const GameInfoPage = lazy(() => import('./pages/GameInfoPage'));
const GamePlayPage = lazy(() => import('./pages/GamePlayPage'));
const CoinflipPage = lazy(() => import('./pages/CoinflipPage'));
const HiloPage = lazy(() => import('./pages/HiloPage'));
const LimboPage = lazy(() => import('./pages/LimboPage'));
const TowersPage = lazy(() => import('./pages/TowersPage'));
const MinesPage = lazy(() => import('./pages/MinesPage'));
const BlackjackPage = lazy(() => import('./pages/BlackjackPage'));
const LeaderboardsPage = lazy(() => import('./pages/LeaderboardsPage'));
const VipPage = lazy(() => import('./pages/VipPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WalletPage = lazy(() => import('./pages/WalletPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const ResponsibleGamblingPage = lazy(() => import('./pages/ResponsibleGamblingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));


function App() {
  const location = useLocation();

  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route path="/games" element={<PageTransition><GamesPage /></PageTransition>} />
            <Route path="/games/info/:gameSlug" element={<PageTransition><GameInfoPage /></PageTransition>} />
            <Route path="/towers" element={<Navigate replace to="/games/towers" />} />
            <Route path="/games/towers" element={<PageTransition><TowersPage /></PageTransition>} />
            <Route path="/games/coinflip" element={<PageTransition><CoinflipPage /></PageTransition>} />
            <Route path="/games/hilo" element={<PageTransition><HiloPage /></PageTransition>} />
            <Route path="/games/limbo" element={<PageTransition><LimboPage /></PageTransition>} />
            <Route path="/games/mines" element={<PageTransition><MinesPage /></PageTransition>} />
            <Route path="/games/blackjack" element={<PageTransition><BlackjackPage /></PageTransition>} />
            <Route path="/games/:gameSlug" element={<PageTransition><GamePlayPage /></PageTransition>} />
            <Route path="/leaderboards" element={<PageTransition><LeaderboardsPage /></PageTransition>} />
            <Route path="/vip" element={<PageTransition><VipPage /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
            <Route path="/wallet" element={<PageTransition><WalletPage /></PageTransition>} />
            <Route path="/support" element={<PageTransition><SupportPage /></PageTransition>} />
            <Route path="/responsible-gambling" element={<PageTransition><ResponsibleGamblingPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
}

export default App;
