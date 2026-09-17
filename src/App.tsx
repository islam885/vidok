import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { RoomProvider, useRoom } from './context/RoomContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { RoomsList } from './components/RoomsList';
import { RoomView } from './components/RoomView';
import { UserProfileView } from './components/UserProfileView';
import { AuthModal } from './components/AuthModal';
import { JoinCodeModal } from './components/JoinCodeModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { MediaSearchDrawer } from './components/MediaSearchDrawer';
import { ActiveTab } from './types';

const MainAppContent: React.FC = () => {
  const { currentRoom, joinRoomById } = useRoom();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [joinCodeModalOpen, setJoinCodeModalOpen] = useState(false);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleJoinRoom = (id: string) => {
    joinRoomById(id);
    setActiveTab('room');
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Liquid Neon Ambient Glow Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[130px]" />
        <div className="absolute top-[40%] right-[-5%] w-[450px] h-[450px] rounded-full bg-blue-600/12 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[550px] h-[550px] rounded-full bg-sky-500/10 blur-[150px]" />
      </div>

      {/* Main Top Navbar & Bottom Dock */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onOpenJoinCode={() => setJoinCodeModalOpen(true)}
        onOpenCreateRoom={() => setCreateRoomModalOpen(true)}
        onOpenSearch={() => setSearchDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <HomeView
                onJoinRoom={handleJoinRoom}
                onOpenCreate={() => setCreateRoomModalOpen(true)}
                onOpenJoinCode={() => setJoinCodeModalOpen(true)}
                onOpenSearch={() => setSearchDrawerOpen(true)}
                onViewAllRooms={() => setActiveTab('rooms')}
              />
            </motion.div>
          )}

          {activeTab === 'rooms' && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <RoomsList
                onJoinRoom={handleJoinRoom}
                onOpenCreate={() => setCreateRoomModalOpen(true)}
                onOpenJoinCode={() => setJoinCodeModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'room' && (
            <motion.div
              key="room"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <RoomView
                onBack={() => setActiveTab('rooms')}
                onOpenSearch={() => setSearchDrawerOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <UserProfileView onOpenAuth={handleOpenAuth} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Interactive Modals and Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <JoinCodeModal
        isOpen={joinCodeModalOpen}
        onClose={() => setJoinCodeModalOpen(false)}
        onJoined={() => setActiveTab('room')}
      />

      <CreateRoomModal
        isOpen={createRoomModalOpen}
        onClose={() => setCreateRoomModalOpen(false)}
        onCreated={() => setActiveTab('room')}
      />

      <MediaSearchDrawer
        isOpen={searchDrawerOpen}
        onClose={() => setSearchDrawerOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <MainAppContent />
      </RoomProvider>
    </AuthProvider>
  );
}
