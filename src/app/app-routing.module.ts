import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'slider', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'slider',
    loadChildren: () => import('./slider/slider.module').then( m => m.SliderPageModule)
  },
  {
    path: 'activation',
    loadChildren: () => import('./activation/activation.module').then( m => m.ActivationPageModule)
  },
  {
    path: 'diagnose',
    loadChildren: () => import('./diagnose/diagnose.module').then( m => m.DiagnosePageModule)
  },
  {
    path: '**',
    redirectTo: 'slider'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
