import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Calculator } from './components/calculator/calculator';
import { Profile } from './components/profile/profile';
import { Collection } from './components/collection/collection';
import { Farm } from './components/farm/farm';
import { Market } from './components/market/market';
import { Rating } from './components/rating/rating';

export const routes: Routes = [
    { path: '', redirectTo: 'profile', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'profile', component: Profile },
    { path: 'collection', component: Collection },
    { path: 'farm', component: Farm },
    { path: 'market', component: Market },
    { path: 'rating', component: Rating },
    { path: 'calculator', component: Calculator },
];
