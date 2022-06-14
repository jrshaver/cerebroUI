import Bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';

import { SearchModule } from './search/search.module';

import { CardComponent } from './card/card.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { DecklistComponent } from './decks/decklist/decklist.component';
import { DeckEditorComponent } from './decks/deck-editor/deck-editor.component';
import { CardImageComponent } from './card-image/card-image.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { DonateComponent } from './donate/donate.component';
import { HelpComponent } from './help/help.component';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { SharedModule } from './shared/shared.module';
import { DecksModule } from './decks/decks.module';

// configure Bugsnag asap
Bugsnag.start({ apiKey: 'a533490a60acd33f9d879afa64e6a5c5' })

// create a factory which will return the Bugsnag error handler
export function errorHandlerFactory() {
  return new BugsnagErrorHandler()
}

@NgModule({
  declarations: [
    AppComponent,
    CardImageComponent,
    CardComponent,
    ProfileComponent,
    DecklistComponent,
    PageNotFoundComponent,
    AboutComponent,
    DonateComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SearchModule,
    DecksModule,
    HttpClientModule,
    SharedModule,
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
