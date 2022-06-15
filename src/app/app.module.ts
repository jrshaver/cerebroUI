import Bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFunctions,getFunctions } from '@angular/fire/functions';

import { CardComponent } from './card/card.component';
import { CardImageComponent } from './card-image/card-image.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { DonateComponent } from './donate/donate.component';
import { HelpComponent } from './help/help.component';

import { SearchModule } from './search/search.module';
import { DecksModule } from './decks/decks.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';


// configure Bugsnag asap
Bugsnag.start({ apiKey: 'a533490a60acd33f9d879afa64e6a5c5' })

// create a factory which will return the Bugsnag error handler
export function errorHandlerFactory() {
  return new BugsnagErrorHandler()
}

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    CardImageComponent,
    ProfileComponent,
    PageNotFoundComponent,
    AboutComponent,
    DonateComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SearchModule,
    DecksModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions())
  ],
  providers: [
    ScreenTrackingService, UserTrackingService, { provide: ErrorHandler, useFactory: errorHandlerFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
