import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaExclamationTriangle, FaPills, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Modal from '../Modal';

const MedicineStock = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    manufacturer: "",
    expirationDate: ""
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/medicines");
      setMedicines(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar medicamentos:", err);
      setError("Não foi possível carregar o estoque de medicamentos.");
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    const [year, month, day] = expirationDate.split("-").map(Number);
    const expDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expDate < today;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setEditingMedicine(null);
    setFormData({
      name: "",
      brand: "",
      manufacturer: "",
      expirationDate: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name || "",
      brand: medicine.brand || "",
      manufacturer: medicine.manufacturer || "",
      expirationDate: medicine.expirationDate || ""
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check required fields
    if (!formData.name.trim() || !formData.brand.trim() || !formData.manufacturer.trim() || !formData.expirationDate) {
      toast.error("Todos os campos são de preenchimento obrigatório!");
      return;
    }

    try {
      setIsSaving(true);
      if (editingMedicine) {
        // Edit Mode (PUT)
        await axios.put(`http://localhost:3000/medicines/${editingMedicine.id}`, formData);
        toast.success("Medicamento atualizado com sucesso!");
      } else {
        // Add Mode (POST)
        await axios.post("http://localhost:3000/medicines", formData);
        toast.success("Medicamento cadastrado com sucesso!");
      }
      
      fetchMedicines();
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar medicamento:", err);
      toast.error("Ocorreu um erro ao salvar o medicamento. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Deseja realmente excluir o medicamento "${name}" do estoque?`);
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/medicines/${id}`);
      toast.success("Medicamento removido com sucesso!");
      fetchMedicines();
    } catch (err) {
      console.error("Erro ao excluir medicamento:", err);
      toast.error("Ocorreu um erro ao excluir o medicamento.");
    }
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    return (
      medicine.name?.toLowerCase().includes(search) ||
      medicine.brand?.toLowerCase().includes(search) ||
      medicine.manufacturer?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-2">
            <FaPills className="text-cyan-700 dark:text-cyan-300" />
            Controle de Estoque de Medicamentos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerencie o estoque de medicamentos e acompanhe as datas de validade.
          </p>
        </div>
        
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg transition-colors font-medium shadow-sm cursor-pointer"
        >
          <FaPlus size={14} />
          Cadastrar Medicamento
        </button>
      </div>

      {/* Barra de busca */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <div className="relative w-full sm:w-85">
          <input
            type="text"
            placeholder="Buscar por nome, marca ou fabricante..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-colors"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchTerm ? "Nenhum medicamento encontrado para essa busca." : "Nenhum medicamento cadastrado no estoque."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <th className="p-4">Nome</th>
                <th className="p-4">Marca</th>
                <th className="p-4">Fabricante</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
              {filteredMedicines.map((medicine) => {
                const expired = isExpired(medicine.expirationDate);
                return (
                  <tr
                    key={medicine.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                      expired ? 'bg-red-50/40 dark:bg-red-950/10' : ''
                    }`}
                  >
                    <td className="p-4 font-medium">{medicine.name}</td>
                    <td className="p-4">{medicine.brand}</td>
                    <td className="p-4">{medicine.manufacturer}</td>
                    <td className="p-4">{formatDate(medicine.expirationDate)}</td>
                    <td className="p-4 text-center font-medium">
                      {expired ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 animate-pulse">
                          <FaExclamationTriangle size={12} />
                          VENCIDO
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                          Ativo
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(medicine)}
                          className="p-2 text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(medicine.id, medicine.name)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cadastro/Edição Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold mb-4 text-cyan-700 dark:text-cyan-400">
          {editingMedicine ? "Editar Medicamento" : "Cadastrar Novo Medicamento"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do Medicamento *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Marca *
            </label>
            <input
              type="text"
              name="brand"
              id="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fabricante *
            </label>
            <input
              type="text"
              name="manufacturer"
              id="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Vencimento *
            </label>
            <input
              type="date"
              name="expirationDate"
              id="expirationDate"
              value={formData.expirationDate}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-600 outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button 
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicineStock;
