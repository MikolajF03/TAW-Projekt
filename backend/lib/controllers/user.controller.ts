import { Router, Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';
import { UserModel } from '../modules/models/user.model';
import jwt from 'jsonwebtoken';

class UserController implements Controller {
  public path = '/api/user';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/auth`, this.authenticate);
    this.router.post(`${this.path}/create`, this.createUser);
    this.router.delete(`${this.path}/logout/:id`, this.logout);
  }

  private authenticate = async (req: Request, res: Response) => {
  console.log("Dane odebrane z frontendu:", req.body);

  try {
    const { login, password } = req.body;
    
    const user = await UserModel.findOne({ email: login }); 
    console.log("Znaleziony użytkownik:", user);

    if (user && user.password === password) {
      const token = jwt.sign(
        { 
          userId: user._id, 
          name: (user as any).name, 
          email: (user as any).email 
        },
        'TwojeSuperTajneHaslo',
        { expiresIn: '2h' }
      );

        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
      }
    } catch (error: any) {
      console.error("BŁĄD AUTENTYKACJI:", error);
      return res.status(500).json({ message: 'Błąd serwera', details: error.message });
    }
  };

  private createUser = async (req: Request, res: Response) => {
    try {
      console.log("--- PRÓBA REJESTRACJI ---");
      console.log("Dane z body:", req.body);

      const newUser = new UserModel(req.body); 
      await newUser.save();

      console.log("Sukces: Użytkownik zapisany!");
      res.status(201).json({ message: 'Użytkownik stworzony' });
    } catch (error: any) {
      console.error("!!! BŁĄD MONGOOSE !!!");
      console.error(JSON.stringify(error, null, 2)); 
      
      res.status(400).json({ 
        message: 'Błąd rejestracji', 
        reason: error.message 
      });
    }
};

  private logout = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Wylogowano pomyślnie' });
};
}

export default UserController;