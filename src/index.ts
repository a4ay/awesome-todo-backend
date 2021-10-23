import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth-routes";
import router from "./routes/todo-routes";
import passportSetup from "./config/passport-setup";
import createHttpError from "http-errors";


dotenv.config();
const DB: string = process.env['DB'] as string;
const secret = process.env.COOKIE_KEY as string;
const app = express();
passportSetup(passport);

app.use(cors({
   origin:"http://localhost:3000",
   credentials : true
} as any));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: [secret],
    maxAge: 24 * 60 * 60 * 100
  } as any)
);

// parse cookies
app.use(cookieParser());

// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());



//connect to mongodb
mongoose.connect(DB, () => {

  app.use("/todo", router);
  app.use("/auth", authRoutes);
  
  app.use((req:Request, res:Response, next:NextFunction) => {
    next(createHttpError(404, 'Route Does not Exist!'))
  });
  app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    res.status(err.status || 500).send({
      status: err.status || 500,
      message: err.message || "Unknown Error!"
    })
  });
  

  app.listen(5000, () => {
    console.log("Server on!");
  })

})
