    import { Routes } from '@angular/router';
    import { authGuard } from './services/auth/auth.guard';
import { BlogGalleryComponent } from './components/blog-gallery-component/blog-gallery-component.component';


    export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home/home.component')
        .then(m => m.HomeComponent)
    },
    {
        path: 'blog',
        loadComponent: () => import('./components/blog-home/blog-home.component')
        .then(m => m.BlogHomeComponent),
        canActivate: [authGuard]
    },
    {
        path: 'blog/detail/:id',
        loadComponent: () => import('./components/blog-item-details/blog-item-details.component')
        .then(m => m.BlogItemDetailsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component')
        .then(m => m.LoginComponent)
    },
    {
        path: 'signup',
        loadComponent: () => import('./components/signup/signup.component')
        .then(m => m.SignupComponent)
    },
    {
        path: 'add-post',
        loadComponent: () => import('./components/add-post-component/add-post-component.component')
        .then(m => m.AddPostComponent),
        canActivate: [authGuard]
    },
    {
    path: 'favorites',
        loadComponent: () => import('./components/favorites/favorites.component')
        .then(m => m.FavoritesComponent),
        canActivate: [authGuard]
    },
    { 
    path: 'gallery', 
        loadComponent: () => import('./components/blog-gallery-component/blog-gallery-component.component')
        .then(m => m.BlogGalleryComponent),
        canActivate: [authGuard]
    }
    ];
