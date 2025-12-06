const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { app } = require('../server');
require('dotenv').config();

// singup controller 
exports.singup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        //validate email
        if (!email.includes('@gmail.com')) {
            return res.status(400).json({ message: 'Please enter a valid email that ends with @gmail.com .' });
        }
        //check user exists
        const exiting = await User.findOne({ email });
        if (exiting) {
            return res.status(400).json({ message: 'User already exists ' });
        }

        //validate password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long and include at least one letter, one number, and one special character.' });
        }
        //hash passwod
       const hashedPassword=await bcrypt.hash(password,parseInt(process.env.SALT_ROUNDS));

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error in signup:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
}


// login controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        //check user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //check password
        const Match = await bcrypt.compare(password, user.password);
        if (!Match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // payload for jwt token 
        const payload = {
            userId: user._id,
            email: user.email,
        };
        // generate jwt token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        res.status(200).json({
            message: 'Login successful',
            name: user.name,
            token
        });
    } catch (err) {
        console.error('Error in login:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
