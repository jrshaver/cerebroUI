import {
  Component,
  OnInit
} from '@angular/core';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  LoginComponent
} from '../login/login.component';
import {
  TokenService
} from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private modalService: NgbModal
    ) {
      tokenService.tokenEvent.subscribe(userId => { console.log(userId); this.loggedInUser = userId});
    }

  title = 'cerebroUI'; //Liaison for the Assortment and Notation of Cerebro Entries';

  loggedInUser!: string;

  ngOnInit() {
    let userId = this.tokenService.getToken();
    if (userId) {
      this.loggedInUser = userId;
    }
  }

  openLoginDialog(): void {
    const modalRef = this.modalService.open(LoginComponent, { size: 'sm' });
  }

  logoff(): void {
    this.authService.logout();
    window.location.assign('/');
  }

}
