import Bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { HttpClientModule } from '@angular/common/http';

import { CuiSearchComponent } from './cui-search/cui-search.component';
import { CardComponent } from './card/card.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { DecklistComponent } from './decklist/decklist.component';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { CuiFilterComponent } from './cui-filter/cui-filter.component';
import { CardImageComponent } from './card-image/card-image.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { DonateComponent } from './donate/donate.component';
import { HelpComponent } from './help/help.component';
import { provideFunctions,getFunctions } from '@angular/fire/functions';

// configure Bugsnag asap
Bugsnag.start({ apiKey: 'a533490a60acd33f9d879afa64e6a5c5' })

// create a factory which will return the Bugsnag error handler
export function errorHandlerFactory() {
  return new BugsnagErrorHandler()
}

@NgModule({
  declarations: [
    AppComponent,
    CuiSearchComponent,
    CardImageComponent,
    CardComponent,
    ProfileComponent,
    DecklistComponent,
    DeckEditorComponent,
    CuiFilterComponent,
    PageNotFoundComponent,
    AboutComponent,
    DonateComponent,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatSelectModule,
    MatGridListModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
    DragDropModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions())
  ],
  providers: [
    ScreenTrackingService,UserTrackingService, { provide: ErrorHandler, useFactory: errorHandlerFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
