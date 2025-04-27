import jwt from 'jsonwebtoken';

// VERIFY TOKEN FROM API GATEWAY
export const serviceVerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    console.log("🔍 Received Token:", token); // Debugging log

    if (!token) {
        return res.status(401).json({ message: "❌ Unauthorized access - No token provided" });
    }

    jwt.verify(token, process.env.SERVICE_JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("❌ JWT Error:", err);
            return res.status(403).json({ message: "❌ Invalid or expired token" });
        }
        req.user = decoded; // Store decoded user data
        next();
    });
};
