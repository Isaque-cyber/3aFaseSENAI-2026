import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaHospitalUser } from "react-icons/fa";


const ExamsCounter = () => {
    const [examsCounter, setExamsCounter] = useState(0)

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('http://localhost:3000/exams')
                setExamsCounter(response.data.length)
            } catch (error) {
                console.error("Erro ao obter dados do paciente", error)

            }
        }
   
        fetchExams()

    } ,[])
    
    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
        <h2 className='text-x1 font-bold flex items center gap-2'>
            <FaHospitalUser className='text-blue-600'/>{examsCounter}
        </h2>
        <p className='text-gray-600 mt-2 '>Exames</p>
    </div>
)

}

export default ExamsCounter