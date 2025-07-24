import { useQuery } from "@tanstack/react-query";
import BreadCrumb from "@/components/breadcrumb/breadcrumb";
import { CgSpinner } from "react-icons/cg";

//components
import WalletBallance from "@/components/Wallet/Cards/Walletbalance";
import WalletBlocked from "@/components/Wallet/Cards/WalletBlocked";
import WalletTokenized from "@/components/Wallet/Cards/WalletTokenized";
import Shortcuts from "@/components/dashboard/Shortcuts";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import TransactionsTypes from "@/components/dashboard/Charts/TransactionsTypes";
import BalanceEvolution from "@/components/dashboard/Charts/BalanceEvolution";

//hooks
import { getUserIdFromToken } from "@/utils/auth";

//services
import { getWallet } from "@/services/wallet/getWallet";
import { getProperties } from "@/services/properties/getProperties";
import { getFinancialTransactions } from "@/services/financialTransactions/getFinancialTransactions";
import { getInvestments } from "@/services/investments/getInvestments";

export default function DashboardPage() {
  const userId = getUserIdFromToken();

  const {
    data: wallet,
    isLoading: loadingWallet,
    error: errorWallet,
  } = useQuery({
    queryKey: ["wallet", userId],
    queryFn: () => getWallet(userId),
    enabled: !!userId,
  });

  const {
    data: properties,
    isLoading: loadingProperties,
    error: errorProperties,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });

  const {
    data: transactions,
    isLoading: loadingTransactions,
    error: errorTransactions,
  } = useQuery({
    queryKey: ["financialTransactions", userId],
    queryFn: () => getFinancialTransactions(userId),
    enabled: !!userId,
  });
  const {
    data: investments,
    isLoading: loadingInvestments,
    error: errorInvestments,
  } = useQuery({
    queryKey: ["investments", userId],
    queryFn: () => getInvestments(userId),
    enabled: !!userId,
  });

  const loading = loadingWallet || loadingProperties || loadingTransactions;
  const error =
    errorWallet?.response?.data?.message ||
    errorWallet?.message ||
    errorProperties?.response?.data?.message ||
    errorProperties?.message ||
    errorTransactions?.response?.data?.message ||
    errorTransactions?.message ||
    errorInvestments?.response?.data?.message ||
    errorInvestments?.message ||
    null;

  return (
    <div className="px-4 py-3">
      {loading && (
        <div className="d-flex justify-content-center align-items-center h-full mb-4 ">
          <CgSpinner className="fa fa-spin text-dark" size={50} />
        </div>
      )}
    
      {wallet && (
        <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-xl-4  mb-4 mb-xl-0">
            <WalletBallance />
          </div>
          <div className="col-xl-4  mb-4 mb-xl-0">
            <WalletBlocked />
          </div>
          <div className="col-xl-4 ">
            <WalletTokenized />
          </div>
          <div className="col-xl-6 mt-4">
            <TransactionsTypes transactions={transactions} />
          </div>
          <div className="col-xl-6 mt-4">
            <BalanceEvolution investments={investments} />
            </div>
          <div className="col-xl-5 mt-4">
            <RecentTransactions transactions={transactions} />
          </div>
          <div className="col-xl-7 mt-4">
            <Shortcuts />
          </div>
        </div>
      </div>
      )}
    </div>

  );
}
