import jwt from "jsonwebtoken";

export async function verifyToken(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    throw new Error("not authorize");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("not authorize");
  }
}
