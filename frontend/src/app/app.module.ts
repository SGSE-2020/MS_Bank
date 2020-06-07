import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { AngularFireModule } from 'angularfire';
//import { AngularFirestoreModule } from '@firebase/firestore';
//import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ContactCardComponent } from './contact-card/contact-card.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { OverviewComponent } from './overview/overview.component';
import { AccviewComponent } from './accview/accview.component';
import { ExchangeviewComponent } from './exchangeview/exchangeview.component';
import { AccViewComponent } from './acc-view/acc-view.component';
import { AdvisorviewComponent } from './advisorview/advisorview.component';
import { SettingsviewComponent } from './settingsview/settingsview.component';
import { LogginviewComponent } from './logginview/logginview.component';
import { AcccardComponent } from './acccard/acccard.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ContactCardComponent,
    ToolbarComponent,
    OverviewComponent,
    AccviewComponent,
    ExchangeviewComponent,
    AccViewComponent,
    AdvisorviewComponent,
    SettingsviewComponent,
    LogginviewComponent,
    AcccardComponent
  ],
  imports: [
    BrowserModule,
    //AngularFireModule.initializeApp(environment.firebase),
    //AngularFirestoreModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
