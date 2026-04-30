const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  
    const { username, email, password } = req.body;

  
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

   
    const checkEmail = 'SELECT * FROM users WHERE email = ?';

    db.get(checkEmail, [email], (err, existingUser) => {
        if (err) {
            console.log('Database error when checking email:', err);
            return res.status(500).json({ message: 'Server error' });
        }

       
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

    
      
        const hashedPassword = bcrypt.hashSync(password, 10);

    
        const insertUser = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

        db.run(insertUser, [username, email, hashedPassword], function(err) {
            if (err) {
                console.log('Error saving user:', err);
                return res.status(500).json({ message: 'Error creating user' });
            }

           
            console.log('New user created with id:', this.lastID);

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password' });
    }

    const findUser = 'SELECT * FROM users WHERE email = ?';

    db.get(findUser, [email], (err, user) => {
        if (err) {
            console.log('Database error during login:', err);
            return res.status(500).json({ message: 'Server error' });
        }

   
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

       
       
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('User logged in:', user.username);

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    });
};

module.exports = { register, login };