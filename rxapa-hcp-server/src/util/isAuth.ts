import jwt from "jsonwebtoken";

function isAuth(req: any, res: any, next: any) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.status(401).json({ message: "Please log in" });
    return res;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, `${process.env.TOKEN_SECRET_KEY}`);
    if (!decodedToken) {
      res.status(401).json({ message: "Please log in" });
      return res;
    }
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return res.status(err.statusCode).json({ message: "Please log in" });
  }

  //   req.userId = decodedToken.userId;
  next();
}

export default isAuth;
