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
  ToastService
} from '../services/toast.service';
import {
  TokenService
} from '../services/token.service';
import {
  AuthService
} from '../services/auth.service';
import {
  Router
} from '@angular/router';
import { PackService } from '../services/pack.service';
import { FilterOption } from '../../config/constants';

export interface User {
  created: string,
  emailAddress: string,
  passwordHash: string,
  updated: string,
  username: string,
  _id: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user!: User;
  packs!: FilterOption[];

  hasError: boolean = false;
  emailError: string = '';
  passwordError: string = '';

  isLoading: boolean = false;

  profileForm!: any;

  constructor(
    private packService: PackService,
    private authService: AuthService,
    private tokenService: TokenService,
    public toastService: ToastService,
    private router: Router) {}

  ngOnInit(): void {
    let userId = this.tokenService.getToken();
    console.log(userId);
    if (userId) {
      this.authService.getUser(userId).subscribe((response: any) => {
        console.log(response);
        let returnedUserObject = response[0];
        if (returnedUserObject) {
          returnedUserObject.created = new Date(Number(returnedUserObject.created)).toLocaleDateString();
          returnedUserObject.updated = new Date(Number(returnedUserObject.updated)).toLocaleDateString();
          this.user = returnedUserObject;

          this.profileForm = new UntypedFormGroup({
            emailAddress: new UntypedFormControl(this.user.emailAddress, [Validators.required, Validators.email]),
            passwordHash: new UntypedFormControl('', [Validators.required, Validators.minLength(6)])
          })

        }
      });
      this.packService.getAllPacks().subscribe(packs => this.packs = packs);
    } else {
      this.router.navigate(['404']);
    }
  }
  
  updateProfile(): void {
    console.log(this.profileForm);
    if (this.profileForm.status == 'VALID') {
      let id = this.tokenService.getToken();
      if (id) {
        this.authService.updateUser(this.profileForm.value).subscribe((response) => {
          console.log(response);
          if (!this.profileForm.controls['email'].pristine) {
            // Email updated!
            this.toastService.show('Email has been updated', {
              title: 'Saved',
              classname: 'bg-success text-light'
            });
          }
          if (!this.profileForm.controls['password'].pristine) {
            // Update successful.
            this.toastService.show('Password has been updated', {
              title: 'Saved',
              classname: 'bg-success text-light'
            })
          }
        });
      }
    }
  }
}
