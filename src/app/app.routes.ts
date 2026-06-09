import { Routes } from '@angular/router';
import { LayoutClassic } from './components/layout-classic/layout-classic';
import { Calendario } from './components/calendario/calendario';

export const routes: Routes = [
  { path: '', component: LayoutClassic },
  { path: '**', redirectTo: '' }
];
