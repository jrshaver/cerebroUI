import {
  Component,
  OnInit
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  AuthService
} from '../services/auth.service';
import {
  Router,
  RoutesRecognized
} from '@angular/router';
import {
  filter,
  pairwise
} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  hasError: boolean = false;
  usernameError: string = '';
  emailError: string = '';
  passwordError: string = '';
  lastRoute: string = '';

  registerForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    emailAddress: new UntypedFormControl('', [Validators.required, Validators.email]),
    passwordHash: new UntypedFormControl('', [Validators.required, Validators.minLength(6)])
  })

  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter((e: any) => e instanceof RoutesRecognized),
      pairwise()
    ).subscribe((e: any) => {
      this.lastRoute = e[0].urlAfterRedirects
    });
  }

  register(): void {
    this.hasError = false;
    this.usernameError = '';
    this.emailError = '';
    this.passwordError = '';

    if (this.registerForm.status == 'VALID') {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe((registerResponse: any) => {
        if (registerResponse.emailAddress) {
          this.authService.login(this.registerForm.value).subscribe((loginResponse: any) => {
            if (loginResponse.emailAddress) {
              this.router.navigate([this.lastRoute]);
            }
          })
        }
      });
    } else {
      this.handleRegisterErrors();
    }

  }

  handleRegisterErrors(): void {
    this.hasError = true;
    //Determine Username Error
    let username = this.registerForm.get('username');
    if (username && username.errors) {
      if (username.errors['required']) {
        this.usernameError = 'Username is required';
      }
    }

    //Determine Email Error
    let email = this.registerForm.get('emailAddress');
    if (email && email.errors) {
      if (email.errors['required']) {
        this.emailError = 'Email is required';
      } else if (email.errors['email']) {
        this.emailError = 'Please enter a valid email address';
      }
    }

    //Determine Password Error
    let password = this.registerForm.get('passwordHash');
    if (password && password.errors) {
      if (password.errors['required']) {
        this.passwordError = 'Password is required';
      } else if (password.errors['minlength']) {
        this.passwordError = 'Passwords are at least 6 characters';
      }
    }
  }
}
