import { usersService } from "../services/index.js"

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({status:"success",message:"User deleted"})
}

const uploadDocuments = async (req, res) => {
    const { uid } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).send({ status: 'error', error: 'No se subieron archivos.' });
    }

    const user = await usersService.getUserById(uid);
    if (!user) return res.status(404).send({ status: 'error', error: 'Usuario no encontrado.' });

    const newDocuments = files.map(file => ({
        name: file.originalname,
        reference: file.path
    }));

    user.documents.push(...newDocuments);
    await usersService.update(uid, { documents: user.documents });

    res.send({ status: 'success', message: 'Documentos subidos exitosamente.' });
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadDocuments 
}