import api from '../../../utils/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFlashMessages from "../../../hooks/useFlashMessages";

import styles from './AddPet.module.css'

import PetForm from '../../form/PetForm'


function AddPet() {
    const [token] = useState(localStorage.getItem('token')||'')
    const {setFlashMessages} = useFlashMessages()
    const navigate = useNavigate()

    async function registerPet(pet){
        let msgType = 'success'

        const formData = new FormData()

        await Object.keys(pet).forEach((key)=>{
            if (key === 'images'){
                for(let i = 0 ; i < pet[key].length ; i++){
                    formData.append('images', pet[key][i])
                }
            }else{
                formData.append(key, pet[key])
            }
        })

        const data = await api.post('/pets/create', formData, {
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data',
            }
        })
        .then((response)=>{
            return response.data
        })
        .catch((err)=>{
            msgType = 'error'
            return err.response.data
        })
        
        setFlashMessages(data.message, msgType)
        if(msgType !== 'error'){
            navigate('/pet/mypets')
        }
    }

    return (
        <section>
            <div className={styles.addpet_header}>
                <h1>Cadastar Pets</h1>
                <p>Depois ele ficará disponível para adoção</p>
            </div>
            <PetForm handleSubmit={registerPet} btnText='Cadastrar' />
        </section>
    )
}

export default AddPet