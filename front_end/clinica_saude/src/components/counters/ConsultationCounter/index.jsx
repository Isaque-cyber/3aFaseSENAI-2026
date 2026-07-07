import { useState, useEffect } from 'react'
import axios from 'axios'
import { MdLocalHospital } from 'react-icons/md'

const ConsultsCounter = () => {
    const [ConsultsCounter, setConsultsCounter] = useState(0)

    useEffect(() => {
        const fetchConsults = async () => {
            try {
                const response = await axios.get('http://localhost:3000/consults')
                setConsultsCounter(response.data.length)
            } catch (error) {
                console.error('erro ao obter dados de consultas', error)
            }
        }
        fetchConsults()
    }, [])

    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
                <MdLocalHospital className='text-rose-600'/>{ConsultsCounter}
            </h2>
            <p>consultas</p>
        </div>
    )
}

export default ConsultsCounter