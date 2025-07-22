/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getInvestors } from "@/services/investors/getInvestors";
import Breadcrumb from "../../../components/breadcrumb/breadcrumb";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ImSpinner8 } from "react-icons/im";
import DataTable from "@/components/table/DataTable";
import Column from "@/components/table/Column";
import { FaEye } from "react-icons/fa";

const Investidores = () => {
  const [investidores, setInvestidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestidores = async () => {
      try {
        const response = await getInvestors();
        setInvestidores(response);
      } catch (err) {
        console.error("Erro ao buscar investidores:", err, err?.response);
        setError("Erro ao carregar investidores.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvestidores();
  }, []);

  if (loading)
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImSpinner8
          className="fa fa-spin me-2 mb-2 text-dark"
          style={{ fontSize: 32 }}
        />
      </div>
    );
  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );

  return (
    <div className="p-4 max-w-6xl">
      <Breadcrumb
        items={[{ label: "Investidores", path: "/admin/investors" }]}
        className="mb-4"
      />
      <h1 className="text-3xl font-bold mb-8 text-dark">Investidores</h1>
      {investidores.length === 0 ? (
        <div className="text-gray-500">Nenhum investidor cadastrado.</div>
      ) : (
        <div className=" card mb-8">
          <DataTable
            value={investidores}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sortMode="multiple"
            tableStyle={{ minWidth: "60rem" }}
            showGridlines
          >
            <Column field="id" header="ID" style={{ width: "10%" }} />
            <Column field="name" header="Nome" style={{ width: "25%" }} />
            <Column field="email" header="Email" style={{ width: "25%" }} />
            <Column field="phone" header="Telefone" style={{ width: "20%" }} />

            <Column
              field="actions"
              header="Ações"
              style={{ width: "10%", textAlign: "center" }}
              body={(row) => (
                <div className="d-flex justify-content-center align-items-center">
                  <Link
                    href={`/admin/investors/${row.id}`}
                    className="btn btn-outline-success btn-sm"
                  >
                    <FaEye />
                  </Link>
                </div>
              )}
            />
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default Investidores;
