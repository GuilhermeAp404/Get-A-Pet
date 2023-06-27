const Pet=require("../models/Pet")

//helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const { getUserById } = require("./UserController")
const ObjectId = require('mongoose').Types.ObjectId


module.exports = class PetController{

    static async create(req, res){
        const {name, age, weight, color}=req.body

        const images = req.files

        const available = true

        //images upload
        if(!name){
            res.status(422).json({message: 'O nome é obrigatorio'})
            return
        }
        if(!age){
            res.status(422).json({message: 'A idede é obrigatoria'})
            return
        }
        if(!weight){
            res.status(422).json({message: 'O peso é obrigatorio'})
            return
        }
        if(images.length===0){
            res.status(422).json({message: 'As imagens são obrigatorias'})
            return
        }
        if(!color){
            res.status(422).json({message: 'A cor é obrigatoria'})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images:[],
            user:{
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image)=>{
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({message: "Pet criado com sucesso", pet: newPet})
            
        } catch (error) {
            
            res.status(500).json({message: error})
        }

    }

    static async getAll(req, res){
        const pets = await Pet.find().sort('-createAt')

        res.status(200).json({
            pets:pets,
        })
    }

    static async getAllUserPets(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets= await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({
            pets,
        })
    }

    static async getAllUserAdoptions(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets= await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({
            pets,
        })
    }

    static async getPetById(req, res){
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: 'Id Invalido!'})
            return
        }

        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({message: 'Pet não encontrado!'})
            return
        }

        res.status(200).json({
            pet: pet,
        })

    }

    static async removePetById(req, res){
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: 'Id Invalido!'})
            return
        }

        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({message: 'Pet não encontrado!'})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString()!==user._id.toString()){
            res.status(422).json({message: 'Houve um problema em validar sua solicitação, tente novamente mais tarde'})
            return
        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({
            message: 'Pet Removido com sucesso'
        })
    }

    static async updatePetById(req, res){
        const id = req.params.id
        
        const {name, age, weight, color} = req.body

        const images = req.files

        const updateData = {}

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: 'Id Invalido!'})
            return
        }

        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({message: 'Pet não encontrado!'})
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString()!==user._id.toString()){
            res.status(422).json({message: 'Houve um problema em validar sua solicitação, tente novamente mais tarde'})
            return
        }

        if(!name){
            res.status(422).json({message: 'O nome é obrigatorio'})
            return
        }else{
            updateData.name = name
        }

        if(!age){
            res.status(422).json({message: 'A idede é obrigatoria'})
            return
        }else{
            updateData.age = age
        }

        if(!weight){
            res.status(422).json({message: 'O peso é obrigatorio'})
            return
        }else{
            updateData.weight = weight
        }
        
        if(!color){
            res.status(422).json({message: 'A cor é obrigatoria'})
            return
        }else{
            updateData.color = color
        }

        if(images.length>0){
            updateData.images = []
            images.map((image)=>{
                updateData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updateData)

        res.status(200).json({
            message: "Pet Atualizado com sucesso"
        })
    }

    static async schedule(req, res){
        const id = req.params.id

        const pet = await Pet.findOne({_id: id})
        
        if(!pet){
            res.status(404).json({message: 'Pet não encontrado!'})
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.equals(user._id)){
            res.status(422).json({message: 'Você não pode agendar uma visita com o seu própio Pet!'})
            return
        }

        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
              res.status(422).json({
                message: 'Você já agendou uma visita para este Pet!',
              })
              return
            }
        }


        pet.adopter={
            _id: new ObjectId(user.id),
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} no telefone: ${pet.user.phone}`,
        })

    }

    static async concludeAdoption(req, res){
        //const id = req.params.id
        const id = req.params.id
        
        const pet = await Pet.findOne({_id:id})

        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString()!==user._id.toString()){
            res.status(422).json({
                message: 'Houve um problema em validar sua solicitação, tente novamente mais tarde',
            })
            return
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: 'Parabéns! o ciclo de adoção foi concluido',
        })
        
    }
}