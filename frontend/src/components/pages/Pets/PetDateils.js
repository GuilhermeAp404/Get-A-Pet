import api from "../../../utils/api"
import {useState, useEffect} from "react"
import { useParams, Link } from "react-router-dom"

import styles from "./PetDetails.module.css"

import useFlashMessages from "../../../hooks/useFlashMessages"

function PetDetails(){
    const [pet, setPet] = useState({})
    const {id} = useParams()
    const [token] = useState(localStorage.getItem('token')||'')
    const {setFlashMessages} = useFlashMessages()

    useEffect(()=>{
        api.get(`/pets/${id}`).then((response)=>{
            setPet(response.data.pet)
        })
    }, [id])

    async function schedule(){
        let msgType = 'success'

        const data = await api.patch(`/pets/schedule/${pet._id}`,{
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
        .then((response)=>{
            return response.data
        }).catch((err)=>{
            msgType='error'
            return err.response.data
        })

        setFlashMessages(data.message, msgType)
    }

    return(
        <>
            {pet.name &&(
                <section className={styles.pet_details_container}>
                    <div className={styles.pet_header}>
                        <h1>Conhecendo o Pet: {pet.name}</h1>
                        <p>Se tiver insteresse, marque uma visista para conhecê-lo</p>
                    </div>
                    <div className={styles.pet_images}>
                        
                        {pet.images.map((image, index)=>(
                            <img
                                src={`${process.env.REACT_APP_API}images/pets/${image}`}
                                alt={pet.name}
                                key={index}
                            />
                        ))}
                    </div>
                    <div className={styles.pet_details_container}>
                        <p>
                            <span className="bold">Idade:</span> {pet.age}
                        </p>
                        <p>
                            <span className="bold">peso:</span> {pet.weight}
                        </p>

                        {token ? (
                            <button onClick={schedule}>solicitar uma visita</button>
                        ):(
                            <p>Você precisa <Link to='/register'>criar uma conta</Link> para solicitar a visita</p>
                        )}
                    </div>
                </section>
            )}
        </>
    )
}

export default PetDetails