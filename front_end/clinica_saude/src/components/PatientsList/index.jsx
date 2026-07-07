import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import { Link } from "react-router";

const PatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [ages, setAges] = useState({});

    const calculateAge = (birthdate) => {
        if (!birthdate) return "-";

        let birth;

        if (birthdate.includes("/")) {
            const [day, month, year] = birthdate.split("/");
            birth = new Date(year, month - 1, day);
        } else {
            birth = new Date(birthdate);
        }

        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }

        return age;
    };

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/patients"
                );

                const patientsData = response.data;

                const calculatedAges = {};

                patientsData.forEach((patient) => {
                    calculatedAges[patient.id] = calculateAge(
                        patient.birthdate
                    );
                });

                setAges(calculatedAges);
                setPatients(patientsData);

            } catch (error) {
                console.error("Erro ao obter os dados dos pacientes:", error);
            }
        };

        fetchPatients();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // ==============================
    // BUSCA (melhor estruturada)
    // ==============================
    const filteredPatients = patients.filter((patient) => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) return true;

        return (
            patient.fullName?.toLowerCase().includes(search) ||
            patient.email?.toLowerCase().includes(search) ||
            patient.phone?.toLowerCase().includes(search) ||
            patient.cpf?.toLowerCase().includes(search) ||
            patient.healthInsurance?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="bg-white shadow rounded-2xl p-6 mt-8">

            <h2 className="text-xl font-semibold text-cyan-800 mb-4">
                Informações Rápidas de Pacientes
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">

                <label
                    htmlFor="search"
                    className="text-gray-700 font-medium"
                >
                    Buscar Paciente:
                </label>

                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Nome, CPF, telefone, e-mail ou convênio"
                    className="border rounded-lg px-3 py-2 w-full sm:w-96 focus:ring-2 focus:ring-cyan-600 outline-none"
                />

            </div>

            {filteredPatients.length > 0 ? (

                <ul className="divide-y divide-gray-200">

                    {filteredPatients.map((patient) => (

                        <li
                            key={patient.id}
                            className="flex flex-col lg:flex-row lg:items-center justify-between py-4 gap-4"
                        >

                            <div className="flex items-center gap-4">

                                <div className="bg-cyan-100 text-cyan-700 p-3 rounded-full">
                                    <FaUserAlt size={20} />
                                </div>

                                <div>

                                    <p className="font-semibold text-gray-800">
                                        {patient.fullName}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        {patient.email}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        {patient.phone}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        CPF: {patient.cpf}
                                    </p>

                                </div>

                            </div>

                            <div className="text-sm text-gray-600 text-left lg:text-right space-y-1">

                                <p>
                                    <strong>Idade:</strong>{" "}
                                    {ages[patient.id] ?? "-"} anos
                                </p>

                                <p>
                                    <strong>Plano:</strong>{" "}
                                    {patient.healthInsurance || "-"}
                                </p>

                                <Link
                                    to={`/paciente/${patient.id}`}
                                    className="inline-block text-cyan-700 font-semibold hover:underline"
                                >
                                    Ver detalhes
                                </Link>

                            </div>

                        </li>

                    ))}

                </ul>

            ) : (

                <p className="text-center text-gray-500 py-6">
                    Nenhum paciente encontrado.
                </p>

            )}

        </div>
    );
};

export default PatientsList;