import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
try {
const result = await aj.protect(req,{requested: 1});
if(result.isDenied()) {
if(result.reason.isRateLimit()) return res.status(429).json({ error: "Too Many Requests" });
if(result.reason.isBot()) return res.status(403).json({ error: "Forbidden Bot detected" });

return res.status(403).json({ error: "Access Denied" });
}
next();
} catch (error) {
console.error("Arcjet middleware error:", error);
next(error);
}

}

export default arcjetMiddleware;
