exports.login = async (req: any, res: any) => {
  console.log(req.session.isLoggedIn);
  req.session.isLoggedIn = true;
  return res.status(200).json({ message: "Logged In" });
};

exports.logout = async (req: any, res: any) => {
  req.session.destroy(() => {
    return res.status(200).json({ message: "Session deleted" });
  });
};
