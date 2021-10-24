import {Router, Request, Response, NextFunction} from "express";
import passport from "passport";
import {UserInterface} from "../models/user-model";

const authRoutes = Router();
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
// when login is successful, retrieve user info
authRoutes.get("/login/success", (req:Request, res:Response, next:NextFunction) => {
  try{
    if (req.user) {
      const user = req.user as UserInterface;
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: user,
      cookies: req.cookies
    });
  }else{
    res.status(401).json({
      success:false,
      message:"user not authenticated",
    })
  }
  }catch(e){
    next(e)
  }
});

// when login failed, send failed msg
authRoutes.get("/login/failed", (req:Request, res:Response) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});


authRoutes.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

authRoutes.get('/google/redirect', 
  passport.authenticate('google', { 
    failureRedirect: '/auth/login/failed',
    successRedirect : CLIENT_HOME_PAGE_URL,
  }),
  function(req, res) {
    res.redirect('/');
  });

export default authRoutes;