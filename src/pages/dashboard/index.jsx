import { useQuery } from "@tanstack/react-query";
import { getWallet } from "@/services/wallet/getWallet";
import { getProperties } from "@/services/properties/getProperties";
import BreadCrumb from "@/components/breadcrumb/breadcrumb";
import { getUserIdFromToken } from "@/utils/auth";
import { CgSpinner } from "react-icons/cg";
import WalletBallance from '@/components/Wallet/Cards/Walletbalance';
import WalletBlocked from "@/components/Wallet/Cards/WalletBlocked";
import WalletTokenized from "@/components/Wallet/Cards/WalletTokenized";
import Shortcuts from "../../components/dashboard/Shortcuts";

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

  const loading = loadingWallet || loadingProperties;
  const error =
    errorWallet?.response?.data?.message ||
    errorWallet?.message ||
    errorProperties?.response?.data?.message ||
    errorProperties?.message ||
    null;

  return (
    <div className="px-4 py-3">
      {loading && (
        <div className="d-flex justify-content-center align-items-center h-full mb-4 ">
          <CgSpinner className="fa fa-spin text-dark" size={50} />
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Erro: {error}
        </div>
      )}
      {wallet && (
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
          <div className="col-12 mt-4">
            {/* <Shortcuts /> */}
            </div>

        </div>
      )}
    </div>
  );
}
