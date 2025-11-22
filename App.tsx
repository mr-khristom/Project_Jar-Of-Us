import React, { useState } from 'react';
import DateGate from './components/DateGate';
import JarView from './components/JarView';
import AdminView from './components/AdminView';
import { AccessLevel } from './types';

const App: React.FC = () => {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.LOCKED);

  const handleBack = () => {
    setAccessLevel(AccessLevel.LOCKED);
  };

  const renderContent = () => {
    switch (accessLevel) {
      case AccessLevel.LOCKED:
        return <DateGate onUnlock={setAccessLevel} />;
      case AccessLevel.USER:
        return <JarView onBack={handleBack} />;
      case AccessLevel.ADMIN:
        return <AdminView onBack={handleBack} />;
      default:
        return <DateGate onUnlock={setAccessLevel} />;
    }
  };

  return (
    <main className="w-full h-screen overflow-hidden font-sans">
      {renderContent()}
    </main>
  );
};

export default App;