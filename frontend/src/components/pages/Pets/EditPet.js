import api from "../../../utils/api"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import styles from './AddPet.module.css'

import PetForm from "../../form/PetForm"

import useFlashMessages from "../../../hooks/useFlashMessages"


function EditPet(){
    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token') || '')
    const {id} = useParams()
    const {setFlashMessages} = useFlashMessages()
    const navigate = useNavigate()
    
    useEffect(()=>{
        api.get(`/pets/${id}`,{
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response)=>{
            setPet(response.data.pet)
        })
    }, [token, id])

    async function updatePet(pet){
        let msgType = 'success'

        const formData = new FormData()

        await Object.keys(pet).forEach((key)=>{
            if(key==='images'){
                for(let i; i < pet[key].length; i++){
                    formData.append('images', pet[key][1])
                }
            }else{
                formData.append(key, pet[key])
            }

        })
        const data = await api.patch(`/pets/${pet._id}`, formData, {
                headers:{
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            }).then((response)=>{
                return response.data
            }).catch((err)=>{
                msgType='error'
                return err.response.data
            })
        console.log(data)
        setFlashMessages(data.message, msgType)
        if(msgType ==='success'){
            navigate('/pet/mypets')
        }
    }
    
    return(
        <section>
            <div className={styles.addpet_header}>
                <h1>Modificando o Pet: {pet.name} </h1>
                <p>Depois da edição os dados serão atualizados no sistema</p>
            </div>
            {pet.name &&
                <PetForm handleSubmit={updatePet}  petData= {pet} btnText="Atualiza"/>
            }
        </section>
    )
}

export default EditPet