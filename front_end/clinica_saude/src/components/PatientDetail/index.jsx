import React, { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaSortAmountDown, FaSortAmountUp, FaFilePdf } from 'react-icons/fa'
import { parseDateTime, daysUntil, formatDateBR } from '../../utils/date'

const PatientDetails = () => {
    const { id } = useParams()
    const [patient, setPatient] = useState({})
    const [consults, setConsults] = useState([])
    const [exams, setExams] = useState([])

    // ---- Feature: Ordenação de consultas e exames por data ----
    const [consultsOrder, setConsultsOrder] = useState('desc') // mais recentes primeiro
    const [examsOrder, setExamsOrder] = useState('desc')

    // ---- Feature: Exportar PDF do prontuário ----
    const printAreaRef = useRef(null)
    const handleExportPdf = () => {
        // Sem dependências externas: usamos a impressão nativa do navegador
        // (com CSS exclusivo de impressão) para que o usuário escolha
        // "Salvar como PDF" no diálogo de impressão.
        window.print()
    }

    const [editingConsult, setEditingConsult] = useState(null)
    const [editConsultData, setEditConsultData] = useState({
        reason: '',
        date: '',
        time: '',
        description: '',
        medication: '',
        dosagePrecautions: '',
    })
    const [isEditingConsult, setIsEditingConsult] = useState(false)

    const [editingExam, setEditingExam] = useState(null)
    const [editExamData, setEditExamData] = useState({
        name: '',
        date: '',
        time: '',
        type: '',
        laboratory: '',
        documentUrl: '',
        results: '',
    })
    const [isEditingExam, setIsEditingExam] = useState(false)

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientRes = await axios.get(`http://localhost:3000/patients/${id}`)

                // Buscamos a coleção inteira e filtramos no front-end em vez de usar
                // `?patientId=${id}` na query string: o json-server 1.0.0-beta (a
                // versão usada neste projeto) mudou a sintaxe de filtro entre as
                // betas (passou a exigir "campo:eq=valor"), então o filtro antigo
                // baseado em "?campo=valor" não é confiável nessa versão. Filtrar
                // no cliente funciona sempre, independente da versão do json-server.
                const [consultsRes, examsRes] = await Promise.all([
                    axios.get('http://localhost:3000/consults'),
                    axios.get('http://localhost:3000/exams'),
                ])

                const patientConsults = consultsRes.data.filter(
                    (c) => String(c.patientId) === String(id)
                )
                const patientExams = examsRes.data.filter(
                    (e) => String(e.patientId) === String(id)
                )

                setPatient(patientRes.data)
                setConsults(patientConsults)
                setExams(patientExams)
            } catch (error) {
                console.error('Erro ao obter os detalhes do paciente:', error)
            }
        }

        fetchPatientDetails()
    }, [id])

    const handleEditConsult = (consult) => {
        setEditingConsult(consult)
        setEditConsultData({
            reason: consult.reason,
            date: consult.date,
            time: consult.time,
            description: consult.description,
            medication: consult.medication,
            dosagePrecautions: consult.dosagePrecautions,
        })
        setIsEditingConsult(true)
    }

    const handleUpdateConsult = async (e) => {
        e.preventDefault()
        try {
            if (!editingConsult) return

            const updatedConsult = {
                ...editingConsult,
                ...editConsultData,
            }

            await axios.put(`http://localhost:3000/consults/${editingConsult.id}`, updatedConsult)
            setConsults((prev) =>
                prev.map((c) => (c.id === editingConsult.id ? updatedConsult : c))
            )

            toast.success('Consulta atualizada com sucesso!')
            setIsEditingConsult(false)
            setEditingConsult(null)
        } catch {
            toast.error('Erro ao atualizar a consulta!')
        }
    }

    const handleDeleteConsult = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/consults/${id}`)
            setConsults((prev) => prev.filter((c) => c.id !== id))
            toast.success('Consulta excluída com sucesso!')
        } catch {
            toast.error('Erro ao excluir consulta!')
        }
    }

    const handleEditExam = (exam) => {
        setEditingExam(exam)
        setEditExamData({
            name: exam.name,
            date: exam.date,
            time: exam.time,
            type: exam.type,
            laboratory: exam.laboratory,
            documentUrl: exam.documentUrl,
            results: exam.results,
        })
        setIsEditingExam(true)
    }

    const handleUpdateExam = async (e) => {
        e.preventDefault()
        try {
            if (!editingExam) return

            const updatedExam = {
                ...editingExam,
                ...editExamData,
            }

            await axios.put(`http://localhost:3000/exams/${editingExam.id}`, updatedExam)
            setExams((prev) =>
                prev.map((exam) => (exam.id === editingExam.id ? updatedExam : exam))
            )

            toast.success('Exame atualizado com sucesso!')
            setIsEditingExam(false)
            setEditingExam(null)
        } catch {
            toast.error('Erro ao atualizar o exame!')
        }
    }

    const handleDeleteExam = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/exams/${id}`)
            setExams((prev) => prev.filter((e) => e.id !== id))
            toast.success('Exame excluído com sucesso!')
        } catch {
            toast.error('Erro ao excluir o exame!')
        }
    }

    const sortedConsults = useMemo(() => {
        const list = [...consults]
        list.sort((a, b) => {
            const dateA = parseDateTime(a.date, a.time)
            const dateB = parseDateTime(b.date, b.time)
            if (!dateA || !dateB) return 0
            return consultsOrder === 'asc' ? dateA - dateB : dateB - dateA
        })
        return list
    }, [consults, consultsOrder])

    const sortedExams = useMemo(() => {
        const list = [...exams]
        list.sort((a, b) => {
            const dateA = parseDateTime(a.date, a.time)
            const dateB = parseDateTime(b.date, b.time)
            if (!dateA || !dateB) return 0
            return examsOrder === 'asc' ? dateA - dateB : dateB - dateA
        })
        return list
    }, [exams, examsOrder])

    const insuranceDaysLeft = useMemo(() => daysUntil(patient.insuranceValidity), [patient.insuranceValidity])

    if (!patient) return <p>Carregando...</p>

    return (
        <section id="prontuario-print-area" ref={printAreaRef} className="p-6 max-w-5xl mx-auto">
            {/* Barra de ações - some na impressão */}
            <div className="flex justify-end mb-4 print:hidden">
                <button
                    onClick={handleExportPdf}
                    className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg transition"
                >
                    <FaFilePdf size={16} />
                    Exportar PDF do prontuário
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 print-record-section">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{patient.fullName}</h2>
                <p><span className="font-semibold">Convênio:</span> {patient.healthInsurance}</p>
                {insuranceDaysLeft !== null && (
                    <p className={`text-sm ${insuranceDaysLeft < 0 ? 'text-red-600' : insuranceDaysLeft <= 30 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {insuranceDaysLeft < 0
                            ? `Convênio vencido em ${formatDateBR(patient.insuranceValidity)}`
                            : `Convênio válido até ${formatDateBR(patient.insuranceValidity)}${insuranceDaysLeft <= 30 ? ` (vence em ${insuranceDaysLeft} dia(s))` : ''}`}
                    </p>
                )}
                <p><span className="font-semibold">Alergias:</span> {patient.allergies}</p>
            </div>

            {/* Consultas */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 print-record-section">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">Histórico de Consultas</h3>
                    <button
                        type="button"
                        onClick={() => setConsultsOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                        className="print:hidden flex items-center gap-2 text-sm text-cyan-700 hover:underline"
                    >
                        {consultsOrder === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                        {consultsOrder === 'asc' ? 'Mais antigas primeiro' : 'Mais recentes primeiro'}
                    </button>
                </div>

                {isEditingConsult ? (
                    <form onSubmit={handleUpdateConsult} className="space-y-4">
                        {Object.keys(editConsultData).map((key) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                                    {key === 'dosagePrecautions'
                                        ? 'Dosagem e Precauções'
                                        : key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <input
                                    type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                                    value={editConsultData[key]}
                                    onChange={(e) =>
                                        setEditConsultData({ ...editConsultData, [key]: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                        ))}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Salvar
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingConsult(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : consults.length === 0 ? (
                    <p className="text-gray-500">Nenhuma consulta encontrada.</p>
                ) : (
                    sortedConsults.map((c) => (
                        <div
                            key={c.id}
                            className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <p><strong>Consulta:</strong> {c.reason}</p>
                            <p><strong>Data:</strong> {c.date} - {c.time}</p>
                            <p><strong>Descrição:</strong> {c.description}</p>
                            <p><strong>Medicação:</strong> {c.medication}</p>
                            <p><strong>Dosagem e Precauções:</strong> {c.dosagePrecautions}</p>
                            <div className="flex gap-3 mt-3 print:hidden">
                                <button
                                    onClick={() => handleEditConsult(c)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteConsult(c.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Exames */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 print-record-section">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">Histórico de Exames</h3>
                    <button
                        type="button"
                        onClick={() => setExamsOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                        className="print:hidden flex items-center gap-2 text-sm text-cyan-700 hover:underline"
                    >
                        {examsOrder === 'asc' ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                        {examsOrder === 'asc' ? 'Mais antigos primeiro' : 'Mais recentes primeiro'}
                    </button>
                </div>

                {isEditingExam ? (
                    <form onSubmit={handleUpdateExam} className="space-y-4">
                        {Object.keys(editExamData).map((key) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                                    {key === 'documentUrl'
                                        ? 'URL do Documento'
                                        : key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                {key === 'results' ? (
                                    <textarea
                                        value={editExamData[key]}
                                        onChange={(e) =>
                                            setEditExamData({ ...editExamData, [key]: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        rows="3"
                                        required
                                    />
                                ) : (
                                    <input
                                        type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                                        value={editExamData[key]}
                                        onChange={(e) =>
                                            setEditExamData({ ...editExamData, [key]: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required={key !== 'documentUrl'}
                                    />
                                )}
                            </div>
                        ))}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Salvar
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingExam(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : exams.length === 0 ? (
                    <p className="text-gray-500">Nenhum exame encontrado.</p>
                ) : (
                    sortedExams.map((exam) => (
                        <div
                            key={exam.id}
                            className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <p><strong>Exame:</strong> {exam.name}</p>
                            <p><strong>Data:</strong> {exam.date} - {exam.time}</p>
                            <p><strong>Tipo:</strong> {exam.type}</p>
                            <p><strong>Laboratório:</strong> {exam.laboratory}</p>
                            <p><strong>Documento:</strong> {exam.documentUrl}</p>
                            <p><strong>Resultados:</strong> {exam.results}</p>
                            <p><strong>Status:</strong>{" "}<span
                                className={
                                    exam.status === "Concluído"
                                        ? "text-green-600 font-semibold"
                                        : exam.status === "Cancelado"
                                            ? "text-red-600 font-semibold"
                                            : "text-yellow-600 font-semibold"
                                }
                            >
                                {exam.status}
                            </span>
                            </p>
                            <div className="flex gap-3 mt-3 print:hidden">
                                <button
                                    onClick={() => handleEditExam(exam)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteExam(exam.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
        </section>
    )
}

export default PatientDetails
