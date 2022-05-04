const Users = require('../models/user_schema');
const Transactions = require('../models/transaction_schema');

const moment = require('moment');

const { getAllData } = require('../services/utilities');

const { transactionValidation, transactionGetValidation } = require('../services/validation');

exports.getAll = async (req,res) => {

    const switchData = await getAllData();
    if (switchData === '500') return res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    
    const formData = {
        switch: switchData
    }
    
    res.status(200).json({result: 'OK', message: 'success get form data', data: formData});

};

exports.create = async (req,res) => {
    const userId = req.userId

    const { error } = transactionValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    try {

        const user_data = await Users.findById(userId);
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        req.body.ownerID = userId
        const data = await Transactions.create(req.body)
        
        res.status(200).json({result: 'OK', message: 'success create transactions', data: data});
        
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }

}

exports.getHistory = async (req,res) => {
    const userId = req.userId

    try {

        const user_data = await Users.findById(userId);
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const data = await Transactions.find({ownerID: userId})
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const transactions_data = []

        for(let i = 0; i < data.length; i++) {
            const schema = {
                id: data[i]._id,
                item: data[i].item,
                total: data[i].total,
                moment: moment(data[i].created),    
                created: data[i].created
            }
            transactions_data.push(schema)
        }

        const sorted_data = transactions_data.sort((a, b) => a.moment.valueOf() - b.moment.valueOf())

        res.status(200).json({result: 'OK', message: 'success get transactions history', data: {history: sorted_data.reverse()}});
        
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}

exports.get = async (req,res) => {
    const userId = req.userId

    const { error } = transactionGetValidation(req.body);
    if (error) return res.status(200).json({result: 'nOK', message: error.details[0].message, data: {}});

    const { transaction_id } = req.body
    
    try {
        const user_data = await Users.findById(userId);
        if(!user_data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        const data = await Transactions.findById(transaction_id)
        if(!data) return res.status(404).json({result: 'Not found', message: '', data: {}});

        if(data.ownerID !== userId) return res.status(403).json({result: 'Forbiden', message: 'access is denied', data: {}});        
        
        const schema = {
            id: data._id,
            item: data.item,
            total: data.total,
            owner: {
                name: `${user_data.name.firstname} ${user_data.name.lastname}`
            },
            created: data.created
        }        

        res.status(200).json({result: 'OK', message: 'success get transactions data', data: schema});
    } catch (e) {
        res.status(500).json({result: 'Internal Server Error', message: '', data: {}});
    }
}