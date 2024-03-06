import Bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService } from '@angular/fire/analytics';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR } from "@angular/fire/compat/auth";

import { provideAuth,getAuth } from '@angular/fire/auth';

import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { SearchModule } from './search/search.module';
import { DecksModule } from './decks/decks.module';
import { SharedModule } from './shared/shared.module';
import { FirebaseModule } from './shared/firebase.module';

// configure Bugsnag asap
Bugsnag.start({ apiKey: 'a533490a60acd33f9d879afa64e6a5c5' })

// create a factory which will return the Bugsnag error handler
export class AppErrorHandler implements ErrorHandler {
  handleError(error: any) {
   Bugsnag.notify(error)
   console.error(error)
 }
}

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
    AngularFireAuthModule,
    AngularFireModule,
    FormsModule,
    ReactiveFormsModule,
    SearchModule,
    DecksModule,
    SharedModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    FirebaseModule
  ],
  providers: [
    ScreenTrackingService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: USE_AUTH_EMULATOR, useValue: !environment.production ? ['localhost', 4200] : undefined }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
