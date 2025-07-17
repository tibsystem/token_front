import { useEffect, useState } from "react";
import { getRaisers } from "@/services/raisers/getRaisers";
import { getSmartContractModel } from "@/services/SmartContract/getSmartContractModel";
import { version } from "os";

export default function UseOptionsSelect() {
  const [optionsRaiser, setOptionsRaiser] = useState([]);
  const [optionsSmartContract, setOptionsSmartContract] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRaisers() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRaisers();
        const opts = data.map((raiser) => ({
          value: raiser.id,
          label: raiser.name,
        }));
        setOptionsRaiser(opts);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRaisers();
  }, []);

  useEffect(() => {
    async function fetchSmartContractModel() {
      setLoading(true);
      setError(null);

      try {
        const response = await getSmartContractModel();
        const opts = response.data.map((model) => ({
          id: model.id,
          name: model.name,
          description: model.description,
          type: model.type,
          version: model.version,
          createdAt: model.created_at,
          updatedAt: model.updated_at,
        }));
        console.log("Smart Contract Options:", opts);
        setOptionsSmartContract(opts);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSmartContractModel();
  }, []);

  return { optionsRaiser, optionsSmartContract, loading, error };
}
