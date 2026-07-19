import jwt from 'jsonwebtoken';
import config from '../config/env.js';

const generateToken=(userId)=>{
    console.log('Signing token with expiresIn:', config.jwtExpiresIn); //debug
    return jwt.sign({id: userId},config.jwtSecret,{
        expiresIn:config.jwtExpiresIn,
    });
};
export default generateToken;