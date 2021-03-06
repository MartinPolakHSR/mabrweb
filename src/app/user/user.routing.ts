import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterGuard } from './guards/register.guard';


export const USER_ROUTES: Routes = [
  {path: 'list', component: UserListComponent},
  {path: 'detail', component: UserDetailComponent},
  {path: 'login', component: UserLoginComponent},
  {path: 'register', component: UserRegisterComponent, canActivate: [RegisterGuard]},
  {path: 'profile', component: ProfileComponent},
];
