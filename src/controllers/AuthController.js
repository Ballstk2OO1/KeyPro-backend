const Users = require('../models/user_schema');
const bcrypt = require('bcryptjs');

const jwt = require('../jwt');
const moment = require('moment');

const { loginValidation, registerValidation } = require('../services/validation');

const gswu_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@g.swu.ac.th$/

exports.register = async (req,res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    if (!gswu_regex.test(req.body.email)) return res.status(200).json({result: 'nOK', message: 'Please use g.swu.ac.th email domain', data: {}});

    const usernameExist = await Users.findOne({username: req.body.username});
    if (usernameExist) return res.status(200).json({result: 'nOK', message: 'Username already exists', data: {}});

    const emailExist = await Users.findOne({email: req.body.email});
    if (emailExist) return res.status(200).json({result: 'nOK', message: 'Email already exists', data: {}});

    try {
        req.body.password = await bcrypt.hash(req.body.password, 8);        

        const data = await Users.create(req.body);
        const userSchema = {
            username: data.username,
            email: data.email,            
            name: data.name            
        }

        res.status(200).json({result: 'OK', message: 'success create account please verify account by email in 15 minutes', data: userSchema});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};

exports.login = async (req,res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {
        const { username, password } = req.body;

        const data = await Users.findOne({$or: [
            {username: username},
            {email: username}
        ]});
      
        if (data) {
            const isPasswordValid = await bcrypt.compare(password, data.password);
            if (isPasswordValid) {

                const userSchema = {
                    username: data.username,
                    email: data.email,
                    name: data.name                    
                }            
        
                const payload = {
                    id: data._id                    
                };

                const token = jwt.sign(payload);

                res.status(200).header('Authorization', `Bearer ${token}`).json({ result: 'OK', message: 'success sign in', data: userSchema });
            } else {
                res.status(200).json({ result: 'nOK', message: 'invalid username or password', data: {}});
            }
        } else {
            res.status(200).json({ result: 'nOK', message: 'invalid username or password', data: {}});
        }
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
};