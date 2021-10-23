import {Router,Request,Response,NextFunction} from "express";
import {getTodos, postTodos, updateTodo, deleteTodo} from "../controller/controller";
import createHttpError from "http-errors";
import multer from "multer";
const upload = multer({ dest: 'uploads/' });

const router = Router();

const authCheck = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        authenticated: false,
        message: "user has not been authenticated"
      });
      next(createHttpError(401, 'You are not Authenticated!'))
    } else {
      next()
    }
  };
  

router.post('/create',authCheck,upload.single('file'),postTodos);

router.get('/get',authCheck,getTodos);

router.put('/update',authCheck,updateTodo);

router.delete('/delete',authCheck,deleteTodo);





export default router;