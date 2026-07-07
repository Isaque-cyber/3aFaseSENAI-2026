import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaHospitalUser } from "react-icons/fa";


const ConsultsCounter = () => {
    const [consultsCounter, setConsultsCounter] = useState(0)

    useEffect(() => {
        const fetchConsults= async () => {
            try {
                const response = await axios.get('http://localhost:3000/consults')
                setConsultsCounter(response.data.length)
            } catch (error) {
                console.error("Erro ao obter dados do paciente", error)

            }
        }       
   
        fetchConsults()

    } ,[])
    
    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
        <h2 className='text-x1 font-bold flex items center gap-2'>
            <FaHospitalUser className='text-blue-600'/>{consultsCounter}
        </h2>
        <p className='text-gray-600 mt-2 '>Consultas</p>
    </div>
)

}

export default ConsultsCounter