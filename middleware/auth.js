const jwt=require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'authorization' });
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token .next time! next!' });
    }
   
    if (!token) {
        return res.status(401).json({ message: 'No token provided still (next time! next time!' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification error:', err.message);  
            return res.status(401).json({ message: 'token in not valid' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;  

