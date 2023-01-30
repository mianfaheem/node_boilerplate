const bcryptjs = require("bcryptjs");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


/******************** Registering a User *******************/
exports.register = async function (req, res, next) {
    try {        
        await User.findOne({ email: {'$regex' : req.body.email, '$options' : 'i'} })
        .then(async(result) => {
            if (result) {
                res.status(409).json({ success: false, message: "Email already Exists" });
            }else{
                let user= {
                    name: req.body.name,
                    email: req.body.email ? req.body.email.toLowerCase() : '',
                    password: req.body.password
                };
                let schema = {
                    name: { type: "string", optional: false },
                    email: { type: "string", optional: false },
                    password: { type: "string", optional: false }
                }
                if(validateResponse(res, user, schema) === true){
                    bcryptjs.genSalt(13, function (err, salt) {
                        bcryptjs.hash(req.body.password, salt, async function (err, hash) {
                            user.password = hash;                            
                            await User.create(user).then((response)=>{
                                let tokenData = { userId: user._id, email: user.email, role: user.role };
                                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                                res.status(200).json({ 
                                    success: true,
                                    message: "register successfully",
                                    token,
                                    data: user
                                }); 
                            }); 
                        });
                    });
                }  
            }
        });            
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong",error: error });
    }
};

function validateResponse(res, postJson, schema) {
    const v = new validator();
    const validateResponse = v.validate(postJson, schema);
  
    if (validateResponse !== true) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: validateResponse,
      });
    } else {
      return true;
    }
}
/******************** Login a User *******************/
exports.login = async function (req, res, next) {
    try {        
        const users = {
            email: req.body.email.toLowerCase(),
            password: req.body.password,
        };
        const schema = {
            email: { type: "string", optional: false },
            password: { type: "string", optional: false },
        };
        
        if(validateResponse(res, users, schema) === true){
            User.findOne({ email: users.email })
            .then(async (user) => {
                if (user === null) {
                    res.status(401).json({ success: false,message: "User Doesn't Exist" });
                } else {
                    let userPass = await User.findById(user._id).select('password');
                    bcryptjs.compare(req.body.password,userPass.password,function (err, result) {
                        if (result) {
                            let tokenData = { userId: user._id, email: user.email, role: user.role };
                            const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                            res.status(200).json({
                                success: true,
                                message: "Authentication successful",
                                token,
                                data: user,
                            });
                        } else {
                            res.status(401).json({ success: false, message: "Invalid Credentials" });
                        }
                    });
                }
            });
        }
            
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong",error: error });
    }
};

/********************Get User By Id*******************/
exports.getUserById = async function (req, res, next) {
    try {
        const id = req.tokenData.userId;    
        await User.findById(id).then((result) => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(409).json({ success: false, message: "User Not Found" });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong",error: error });
    }
};
