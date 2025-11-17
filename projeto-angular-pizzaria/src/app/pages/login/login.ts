import { Component } from '@angular/core';
import { UserLoginService } from '../../core/services/userLogin/user-login';
import { User } from '../../core/types/types';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [RouterModule, FormsModule],
})
export class Login {
  emailField = '';
  passwordField = '';
  passwordVisible = false;
  errorMessage = '';

  constructor(private loginService: UserLoginService, private router: Router) {}

  TogglePasswordVisibility(forceHide: boolean = false) {
    this.passwordVisible = forceHide ? false : !this.passwordVisible;
  }

  ValidateLogin() {
    this.loginService.tryLogin(this.emailField, this.passwordField).subscribe({
      next: (user: User | null) => {
        if (user) {
          console.log('Login bem-sucedido', user);
          this.loginService.setUser(user);
          this.errorMessage = '';
          this.router.navigate(['/offers']);
        } else {
          // Aqui estou forçando o erro
          throw (this.errorMessage = 'Email ou senha inválidos');
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao tentar login';
      },
    });
  }
}
