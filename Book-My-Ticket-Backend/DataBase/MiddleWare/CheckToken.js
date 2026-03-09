const jwt = require('jsonwebtoken');

const CheckToken = (roles = []) => {
    return (req, res, next) => {
        try {
            const bearerToken = req.headers.authorization;

            if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
                return res.status(403).json({
                    message: 'You are not authorized, please login',
                });
            }

            const token = bearerToken.split(' ')[1];

            const SECRET_KEY =
                'vhhdhejbfajbafjvafvfvavvvasvvdduwhuhwue6734483748723dhdschsdbhbhvsds8u3847';

            const decoded = jwt.verify(token, SECRET_KEY);

           
            req.user = {
                id: decoded.id,
                role: decoded.role,
            };


            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    message: 'Access denied',
                });
            }

            next();
        } catch (e) {
            return res.status(403).json({
                message: 'Invalid or expired token',
            });
        }
    };
};

module.exports = CheckToken;
