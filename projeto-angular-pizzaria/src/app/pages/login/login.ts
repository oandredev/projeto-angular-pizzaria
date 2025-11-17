import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../core/types/types';

@Component({
  selector: 'app-login',
  imports: [RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
