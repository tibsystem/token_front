
import { useState } from "react";
import { toast } from 'react-toastify';
//icons
import { FaCheckCircle, FaUser } from "react-icons/fa";
import { MdDocumentScanner, MdEmail,MdPhone } from "react-icons/md";
//components
import { TabView, TabPanel } from '@/components/Tab/Panel';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
// services
import {postRaisers} from '@/services/raisers/postRaisers';


export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
  });

  function maskPhone(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    value = value.substring(0, 15);
    return value;
  }

  function maskDocument(value) {
    value = value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      value = value.substring(0, 14);
    } else {
      value = value.replace(/(\d{2})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1/$2");
      value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
      value = value.substring(0, 18);
    }
    return value;
  }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postRaisers(form);
      toast.success("Captador cadastrado com sucesso!");
      setForm({
        name: "",
        email: "",
        phone: "",
        document: "",
      });
    } catch (error) {
      toast.error("Erro ao cadastrar captador.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <ProtectedRoute>
       <Breadcrumb 
              items={[{ label: 'Captadores', path: '/admin/raisers', },
                { label: 'Cadastrar Captador', path: '/admin/raisers/register' }
              ]} 
              className="mb-4" />
    <div className="container max-w-5xl mx-auto mt-8 p-4">
      <TabView>
        <TabPanel header={<><FaUser /> Cadastro de Captador</>}>
          <div className=" animate__animated animate__fadeIn">     
            <form onSubmit={handleSubmit} className="row g-4">
              <div className="col-md-12">
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="nome"
                    placeholder="Nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <label htmlFor="nome"><FaUser className="me-2" /> Nome</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <label htmlFor="email"><MdEmail className="me-2" /> Email</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    id="phone"
                    placeholder="Telefone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
                    required
                  />
                  <label htmlFor="phone"><MdPhone className="me-2" /> Telefone</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control"
                    name="document"
                    id="document"
                    placeholder="Documento"
                    value={form.document}
                    onChange={(e) => setForm({ ...form, document: maskDocument(e.target.value) })}
                    required
                  />
                  <label htmlFor="document"><MdDocumentScanner className="me-2" /> CPF ou CNPJ</label>
                </div>
              </div>
              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <FaCheckCircle />
                  )}
                  {loading ? "Cadastrando..." : "Cadastrar Captador"}
                </button>
              </div>
            </form>
          </div>
        </TabPanel>

      </TabView>
    </div>
  </ProtectedRoute>
  );
}