
const {User,validate} = require('../models/User');
//password handler
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { mergeCartItems } = require('../controllers/cartController');



const validatesignin =(data)=>{
  const schema = joi.object({
      email: joi.string().required().label('email'),
      password:joi.string().required().label('password'),
      mergeCart: joi.boolean().label('mergeCart') // Ajoutez cette ligne pour valider mergeCart


  })
  return schema.validate(data);
}

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const userDoc = await User.create({
      name, email, password: hashPassword, role // Inclure le rôle lors de la création de l'utilisateur
    });
    const { password: hashedPassword, ...data } = await userDoc.toJSON();
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" })
  }
}

const login = async (req, res) => {
  const { email, password, mergeCart } = req.body;
  try {
    const { error } = validatesignin(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(400).send({ message: 'Invalid Email or Password' });

    const validPassword = await bcrypt.compare(password, userDoc.password);
    if (!validPassword) return res.status(401).send({ message: 'Invalid Email or Password' });

    if (validPassword) {
      jwt.sign({
        _id: userDoc._id,
        email: userDoc.email,
        role: userDoc.role // Include role in JWT token
      }, process.env.SECRET_KEY, {}, async (err, token) => {
        if (err) throw err;
        
        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        // Merge cart items if required
        if (mergeCart) {
          const sessionId = req.cookies.sessionId;
          if (sessionId) {
            await mergeCartItems(userDoc._id, sessionId);
          }
        }

        // Return user data with the role
        res.json({ user: { ...userDoc.toJSON(), role: userDoc.role } });
      });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};


const getUser = async(req, res) => {
  try{
    const cookie = req.cookies['jwt']
  
    //decode token
    if (!cookie) {
      return res.status(401).send({ message: 'Unauthenticated' });
    }
    const claims = jwt.verify(cookie, process.env.SECRET_KEY)
  
    if(!claims){
     return res.status(401).send({ message: 'Unauthenticated' 
        });
    }
  
    const user = await User.findOne({_id: claims._id})
  
   const {password, ...data} = await user.toJSON()
  
    res.send(data)
    } catch(e){
      return res.status(401).send({ message: 'Unauthenticated' });
      
    }
  
};

const logout =  (req, res) => {
  res.cookie('jwt', '', {maxAge: 0})
  res.send({
    message:'success'
  })
}



module.exports = {register, login, getUser, logout}

 