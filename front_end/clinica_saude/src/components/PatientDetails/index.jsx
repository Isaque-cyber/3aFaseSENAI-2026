import { useState, useEffect } from 'react'
import axios from 'axios'

import { useParams } from 'react-router'

import { toast } from 'react-toastify'

const PatientDetails = () => {
    const { id } = useParams()
    const [patient, setPatient] = useState({})
    const [consults, setConsults] = useState([])
    const [exams, setExams] = useState([])

    //Consultas

    const [editingConsult, setEditingConsult] = useState(null)
    const [editingConsultData, setEditingConsult] = useState({
        reason: "",
        date: "",
        time: "",
        description: "",
        medication: "",
        dosagePrecautions: "",
    })
    const [isEditingConsult, setEditingConsult] = useState(false)

    //Exames

    const [editingExams, setEditingExams] = useState(null)
    const [editingExamsData, setEditingExams] = useState({
        name: "",
        date: "",
        time: "",
        type: "",
        laboratory: "",
        documentUrl: "",
        results: "",
    })
    const [isEditingExam, setEditingExam] = useState(false)

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientRes = await axios.get(`http://localhost:3000/patients/${id}`)
                const consultsRes = await axios.get(`http://localhost:3000/consults?patientId=${id}`)
                const examsRes = await axios.get(`http://localhost:3000/exams?patientId=${id}`)

                setPatient(patientRes.data)
                setConsults(consultsRes.data)
                setExams(examsRes.data)

            } catch (error) {
                console.error("Erro ao obter os detalhes do paciente", error)
            }
        }
        fetchPatientDetails()
    }, [id])



    return (
        <div>PatientDetails</div>
    )
}

export default PatientDetails