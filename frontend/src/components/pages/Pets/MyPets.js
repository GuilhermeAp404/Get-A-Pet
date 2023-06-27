import api from "../../../utils/api"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"

import RoundedImage from "../../layout/RoundedImage";
import styles from './Dashboard.module.css'

import useFlashMessages from "../../../hooks/useFlashMessages"

function MyPets() {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const navigate = useNavigate()
    const {setFlashMessages} = useFlashMessages()

    useEffect(()=>{
        api.get('/pets/mypets', {
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then((response)=>{
            setPets(response.data.pets)
        })
    },[token])

    async function removePet(id){
        let msgType = 'success'
        
        const data = await api.delete(`/pets/${id}`, {
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then((response)=>{
            const updatePets = pets.filter((pet)=> pet._id !== id)
            setPets(updatePets)
            return response.data
        })
        .catch((err)=>{
            return err.response.data
        })

        setFlashMessages(data.message, msgType)
    }

    async function concludeAdoption(id){
        let msgType = 'success'

        const data = await api.patch(`/pets/conclude/${id}`, {
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response)=>{
            return response.data
        }).catch((err)=>{
            msgType = 'error'
            return err.response.data
        })

        setFlashMessages(data.message, msgType)
        setTimeout(()=>{
            navigate(0)
        }, 5000)
    }

    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>MyPets</h1>
                <Link to="/pet/addpet">Cadastrar Pet</Link>
            </div>
            <div className={styles.petlist_container}>
                {pets.length > 0 && (
                    pets.map((pet)=>(
                        <div key={pet._id} className={styles.petlist_row}>
                            <RoundedImage
                                src={`${process.env.REACT_APP_API}images/pets/${pet.images[0]}`}
                                alt={pet.name}
                                width='px75'
                            />
                           <span className="bold">{pet.name}</span>
                           <div className={styles.actions}>
                                {pet.available ? (
                                    <>
                                        { pet.adopter && (
                                            <button className={styles.conclude_btn} onClick={()=>{
                                                concludeAdoption(pet._id)
                                            }}>Concluir adoção</button>
                                        )}
                                        <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                                        <button onClick={()=>{
                                            removePet(pet._id)
                                        }}>Excluir</button>
                                    </>
                                ):(
                                    <p>Pet já adotado</p>
                                ) }
                           </div>
                        </div>
                    ))
                )}
                {pets.length === 0 && <p>Você ainda não tem pets cadastrados</p>}
            </div>
        </section>
    )
}

export default MyPets