const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const User = require("../../models/user");


/********************Get User By Id*******************/
exports.getUserById = async function (req, res, next) {
    try {
        const id = req.params.id;    
        await User.findById(id).then((result) => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(409).json({ success: false, message: "User Not Found" });
            }
        });
    } catch (error) {
        res.status(500).json({success: false,
            message: "Something went wrong",
            error: error,
        });
    }
};

/******************** Users List *******************/
exports.getAllUsers = async function (req, res, next) {
    try {
        await User.find().then((result) => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(409).json({ success: false, message: "User Not Found" });
            }
        });        
    } catch (error) {
        res.status(500).json({success: false,
            message: "Something went wrong",
            error: error,
        });        
    }
};
