import jwt from "jsonwebtoken";

export const verifyToken = (
    req,
    res,
    next
) => {

    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    if (!authHeader && !cookieToken) {
        return res.status(401).json({
            message: "No Token"
        });
    }

    const token = authHeader
        ? authHeader.split(" ")[1]
        : cookieToken;

    try {

        const decoded =
            jwt.verify(
                token,
                "mysecretkey123"
            );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message: "Invalid Token"
        });
    }
};