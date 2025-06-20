import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Calculator } from './components/calculator/calculator';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'calculator', component: Calculator },
];
