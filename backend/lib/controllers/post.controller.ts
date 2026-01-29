import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkPostCount } from '../middlewares/checkPostCount.middleware';
import { auth } from '../middlewares/auth.middleware';
import DataService from '../modules/services/data.services';
import { IData } from '../modules/models/data.model';

class PostController implements Controller {
    public path = '/api/posts';
    public router = Router();
    private dataService: DataService;

    constructor() {
        this.dataService = new DataService();
        this.initializeRoutes();
    }

    private initializeRoutes() {

        //this.router.get(`${this.path}/latest`, this.getAll);
        this.router.get(this.path, auth, this.getAllPosts);
        //this.router.post(`${this.path}/take/:num`, checkPostCount, this.getNPosts);
        this.router.delete(this.path, auth, this.deleteAllPosts);

        this.router.post(this.path, auth, this.addData);

        this.router.get(`${this.path}/:id`, auth, this.getElementById);
        this.router.put(`${this.path}/:id`, auth, this.updatePost);
        this.router.delete(`${this.path}/:id`, auth, this.removePost);
        this.router.post(`${this.path}/:id/like`, auth, this.toggleLike);
    }

    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        const testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];
        response.status(200).json(testArr);
    };

    private getNPosts = async (request: Request, response: Response, next: NextFunction) => {
        const { num } = request.params;
        const count = parseInt(num, 10);
        if (isNaN(count) || count <= 0) {
             return response.status(400).json({ error: 'Podano nieprawidłową liczbę elementów.' });
        }
        const elements = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6].slice(0, count);
        response.status(200).json(elements);
    };

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { title, text, image } = request.body;
        const user = (request as any).user;
        const authorId = user?._id || user?.id || user?.userId; 

        if (!authorId) {
            return response.status(401).json({ error: 'Nie udało się zidentyfikować autora z tokena.' });
        }

        const readingData: IData = { 
            title, 
            text, 
            image, 
            authorId, 
            createdAt: new Date(),
            likes: [] 
        };

        try {
            await this.dataService.createPost(readingData);
            response.status(200).json(readingData);
        } catch (error: any) {
            console.error('Błąd zapisu posta:', error);
            response.status(400).json({ error: 'Invalid input data or database error.' });
        }
    };

    private updatePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const { title, text, image } = request.body;
        const userId = (request as any).user?._id || (request as any).user?.id || (request as any).user?.userId;

        try {
            const post = await this.dataService.getById(id);
            if (!post) {
                return response.status(404).json({ error: 'Post nie istnieje.' });
            }

            if (post.authorId !== userId) {
                return response.status(403).json({ error: 'Brak uprawnień. Tylko autor może edytować ten post.' });
            }

            const updatedData = { title, text, image };
            await this.dataService.updatePost(id, updatedData);
            response.status(200).json(updatedData);
        } catch (error) {
            console.error('Błąd aktualizacji:', error);
            response.status(500).json({ error: 'Błąd podczas aktualizacji posta.' });
        }
    };

    private removePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const userId = (request as any).user?._id || (request as any).user?.id || (request as any).user?.userId;

        try {
            const post = await this.dataService.getById(id);
            if (!post) {
                return response.status(404).json({ error: 'Post nie istnieje.' });
            }

            if (post.authorId !== userId) {
                return response.status(403).json({ error: 'Brak uprawnień. Tylko autor może usunąć ten post.' });
            }

            await this.dataService.deleteById(id);
            response.status(200).json({ message: 'Post został usunięty.' });
        } catch (error) {
            console.error('Błąd usuwania:', error);
            response.status(500).json({ error: 'Błąd podczas usuwania posta.' });
        }
    };

    private getElementById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        try {
            const post = await this.dataService.getById(id);
            if (!post) {
                response.status(404).json({ error: 'Post not found' });
            } else {
                response.status(200).json(post);
            }
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
    };

    private getAllPosts = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const allPosts = await this.dataService.query({});
            response.status(200).json(allPosts);
        } catch (error) {
            response.status(500).json({ error: 'Failed to fetch posts' });
        }
    };

    private deleteAllPosts = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.dataService.deleteAllPosts();
            response.status(200).json({ message: 'Wszystkie posty z bazy usunięte.' });
        } catch (error) {
            response.status(500).json({ error: 'Failed to delete posts' });
        }
    };

    private toggleLike = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const userId = (request as any).user?._id || (request as any).user?.id || (request as any).user?.userId;

        try {
            const post = await this.dataService.getById(id) as any;
            if (!post) {
                return response.status(404).json({ error: 'Post nie istnieje.' });
            }

            if (!post.likes) {
                post.likes = [];
            }

            const index = post.likes.indexOf(userId);

            if (index === -1) {
                post.likes.push(userId);
            } else {
                post.likes.splice(index, 1);
            }

            await this.dataService.updatePost(id, { likes: post.likes });

            response.status(200).json(post);
        } catch (error) {
            console.error('Błąd podczas lajkowania:', error);
            response.status(500).json({ error: 'Błąd serwera podczas obsługi polubienia.' });
        }
    };
}

export default PostController;