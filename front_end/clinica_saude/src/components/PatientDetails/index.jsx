import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router";
import { toast } from "react-toastify";
import { FaStar, FaRegStar } from "react-icons/fa";
import jsPDF from "jspdf";

const PatientDetails = () => {

    const { id } = useParams();

    // =========================
    // Estados principais
    // =========================
    const [patient, setPatient] = useState(null);
    const [consults, setConsults] = useState([]);
    const [exams, setExams] = useState([]);

    // =========================
    // Ordenação
    // =========================
    const [consultOrder, setConsultOrder] = useState("recent");
    const [examOrder, setExamOrder] = useState("recent");

    // =========================
    // Favorito
    // =========================
    const [favorite, setFavorite] = useState(false);

    // =========================
    // Edição Consulta
    // =========================
    const [editingConsult, setEditingConsult] = useState(null);
    const [editConsultData, setEditConsultData] = useState({
        reason: "",
        date: "",
        time: "",
        description: "",
        medication: "",
        dosagePrecautions: "",
    });
    const [isEditingConsult, setIsEditingConsult] = useState(false);

    // =========================
    // Edição Exame
    // =========================
    const [editingExam, setEditingExam] = useState(null);
    const [editExamData, setEditExamData] = useState({
        name: "",
        date: "",
        time: "",
        type: "",
        laboratory: "",
        documentUrl: "",
        results: "",
    });
    const [isEditingExam, setIsEditingExam] = useState(false);

    // =========================
    // Buscar dados
    // Correção: json-server v1 beta não filtra por ?patientId=
    // então buscamos tudo e filtramos no frontend
    // =========================
    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientRes = await axios.get(
                    `http://localhost:3000/patients/${id}`
                );
                const consultsRes = await axios.get(
                    `http://localhost:3000/consults`
                );
                const examsRes = await axios.get(
                    `http://localhost:3000/exams`
                );

                const filteredConsults = consultsRes.data.filter(
                    (c) => c.patientId === id
                );
                const filteredExams = examsRes.data.filter(
                    (e) => e.patientId === id
                );

                setPatient(patientRes.data);
                setConsults(filteredConsults);
                setExams(filteredExams);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar prontuário.");
            }
        };
        fetchPatientDetails();
    }, [id]);

    // =========================
    // Favoritos (carregar)
    // =========================
    useEffect(() => {
        const favorites =
            JSON.parse(localStorage.getItem("favoritePatients")) || [];
        setFavorite(favorites.includes(id));
    }, [id]);

    // =========================
    // Favoritar / desfavoritar
    // =========================
    const toggleFavorite = () => {
        let favorites =
            JSON.parse(localStorage.getItem("favoritePatients")) || [];

        if (favorites.includes(id)) {
            favorites = favorites.filter((item) => item !== id);
            setFavorite(false);
            toast.info("Paciente removido dos favoritos.");
        } else {
            favorites.push(id);
            setFavorite(true);
            toast.success("Paciente adicionado aos favoritos!");
        }

        localStorage.setItem("favoritePatients", JSON.stringify(favorites));
    };

    // =========================
    // Ordenação Consultas
    // =========================
    const orderedConsults = [...consults].sort((a, b) => {
        const parseDate = (dateStr, timeStr) => {
            if (!dateStr) return new Date(0);
            let iso = dateStr;
            if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
                const [d, m, y] = dateStr.split("-");
                iso = `${y}-${m}-${d}`;
            }
            return new Date(`${iso}T${timeStr || "00:00"}`);
        };
        const dateA = parseDate(a.date, a.time);
        const dateB = parseDate(b.date, b.time);
        return consultOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

    // =========================
    // Ordenação Exames
    // =========================
    const orderedExams = [...exams].sort((a, b) => {
        const parseDate = (dateStr, timeStr) => {
            if (!dateStr) return new Date(0);
            let iso = dateStr;
            if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
                const [d, m, y] = dateStr.split("-");
                iso = `${y}-${m}-${d}`;
            }
            return new Date(`${iso}T${timeStr || "00:00"}`);
        };
        const dateA = parseDate(a.date, a.time);
        const dateB = parseDate(b.date, b.time);
        return examOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

    // =========================
    // Editar consulta
    // =========================
    const handleEditConsult = (consult) => {
        setEditingConsult(consult);
        setEditConsultData({
            reason: consult.reason,
            date: consult.date,
            time: consult.time,
            description: consult.description,
            medication: consult.medication,
            dosagePrecautions: consult.dosagePrecautions,
        });
        setIsEditingConsult(true);
    };

    const handleUpdateConsult = async (e) => {
        e.preventDefault();
        try {
            if (!editingConsult) return;
            const updatedConsult = { ...editingConsult, ...editConsultData };
            await axios.put(
                `http://localhost:3000/consults/${editingConsult.id}`,
                updatedConsult
            );
            setConsults((prev) =>
                prev.map((c) =>
                    c.id === editingConsult.id ? updatedConsult : c
                )
            );
            toast.success("Consulta atualizada com sucesso!");
            setIsEditingConsult(false);
            setEditingConsult(null);
        } catch {
            toast.error("Erro ao atualizar a consulta!");
        }
    };

    const handleDeleteConsult = async (consultId) => {
        try {
            await axios.delete(
                `http://localhost:3000/consults/${consultId}`
            );
            setConsults((prev) => prev.filter((c) => c.id !== consultId));
            toast.success("Consulta excluída com sucesso!");
        } catch {
            toast.error("Erro ao excluir consulta!");
        }
    };

    // =========================
    // Editar exame
    // =========================
    const handleEditExam = (exam) => {
        setEditingExam(exam);
        setEditExamData({
            name: exam.name,
            date: exam.date,
            time: exam.time,
            type: exam.type,
            laboratory: exam.laboratory,
            documentUrl: exam.documentUrl,
            results: exam.results,
        });
        setIsEditingExam(true);
    };

    const handleUpdateExam = async (e) => {
        e.preventDefault();
        try {
            if (!editingExam) return;
            const updatedExam = { ...editingExam, ...editExamData };
            await axios.put(
                `http://localhost:3000/exams/${editingExam.id}`,
                updatedExam
            );
            setExams((prev) =>
                prev.map((ex) =>
                    ex.id === editingExam.id ? updatedExam : ex
                )
            );
            toast.success("Exame atualizado com sucesso!");
            setIsEditingExam(false);
            setEditingExam(null);
        } catch {
            toast.error("Erro ao atualizar o exame!");
        }
    };

    const handleDeleteExam = async (examId) => {
        try {
            await axios.delete(`http://localhost:3000/exams/${examId}`);
            setExams((prev) => prev.filter((e) => e.id !== examId));
            toast.success("Exame excluído com sucesso!");
        } catch {
            toast.error("Erro ao excluir o exame!");
        }
    };

    // =========================
    // Exportar PDF
    // =========================
    const handleExportPDF = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 14;
        const lineH = 7;
        let y = 20;

        const checkPage = () => {
            if (y > 270) { pdf.addPage(); y = 20; }
        };

        pdf.setFontSize(18);
        pdf.setTextColor(0, 128, 128);
        pdf.text("Prontuário do Paciente", margin, y);
        y += 10;

        pdf.setFontSize(12);
        pdf.setTextColor(30, 30, 30);
        pdf.text(`Nome: ${patient.fullName || "-"}`, margin, y); y += lineH;
        pdf.text(`CPF: ${patient.cpf || "-"}`, margin, y); y += lineH;
        pdf.text(`Telefone: ${patient.phone || "-"}`, margin, y); y += lineH;
        pdf.text(`Email: ${patient.email || "-"}`, margin, y); y += lineH;
        pdf.text(`Convênio: ${patient.healthInsurance || "-"}`, margin, y); y += lineH;
        pdf.text(`Alergias: ${patient.allergies || "-"}`, margin, y); y += lineH;
        y += 4;

        pdf.setDrawColor(0, 128, 128);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 8;

        pdf.setFontSize(14);
        pdf.setTextColor(0, 128, 128);
        pdf.text("Histórico de Consultas", margin, y);
        y += 8;

        if (orderedConsults.length === 0) {
            pdf.setFontSize(11);
            pdf.setTextColor(100, 100, 100);
            pdf.text("Nenhuma consulta encontrada.", margin, y);
            y += lineH;
        } else {
            orderedConsults.forEach((c, i) => {
                checkPage();
                pdf.setFontSize(11);
                pdf.setTextColor(30, 30, 30);
                pdf.text(`${i + 1}. ${c.reason} — ${c.date} ${c.time}`, margin, y); y += lineH;
                pdf.text(`   Descrição: ${c.description || "-"}`, margin, y); y += lineH;
                pdf.text(`   Medicação: ${c.medication || "-"}`, margin, y); y += lineH;
                pdf.text(`   Dosagem/Precauções: ${c.dosagePrecautions || "-"}`, margin, y); y += lineH + 2;
            });
        }

        y += 4;
        pdf.setDrawColor(0, 128, 128);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 8;

        pdf.setFontSize(14);
        pdf.setTextColor(0, 128, 128);
        pdf.text("Histórico de Exames", margin, y);
        y += 8;

        if (orderedExams.length === 0) {
            pdf.setFontSize(11);
            pdf.setTextColor(100, 100, 100);
            pdf.text("Nenhum exame encontrado.", margin, y);
        } else {
            orderedExams.forEach((ex, i) => {
                checkPage();
                pdf.setFontSize(11);
                pdf.setTextColor(30, 30, 30);
                pdf.text(`${i + 1}. ${ex.name} — ${ex.date} ${ex.time}`, margin, y); y += lineH;
                pdf.text(`   Tipo: ${ex.type || "-"}`, margin, y); y += lineH;
                pdf.text(`   Laboratório: ${ex.laboratory || "-"}`, margin, y); y += lineH;
                pdf.text(`   Resultados: ${ex.results || "-"}`, margin, y); y += lineH + 2;
            });
        }

        pdf.save(`prontuario-${patient.fullName || "paciente"}.pdf`);
    };

    // =========================
    // Loading
    // =========================
    if (!patient) {
        return (
            <div className="p-6 text-gray-600">
                Carregando prontuário...
            </div>
        );
    }

    // =========================
    // RENDER
    // =========================
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">

            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <Link
                    to="/prontuarios"
                    className="text-cyan-700 font-semibold hover:underline"
                >
                    &larr; Voltar
                </Link>
                <button
                    onClick={handleExportPDF}
                    className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    Exportar PDF
                </button>
            </div>

            {/* Card do paciente */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">

                {/* Nome + favorito */}
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-cyan-800">
                        {patient.fullName}
                    </h2>
                    {/* Botão de favorito — estrela cheia se favorito, vazia se não */}
                    <button
                        onClick={toggleFavorite}
                        className="text-yellow-400 hover:scale-110 transition-transform"
                        title={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                        {favorite ? <FaStar size={22} /> : <FaRegStar size={22} />}
                    </button>
                </div>

                {/* Dados pessoais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                    <p><span className="font-semibold">CPF:</span> {patient.cpf}</p>
                    <p><span className="font-semibold">RG:</span> {patient.rg}</p>
                    <p><span className="font-semibold">Nascimento:</span> {patient.birthdate}</p>
                    <p><span className="font-semibold">Sexo:</span> {patient.gender}</p>
                    <p><span className="font-semibold">Telefone:</span> {patient.phone}</p>
                    <p><span className="font-semibold">Email:</span> {patient.email}</p>
                    <p><span className="font-semibold">Convênio:</span> {patient.healthInsurance}</p>
                    <p><span className="font-semibold">Nº Convênio:</span> {patient.insuranceNumber}</p>
                    <p><span className="font-semibold">Validade:</span> {patient.insuranceValidity}</p>
                    <p><span className="font-semibold">Estado Civil:</span> {patient.maritalStatus}</p>
                </div>

                {/* Alergias */}
                {patient.allergies && patient.allergies.trim() !== "" && (
                    <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3">
                        <span className="text-lg">⚠️</span>
                        <p className="text-sm font-semibold">
                            ATENÇÃO — Paciente possui alergias: {patient.allergies}
                        </p>
                    </div>
                )}
            </div>

            {/* Histórico de Consultas */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-cyan-700">
                        Histórico de Consultas
                    </h3>
                    {!isEditingConsult && consults.length > 0 && (
                        <select
                            value={consultOrder}
                            onChange={(e) => setConsultOrder(e.target.value)}
                            className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                        >
                            <option value="recent">Mais recentes</option>
                            <option value="oldest">Mais antigas</option>
                        </select>
                    )}
                </div>

                {isEditingConsult ? (
                    <form onSubmit={handleUpdateConsult} className="space-y-4">
                        {Object.keys(editConsultData).map((key) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                                    {key === "dosagePrecautions"
                                        ? "Dosagem e Precauções"
                                        : key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <input
                                    type={key.includes("date") ? "date" : key.includes("time") ? "time" : "text"}
                                    value={editConsultData[key]}
                                    onChange={(e) =>
                                        setEditConsultData({ ...editConsultData, [key]: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                                    required
                                />
                            </div>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg transition">
                                Salvar
                            </button>
                            <button type="button" onClick={() => setIsEditingConsult(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : consults.length === 0 ? (
                    <p className="text-gray-500">Nenhuma consulta encontrada.</p>
                ) : (
                    orderedConsults.map((c) => (
                        <div key={c.id} className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition">
                            <p><strong>Motivo:</strong> {c.reason}</p>
                            <p><strong>Data:</strong> {c.date} — {c.time}</p>
                            <p><strong>Descrição:</strong> {c.description}</p>
                            <p><strong>Medicação:</strong> {c.medication}</p>
                            <p><strong>Dosagem/Precauções:</strong> {c.dosagePrecautions}</p>
                            <div className="flex gap-3 mt-3">
                                <button onClick={() => handleEditConsult(c)} className="bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1 rounded-md text-sm">
                                    Editar
                                </button>
                                <button onClick={() => handleDeleteConsult(c.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Histórico de Exames */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-cyan-700">
                        Histórico de Exames
                    </h3>
                    {!isEditingExam && exams.length > 0 && (
                        <select
                            value={examOrder}
                            onChange={(e) => setExamOrder(e.target.value)}
                            className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                        >
                            <option value="recent">Mais recentes</option>
                            <option value="oldest">Mais antigos</option>
                        </select>
                    )}
                </div>

                {isEditingExam ? (
                    <form onSubmit={handleUpdateExam} className="space-y-4">
                        {Object.keys(editExamData).map((key) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                                    {key === "documentUrl"
                                        ? "URL do Documento"
                                        : key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                {key === "results" ? (
                                    <textarea
                                        value={editExamData[key]}
                                        onChange={(e) =>
                                            setEditExamData({ ...editExamData, [key]: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                                        rows="3"
                                        required
                                    />
                                ) : (
                                    <input
                                        type={key.includes("date") ? "date" : key.includes("time") ? "time" : "text"}
                                        value={editExamData[key]}
                                        onChange={(e) =>
                                            setEditExamData({ ...editExamData, [key]: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                                        required={key !== "documentUrl"}
                                    />
                                )}
                            </div>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg transition">
                                Salvar
                            </button>
                            <button type="button" onClick={() => setIsEditingExam(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : exams.length === 0 ? (
                    <p className="text-gray-500">Nenhum exame encontrado.</p>
                ) : (
                    orderedExams.map((exam) => (
                        <div key={exam.id} className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition">
                            <p><strong>Exame:</strong> {exam.name}</p>
                            <p><strong>Data:</strong> {exam.date} — {exam.time}</p>
                            <p><strong>Tipo:</strong> {exam.type}</p>
                            <p><strong>Laboratório:</strong> {exam.laboratory}</p>
                            <p><strong>Documento:</strong> {exam.documentUrl}</p>
                            <p><strong>Resultados:</strong> {exam.results}</p>
                            <div className="flex gap-3 mt-3">
                                <button onClick={() => handleEditExam(exam)} className="bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1 rounded-md text-sm">
                                    Editar
                                </button>
                                <button onClick={() => handleDeleteExam(exam.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default PatientDetails;