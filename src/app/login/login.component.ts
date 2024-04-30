import {
  Component,
  OnInit
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import Bugsnag from '@bugsnag/js';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  AuthService
} from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hasError: boolean = false;
  emailError: string = '';
  passwordError: string = '';

  isLoading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit(): void {};

  loginForm = new UntypedFormGroup({
    emailAddress: new UntypedFormControl('', [Validators.required]),
    passwordHash: new UntypedFormControl('', [Validators.required, Validators.minLength(6)])
  });

  login(): void {
    this.hasError = false;
    this.emailError = '';
    this.passwordError = '';

    if (this.loginForm.status == 'VALID') {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.activeModal.close();
          this.isLoading = false;
        },
        error: (e) => {
          console.log(e);
          this.isLoading = false;
        },
        complete: () => console.info('complete')
      });
    } else {
      this.hasError = true;
      //Determine Email Error
      let email = this.loginForm.get('emailAddress');
      if (email && email.errors) {
        this.emailError = 'Email or Username is required';
      }

      //Determine Password Error
      let password = this.loginForm.get('passwordHash');
      if (password && password.errors) {
        if (password.errors['required']) {
          this.passwordError = 'Password is required';
        } else if (password.errors['minlength']) {
          this.passwordError = 'Passwords are at least 6 characters';
        }
      }
    }
    this.loginForm.patchValue({ passwordHash: '' });
  }

  // forgotPassword(): void {
  //   let email = this.loginForm.value.emailAddress;
  //   let emailConfirmation = confirm('Send password reset information to ' + email + '?');
  //   if (emailConfirmation) {
  //     const auth = getAuth();
  //     sendPasswordResetEmail(auth, email)
  //       .then(() => {
  //         // Password reset email sent!
  //         alert("Password reset email sent to " + email);
  //       })
  //       .catch((error: any) => {
  //         Bugsnag.notify(error);
  //         Bugsnag.
  //       });
  //   }
  // }

}
