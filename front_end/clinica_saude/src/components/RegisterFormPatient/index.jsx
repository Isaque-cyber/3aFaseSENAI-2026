import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'


function RegisterFormPatient() {

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthdate: "",
    cpf: "",
    rg: "",
    maritalStatus: "",
    phone: "",
    email: "",
    birthplace: "",
    emergencyContact: "",
    allergies: "",
    specialCare: "",
    healthInsurance: "",
    insuranceNumber: "",
    insuranceValidity: "",
    address: {
      cep: "",
      city: "",
      state: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      reference: ""
    }
  })

  const [isSaving, setisSaving] = useState(false)

  //Handles
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value })) //Operador spread e propriedade computada

  }

  //Handles
  const handleAdrressChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value, }
    })) //Operador spread e propriedade computada

  }

  // Requisição para api viacep
  const fetchAddressData = async (cep) => {
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`)
      setFormData((prev) => ({
        ...prev,
        adrress: {
          ...prev.address,
          cep: data.cep || "",
          city: data.localidade || "",
          state: data.uf || "",
          street: data.logradouro || "",
          complement: data.complemento || "",
          neighborhood: data.bairro || ""
        }
      }))

    } catch (error) {
      console.log("erro ao buscar endereço", error)
    }

  }
  //Tratamento do valor digitado no campo de cep
  const handleCepBlur = (e) => {
    const cep = e.target.value.replace(/\D/g, "")
    if (cep.lenght === 8) fetchAddressData(cep)
  }

  //submitForm
  const handleSubmit = async (e) => {
    e.preventDefault()
    setisSaving(true)

    try {
      await axios.post("http://localhost:3000/patients", formData)
      
      toast.success("Paciente cadastrado com sucesso!", {
        authClose: 2000,
        hideProgressBar: true
      })

      setFormData({
        fullName: "",
        gender: "",
        birthdate: "",
        cpf: "",
        rg: "",
        maritalStatus: "",
        phone: "",
        email: "",
        birthplace: "",
        emergencyContact: "",
        allergies: "",
        specialCare: "",
        healthInsurance: "",
        insuranceNumber: "",
        insuranceValidity: "",
        address: {
          cep: "",
          city: "",
          state: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          reference: ""
        }
      })

    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar os dados!",{
        authClose: 2000,
        hideProgressBar: true
    })

    }
     }

  return (
    <form
    onSubmit{handleSubmit}
    className='space-y-6 text-gray'></form>
  )
}

export default RegisterFormPatient
