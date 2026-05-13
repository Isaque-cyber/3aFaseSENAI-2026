import React from 'react'
import { CiHospital1 } from "react-icons/ci";
import PatientsCounter from '../../components/PatientsCounter';
import ConsultsCounter from '../../components/ConsultsCounter';
import ExamsCounter from '../../components/ExamsCounter';
const Dashboard = () => {
    return (
        <div>
            <h1 className='text-x1 font-bold text-cyan-800 mb-6'>Dashboard</h1>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                

                <PatientsCounter/>
                <ConsultsCounter/>
                <ExamsCounter/>
                
            </div>

            <h2>Lista de pacientes</h2>

        </div>)
}

export default Dashboard