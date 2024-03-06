import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DonateComponent } from './donate/donate.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { LoggedInUserGuard } from './logged-in-user.guard';

const routes: Routes = [{
  path: '',
  loadChildren: () => import('./decks/decks.module').then(m => m.DecksModule)
}, {
  path: 'cards',
  loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
}, {
  path: 'decks',
  loadChildren: () => import('./decks/decks.module').then(m => m.DecksModule)
}, {
  path: 'decks/:userId',
  loadChildren: () => import('./decks/decks.module').then(m => m.DecksModule)
}, {
  path: 'decks/view/:deckId',
  loadChildren: () => import('./decks/decks.module').then(m => m.DecksModule)
}, {
    path: 'about',
    component: AboutComponent
  }, {
    path: 'donate',
    component: DonateComponent
  }, {
    path: 'profile',
    component: ProfileComponent, canActivate: [LoggedInUserGuard]
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'register',
    component: RegisterComponent
  }, {
  path: '**',
  component: PageNotFoundComponent
}]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
