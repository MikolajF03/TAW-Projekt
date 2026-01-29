import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../modules/models/user.model';

const SECRET_KEY = 'TwojeSuperTajneHaslo'; 

export const authenticate = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: login, password: password });

    if (!user) {
      return res.status(401).json({ message: 'Błędny email lub hasło' });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        name: (user as any).name, 
        email: (user as any).email 
      },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    return res.json({ token });
  } catch (error) {
    console.error('Błąd logowania:', error);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
};