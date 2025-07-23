import { useEffect, useState, useMemo, useCallback } from "react";
import { getInvestments } from "@/services/investments/getInvestments";
import BreadCrumb from "@/components/breadcrumb/breadcrumb";
import OfferPageHeader from "@/components/p2p/new_offer/OfferPageHeader";
import PropertyFilters from "@/components/p2p/new_offer/PropertyFilters";
import PropertyGrid from "@/components/p2p/new_offer/PropertyGrid";
import CreateOfferModal from "@/components/p2p/new_offer/CreateOfferModal";
import LoadingState from "@/components/p2p/new_offer/LoadingState";
import EmptyState from "@/components/p2p/new_offer/EmptyState";
import { getUserIdFromToken } from "@/utils/auth"; 

export default function NovaOfertaPage() {
  const [propriedades, setPropriedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImovel, setModalImovel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("tokens");

  const fetchPropriedades = useCallback(async () => {
    setLoading(true);
    setError(null);
    const userId = getUserIdFromToken();
    if (!userId) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }
    try {
      const investments = await getInvestments(userId);
      const investimentos = Array.isArray(investments) ? investments : [investments].filter(Boolean);
      const propriedadesFormatadas = investimentos.map((inv) => {
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
      setPropriedades(propriedadesFormatadas);
    } catch (err) {
      console.error("Erro ao carregar investimentos:", err);
      setError("Erro ao carregar seus investimentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPropriedades();
  }, [fetchPropriedades]);

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
    fetchPropriedades();
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