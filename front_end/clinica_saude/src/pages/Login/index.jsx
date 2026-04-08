import React from 'react'
import { LoginForm } from '../../components/LoginForm'
import logo from '../../assets/images/logo-clinica.png'
export const Login = () => {
  return (

    <>
    <div className=' flex min-h-screen bg-gray-100'>
        <div className='hidden md:flex w-1/2 bg-gray-200 flex-col itens-center justify-center p-8'>
        <img src={logo} alt="clinica" className='mb-6'/>

    </div>
    <div className='flex w-full md:1/2 items-center justify-center p-8'>
     <LoginForm/>
    </div>
    </div>

    </>


  )
}
