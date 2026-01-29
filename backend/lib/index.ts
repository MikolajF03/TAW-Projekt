import App from './app';
import PostController from './controllers/post.controller';
import IndexController from './controllers/index.controller';
import UserController from './controllers/user.controller';

const app = new App([
    new PostController(),
    new IndexController(),
    new UserController()
]);

app.listen();