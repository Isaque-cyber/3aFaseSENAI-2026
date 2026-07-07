import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { FaUserAlt, FaFilter, FaExclamationTriangle } from 'react-icons/fa'
import { Link } from "react-router"
import { daysUntil } from "../../utils/date"

const PatientsList = () => {
    const [patients, setPatients] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [ages, setAges] = useState({})

    // ---- Feature: Busca avançada (convênio, alergias, telefone) ----
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [advancedFilters, setAdvancedFilters] = useState({
        healthInsurance: "",
        allergies: "",
        phone: "",
    })

    const handleAdvancedChange = (event) => {
        const { name, value } = event.target
        setAdvancedFilters((prev) => ({ ...prev, [name]: value }))
    }

    const clearAdvancedFilters = () => {
        setAdvancedFilters({ healthInsurance: "", allergies: "", phone: "" })
    }

    // lista de convênios únicos cadastrados, para popular o <select>
    const insuranceOptions = useMemo(() => {
        const values = patients
            .map((p) => p.healthInsurance)
            .filter(Boolean)
        return [...new Set(values)]
    }, [patients])

    const hasActiveAdvancedFilters = Object.values(advancedFilters).some((v) => v.trim() !== "")

    const calculateAge = (birthdate) => {
        if (!birthdate) return "-"
        const today = new Date()
        const birthdateDate = new Date(birthdate)
        let age = today.getFullYear() - birthdateDate.getFullYear()
        const monthDiff = today.getMonth() - birthdateDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateDate.getDate())) {
            age--
        }
        return age
    }

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:3000/patients")
                if (!response) return

                const patientsData = response.data

                // calcula a idade de cada paciente e armazena no estado

                const calculatedAges = {}
                patientsData.forEach((patient) => {
                    calculatedAges[patient.id] = calculateAge(patient.birthdate)
                })
                setAges(calculatedAges)
                setPatients(patientsData)

            } catch (error) {
                console.error("Erro ao obter os dados de paciente", error)
            }
        }
        fetchPatients()
    }, [])

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const filteredPatients = patients
        .filter((patient) =>
            [patient.fullName, patient.email, patient.phone]
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .filter((patient) =>
            advancedFilters.healthInsurance
                ? patient.healthInsurance === advancedFilters.healthInsurance
                : true
        )
        .filter((patient) =>
            advancedFilters.allergies
                ? (patient.allergies || "")
                      .toLowerCase()
                      .includes(advancedFilters.allergies.toLowerCase())
                : true
        )
        .filter((patient) =>
            advancedFilters.phone
                ? (patient.phone || "").replace(/\D/g, "").includes(
                      advancedFilters.phone.replace(/\D/g, "")
                  )
                : true
        )


    return (
        <div className="bg-white shadow rounded-2xl p-6 mt-8">
            <h2 className="text-xl font-semibold text-cyan-800 mb-4">
                Informações Rápidas de Pacientes
            </h2>

            {/* Campo de busca */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <label htmlFor="search" className="text-gray-700 font-medium">
                    Buscar Paciente:
                </label>
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Digite o nome, email ou telefone"
                        className="border rounded-lg px-3 py-2 w-full sm:w-80 focus:ring-2 focus:ring-cyan-600 outline-none"

                    />
                    <button
                        type="button"
                        onClick={() => setShowAdvanced((prev) => !prev)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border whitespace-nowrap transition ${
                            hasActiveAdvancedFilters
                                ? "bg-cyan-700 text-white border-cyan-700"
                                : "bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50"
                        }`}
                    >
                        <FaFilter size={14} />
                        Busca avançada
                    </button>
                </div>
            </div>

            {/* Painel de busca avançada: filtra por convênio, alergias e telefone */}
            {showAdvanced && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label htmlFor="filter-insurance" className="block text-xs font-medium text-gray-600 mb-1">
                            Convênio
                        </label>
                        <select
                            id="filter-insurance"
                            name="healthInsurance"
                            value={advancedFilters.healthInsurance}
                            onChange={handleAdvancedChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                        >
                            <option value="">Todos</option>
                            {insuranceOptions.map((insurance) => (
                                <option key={insurance} value={insurance}>
                                    {insurance}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="filter-allergies" className="block text-xs font-medium text-gray-600 mb-1">
                            Alergias
                        </label>
                        <input
                            type="text"
                            id="filter-allergies"
                            name="allergies"
                            value={advancedFilters.allergies}
                            onChange={handleAdvancedChange}
                            placeholder="Ex: dipirona"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="filter-phone" className="block text-xs font-medium text-gray-600 mb-1">
                            Telefone
                        </label>
                        <input
                            type="text"
                            id="filter-phone"
                            name="phone"
                            value={advancedFilters.phone}
                            onChange={handleAdvancedChange}
                            placeholder="Ex: 48999999999"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                        />
                    </div>

                    {hasActiveAdvancedFilters && (
                        <div className="sm:col-span-3 flex justify-end">
                            <button
                                type="button"
                                onClick={clearAdvancedFilters}
                                className="text-sm text-cyan-700 hover:underline"
                            >
                                Limpar filtros avançados
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Lista de pacientes */}

            {
                filteredPatients.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {
                            filteredPatients.map((patient) => (
                                <li
                                    key={patient.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-cyan-100 text-cyan-700 p-3 rounded-full">
                                            <FaUserAlt size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{patient.fullName}</p>
                                            <p className="text-sm text-gray-600">{patient.email}</p>
                                            <p className="text-sm text-gray-600">{patient.phone}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 mt-2 sm:mt-0 text-right">
                                        <p><strong>Idade:</strong>{ages[patient.id] || "-"} anos</p>
                                        <p className="flex items-center justify-end gap-1">
                                            <strong>Plano:</strong>{patient.healthInsurance || "-"}
                                            {(() => {
                                                const remaining = daysUntil(patient.insuranceValidity)
                                                if (remaining === null) return null
                                                if (remaining < 0) {
                                                    return (
                                                        <span title="Convênio vencido" className="text-red-600">
                                                            <FaExclamationTriangle size={12} />
                                                        </span>
                                                    )
                                                }
                                                if (remaining <= 30) {
                                                    return (
                                                        <span title={`Convênio vence em ${remaining} dia(s)`} className="text-amber-500">
                                                            <FaExclamationTriangle size={12} />
                                                        </span>
                                                    )
                                                }
                                                return null
                                            })()}
                                        </p>
                                        <Link
                                            to={`/paciente/${patient.id}`}
                                            className="text-cyan-700 font-semibold hover:underline"
                                        >
                                            Ver detalhes
                                        </Link>
                                    </div>

                                </li>
                            ))

                        }
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-6">
                        Nenhum paciente encontrado
                    </p>
                )
            }

        </div>
    )
}

export default PatientsList