import { useState, useCallback } from 'react';
import { BankingProvider } from './context/BankingContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Header from './components/Header.jsx';
import WelcomeBar from './components/WelcomeBar.jsx';
import AccountPanel from './components/AccountPanel.jsx';
import TransactionsPanel from './components/TransactionsPanel.jsx';
import AccountsSummary from './components/AccountsSummary.jsx';
import Footer from './components/Footer.jsx';
import TransactionModal from './components/TransactionModal.jsx';
import CreateAccountModal from './components/CreateAccountModal.jsx';
import SwitchAccountModal from './components/SwitchAccountModal.jsx';

function AppContent() {
  const [txAction, setTxAction] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);

  const handleOpenAction = useCallback((action) => {
    setTxAction(action);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleOpenSwitch = useCallback(() => {
    setSwitchModalOpen(true);
  }, []);

  const closeAll = useCallback(() => {
    setTxAction(null);
    setCreateModalOpen(false);
    setSwitchModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f3f8]">
      <div className="flex-1 w-full max-w-[980px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-10 sm:pb-12 max-sm:px-3 max-sm:py-4 max-sm:pb-8 wide:max-w-[1100px]">
        <Header />

        <WelcomeBar onOpenSwitch={handleOpenSwitch} />

        <div className="grid grid-cols-[minmax(280px,340px)_1fr] gap-4 sm:gap-5 mb-5 animate-[fadeUp_380ms_cubic-bezier(0.16,1,0.3,1)_60ms_both] max-lg:grid-cols-1 max-lg:gap-4">
          <AccountPanel onOpenAction={handleOpenAction} onOpenCreate={handleOpenCreate} />
          <TransactionsPanel />
        </div>

        <AccountsSummary />

        <Footer />
      </div>

      <TransactionModal isOpen={!!txAction} initialAction={txAction} onClose={closeAll} />
      <CreateAccountModal isOpen={createModalOpen} onClose={closeAll} />
      <SwitchAccountModal isOpen={switchModalOpen} onClose={closeAll} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BankingProvider>
        <AppContent />
      </BankingProvider>
    </ToastProvider>
  );
}
