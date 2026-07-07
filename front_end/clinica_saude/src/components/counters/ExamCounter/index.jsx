import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaCalendarCheck } from 'react-icons/fa'

const ExamCounter = () => {
    const [ExamCounter, setExamCounter] = useState(0)

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('http://localhost:3000/exams')
                setExamCounter(response.data.length)
            } catch (error) {
                console.error('erro ao obter dados de consultas', error)
            }
        }
        fetchExams()
    }, [])

    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
                <FaCalendarCheck className='text-green-600'/>{ExamCounter}
            </h2>
            <p>Exames</p>
        </div>
    )
}

export default ExamCounter