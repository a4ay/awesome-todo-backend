import {Request, Response, NextFunction} from "express";
import {UserInterface} from "../models/user-model";
import Todo from "../models/todo-model";
import cloudinary from "../config/cloudinary";



export async function getTodos(req:Request, res:Response, next:NextFunction):Promise<any>{
  try{
    const user = req.user as UserInterface;
    const todos = await Todo.find({userId : user.googleId}).sort({createdAt:-1}).exec();
    res.send(todos);
  }catch(e){
    next(e);
  }
}


export async function postTodos(req:Request,res:Response,next:NextFunction):Promise<any>{
//multer to local

  try{
  //local to cloud
  let data:any;
  if(req.file){
    const file:string = req.file.path;
    data = await cloudinary.v2.uploader.upload(
          file,
          {
            folder: "awesome-todos",
          },
          (err:any, result:any) => {
            //   fs.unlinkSync(file.path);
            if (err) {
              return err;
            }
            console.log("Successfully uploaded to Cloudinary!");
          }
        );
    }
    else{
      data = {url : "https://play-lh.googleusercontent.com/HUuQc4Zpl6x7fUyX-jFMmcuUbW77REw4UKl5rfhHfP4VY6ctBU1w1I_RZWsXaojFgIo"}
    }

  // cloud to db
    const user = req.user as UserInterface;
    const todo = new Todo({
      title : req.body.title,
      description : req.body.description,
      image: data.url,
      userId: user.googleId,
      completed:false,
      createdAt: new Date(),
    })

    const saveTodo = await todo.save();
    res.send(saveTodo);
    }catch(e){
      next(e)
    }
}

export async function updateTodo(req:Request,res:Response,next:NextFunction):Promise<any>{

  try{
    const todo = await Todo.findOne({_id : req.query.id}).exec();

    if(!todo) next();

    todo.completed = !todo.completed;

    await todo.save();

    return res.send(todo);

  }catch(e){
    next(e);
  }
}

export async function deleteTodo(req:Request, res:Response,next:NextFunction):Promise<any>{
  try{
    const todo = await Todo.findOne({_id : req.query.id}).exec();

    if(!todo) next();

    const response = await todo.remove();

    return res.send(response);

  }catch(e){
    next(e);
  }
}



