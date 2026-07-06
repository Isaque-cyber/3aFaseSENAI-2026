import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { FaStar, FaRegStar } from "react-icons/fa";

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
    // =========================
    useEffect(() => {

        const fetchPatientDetails = async () => {

            try {

                const patientRes = await axios.get(
                    `http://localhost:3000/patients/${id}`
                );

                const consultsRes = await axios.get(
                    `http://localhost:3000/consults?patientId=${id}`
                );

                const examsRes = await axios.get(
                    `http://localhost:3000/exams?patientId=${id}`
                );

                setPatient(patientRes.data);
                setConsults(consultsRes.data);
                setExams(examsRes.data);

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

        setFavorite(favorites.includes(Number(id)));

    }, [id]);

    // =========================
    // Favoritar / desfavoritar
    // =========================
    const toggleFavorite = () => {

        let favorites =
            JSON.parse(localStorage.getItem("favoritePatients")) || [];

        const patientId = Number(id);

        if (favorites.includes(patientId)) {

            favorites = favorites.filter(item => item !== patientId);
            setFavorite(false);

        } else {

            favorites.push(patientId);
            setFavorite(true);

        }

        localStorage.setItem(
            "favoritePatients",
            JSON.stringify(favorites)
        );
    };

    // =========================
    // Ordenação Consultas
    // =========================
    const orderedConsults = [...consults].sort((a, b) => {

        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);

        return consultOrder === "recent"
            ? dateB - dateA
            : dateA - dateB;
    });

    // =========================
    // Ordenação Exames
    // =========================
    const orderedExams = [...exams].sort((a, b) => {

        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);

        return examOrder === "recent"
            ? dateB - dateA
            : dateA - dateB;
    });

    // =========================
    // Loading seguro
    // =========================
    if (!patient) {
        return (
            <div className="p-6 text-gray-600">
                Carregando prontuário...
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold text-cyan-800">
                Patient Details
            </h1>
        </div>
    );
};

export default PatientDetails;