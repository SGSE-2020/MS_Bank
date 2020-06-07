import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AccViewComponent } from './acc-view/acc-view.component';
import { ContactCardComponent } from './contact-card/contact-card.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { OverviewComponent } from './overview/overview.component';
import { AccviewComponent } from './accview/accview.component';
import { ExchangeviewComponent } from './exchangeview/exchangeview.component';
import { AdvisorviewComponent } from './advisorview/advisorview.component';
import { SettingsviewComponent } from './settingsview/settingsview.component';
import { LogginviewComponent } from './logginview/logginview.component';
import { AcccardComponent } from './acccard/acccard.component';

const routes: Routes = [
  { path: "./acc-view/acc-view.component", component: AccViewComponent},
  { path: "./acccard/acccard.component", component: AcccardComponent},
  { path: "./contact-card/contact-card.component", component: ContactCardComponent},
  { path: "./nav/nav.component", component: NavComponent},
  { path: "./toolbar/toolbar.component", component: ToolbarComponent},
  { path: "" , component: OverviewComponent},
  { path: "account" , component: AccviewComponent},
  { path: "exchange" , component: ExchangeviewComponent},
  { path: "advisor" , component: AdvisorviewComponent},
  { path: "settings" , component: SettingsviewComponent},
  { path: "login" , component: LogginviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
