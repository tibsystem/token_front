import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// components
import BreadCrumb from "@/components/breadcrumb/breadcrumb";
import OfferPageHeader from "@/components/p2p/new_offer/OfferPageHeader";
import PropertyFilters from "@/components/p2p/new_offer/PropertyFilters";
import PropertyGrid from "@/components/p2p/new_offer/PropertyGrid";
import CreateOfferModal from "@/components/p2p/new_offer/CreateOfferModal";
import LoadingState from "@/components/p2p/new_offer/LoadingState";
import EmptyState from "@/components/p2p/new_offer/EmptyState";
// utils
import { getUserIdFromToken } from "@/utils/auth"; 

// services
import { getInvestments } from "@/services/investments/getInvestments";

export default function NovaOfertaPage() {

  const [modalImovel, setModalImovel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("tokens");

  const userId = getUserIdFromToken();
  const {
    data: propriedades = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ["investments", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Usuário não autenticado.");
      const investments = await getInvestments(userId);
      const investimentos = Array.isArray(investments) ? investments : [investments].filter(Boolean);
      return investimentos.map((inv) => {
        const valorUnitario = (inv.tokensOriginal && inv.totalValue)
          ? Number(inv.totalValue) / Number(inv.tokensOriginal)
          : 0;
        const imageUrl = Array.isArray(inv.imageUrl) && inv.imageUrl.length > 0
          ? inv.imageUrl[0]
          : "/assets/img/default-property.jpg";
        return {
          id: inv.id,
          titulo: inv.title,
          descricao: inv.description,
          imagem_url: imageUrl,
          qtd_tokens: inv.tokensAvailable, 
          valor_unitario: valorUnitario, 
          investimento_id: inv.id,
        };
      });
    },
    enabled: !!userId,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);


  const propriedadesFiltradas = useMemo(() => {
    return [...propriedades]
      .filter(
        (imovel) =>
          imovel.titulo
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          imovel.descricao
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "price":
            return (b.valor_unitario || 0) - (a.valor_unitario || 0);
          case "name":
            return (a.titulo || "").localeCompare(b.titulo || "");
          case "tokens":
          default:
            return (b.qtd_tokens || 0) - (a.qtd_tokens || 0);
        }
      });
  }, [propriedades, debouncedSearchTerm, sortBy]);

  const totalTokensDisponiveis = useMemo(() => {
    return propriedades.reduce(
      (total, imovel) => total + (imovel.qtd_tokens || 0),
      0
    );
  }, [propriedades]);

  const abrirModal = (imovel) => setModalImovel(imovel);
  const fecharModal = () => setModalImovel(null);
  const handleOfferCreated = () => {
    fecharModal();
    refetch();
  };

  return (
    <div className="py-4">
      <BreadCrumb
        items={[
          { label: "P2P", path: "#" },
          { label: "Nova Oferta", path: "/p2p/new_offer" },
        ]}
      />
      <OfferPageHeader totalTokens={totalTokensDisponiveis} />

      {loading && <LoadingState />}

      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && propriedades.length === 0 && <EmptyState />}

      {!loading && !error && propriedades.length > 0 && (
        <>
          <PropertyFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            debouncedSearchTerm={debouncedSearchTerm}
            filteredCount={propriedadesFiltradas.length}
            totalCount={propriedades.length}
          />
          <PropertyGrid
            propriedades={propriedadesFiltradas}
            onAbrirModal={abrirModal}
            searchTerm={debouncedSearchTerm}
            onClearFilters={() => {
              setSearchTerm("");
              setSortBy("tokens");
            }}
          />
        </>
      )}

      {modalImovel && (
        <CreateOfferModal
          imovel={modalImovel}
          onClose={fecharModal}
          onSuccess={handleOfferCreated}
          getUserIdFromToken={getUserIdFromToken}
        />
      )}
    </div>
  );
}
