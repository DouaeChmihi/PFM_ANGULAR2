import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { User } from '../../../../shared/models/user'; // Importer l'énumération UserRole
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  role: string = ''; // Initialiser à une chaîne vide

  constructor(private userService: AuthService, private router: Router) { }

  signUp(): void {
    if (this.role.trim() === '') {
      this.errorMessage = 'Please select a role.';
      return; // Ne pas soumettre le formulaire si aucun rôle n'est sélectionné
    }

    const newUser: User = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.userService.signUp(newUser).subscribe(
      (response) => {
        // Handle successful sign-up
        alert('Registration successful.');
        this.router.navigate(['/signin']); // Redirect to sign-in page
      },
      (error) => {
        this.errorMessage = error.message || 'An error occurred during sign-up.';
      }
    );
  }
}
