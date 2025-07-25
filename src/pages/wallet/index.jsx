'use client';
import { useState } from "react";

// components
import WalletBallance from "@/components/Wallet/Cards/Walletbalance";
import WalletBlocked from "@/components/Wallet/Cards/WalletBlocked";
import WalletTokenized from "@/components/Wallet/Cards/WalletTokenized";
import WalletWithdraw from "@/components/Wallet/Balance/WithDraw";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

//hooks
import useDarkMode from "@/hooks/useDarkMode";
import AddBalanceDrawer from "@/components/Wallet/Balance/AddBalanceDrawer";

export default function WalletPage() {
  const { isDarkMode } = useDarkMode();
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <div className="row d-flex container-fluid ">
      <Breadcrumb items={[
        { label: 'Carteira', path: '/wallet' },
      ]} />
      <div className="col-12 d-flex justify-content-end">

        <button
          className={`btn ${isDarkMode ? 'btn-light' : 'btn-black'} btn-lg mt-3`}
          onClick={() => setShowDrawer(true)}
        >
          <i className="fa fa-plus me-2"></i>
          Adicionar Saldo na Carteira
        </button>
      </div>
      <div className="col-xl-4 mb-0">
        <WalletBallance />
      </div>
      <div className="col-xl-4 mb-0">
        <WalletBlocked />
      </div>
      <div className="col-xl-4 mb-0">
        <WalletTokenized />
      </div>

      <div className="col-xl-12 mt-4"><WalletWithdraw /></div>
       <AddBalanceDrawer
        isDark={isDarkMode}
        show={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
    </div>
  );
}
