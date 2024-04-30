// import Bugsnag from '@bugsnag/js';
// import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { SearchModule } from './search/search.module';
import { DecksModule } from './decks/decks.module';
import { SharedModule } from './shared/shared.module';

// configure Bugsnag asap
// Bugsnag.start({ apiKey: 'a533490a60acd33f9d879afa64e6a5c5' })

// // create a factory which will return the Bugsnag error handler
// export class AppErrorHandler implements ErrorHandler {
//   handleError(error: any) {
//    Bugsnag.notify(error)
//    console.error(error)
//  }
// }

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    ProfileComponent,
    PageNotFoundComponent,
    // AboutComponent,
    // DonateComponent,
    // HelpComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SearchModule,
    DecksModule,
    SharedModule,
  ],
  providers: [
    // { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
