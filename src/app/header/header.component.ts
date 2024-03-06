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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
    private modalService: NgbModal
    ) {
      tokenService.tokenEvent.subscribe(userId => { console.log(userId); this.loggedInUser = userId});
    }

  title = 'cerebroUI'; //se'Liaison for the Assortment and Notation of Cerebro Entries';

  loggedInUser!: string;

  ngOnInit() {
    let userId = this.tokenService.getToken();
    if (userId) {
      this.loggedInUser = userId;
    }
  }

  openLoginDialog(): void {
    const modalRef = this.modalService.open(LoginComponent);
  }

  logoff(): void {
    this.tokenService.removeToken();
    window.location.reload();
  }

}
