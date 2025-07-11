import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        const exists = await usersService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        req.logger.info(`Usuario creado con ID: ${result._id}`);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        req.logger.error(`Error al crear usuario: ${error.message}`);
        res.status(500).send({ status: "error", error: "Error al crear usuario" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });

    // Actualizamos la última conexión
    user.last_connection = new Date();
    await usersService.update(user._id, user);

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
    res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" });
};

const logout = async (req, res) => {
    const cookie = req.cookies['coderCookie'];
    if (cookie) {
        const decodedUser = jwt.verify(cookie, 'tokenSecretJWT');
        const user = await usersService.getUserByEmail(decodedUser.email);
        if (user) {
            user.last_connection = new Date();
            await usersService.update(user._id, user);
        }
    }
    res.clearCookie('coderCookie').send({ status: "success", message: "Logged out" });
};

const current = async(req,res) =>{
    const cookie = req.cookies['coderCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}

const unprotectedLogin  = async(req,res) =>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});
    res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
}
const unprotectedCurrent = async(req,res)=>{
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}
export default {
    current,
    login,
    logout,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}