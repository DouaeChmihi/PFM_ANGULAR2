const mongoose= require('mongoose');
const joi = require('joi');
const passwordComplexity = require('joi-password-complexity')
//schema
const userSchema = new mongoose.Schema(
    {
        
        name: { type:String, required:true},
        email: {type: String, required:true},
        password: {type:String, required: true},
        role: { type: String, enum: ['client', 'admin'], default: 'user' } // Ajout du champ role

      
    },
    {
       timestamps: true,
    }
    );
    

    
const User = mongoose.model('User', userSchema);

const validate = (data) =>{
    const schema = joi.object({
        name: joi.string().required().label('name'),
        email: joi.string().required().label('email'),
        password: passwordComplexity().required().label('password'),
        role: joi.string().valid('user', 'admin').label('Role') // Validation du rôle

        
 
    });
    return schema.validate(data)
};
module.exports = {User, validate};