import {Routes} from '@angular/router';
import {AuthenticationGuard} from './authentication.guard';
import {AuthorizationComponent} from './pages/authorization/authorization.component';
import {TicketsComponent} from './pages/tickets/tickets.component';
import {EventsComponent} from './pages/events/events.component';
import {VenuesComponent} from './pages/venues/venues.component';
import {CreateObjectComponent} from './components/create-object/create-object.component';
import {MainComponent} from './pages/main/main.component';
import {AdminComponent} from './pages/admin/admin.component';
import {ImportHistoryComponent} from './pages/import-history/import-history.component';
// import {EventInfoComponent} from './pages/event-info/event-info.component';
// import {TicketInfoComponent} from './pages/ticket-info/ticket-info.component';
// import {VenueInfoComponent} from './pages/venue-info/venue-info.component';

export const routes: Routes = [
  {
    path: 'authorization',
    component: AuthorizationComponent,
    children: [
      {
        path: '**',
        redirectTo: ''
      }
    ],
  },
  {
    path: 'tickets',
    component: TicketsComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: 'events',
    component: EventsComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: 'venues',
    component: VenuesComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: "**",
        redirectTo: ''
      }
    ]
  },
  {
    path: 'history',
    component: ImportHistoryComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: "**",
        redirectTo: ''
      }
    ]
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthenticationGuard],
    children: [
      // {
      //   path: 'ticket',
      //   children: [
      //     {
      //       path: '',
      //       component: TicketInfoComponent,
      //     },
      //     {
      //       path: '**',
      //       redirectTo: ''
      //     }
      //   ]
      // },
      // {
      //   path: 'event',
      //   children: [
      //     {
      //       path: '',
      //       component: EventInfoComponent,
      //     },
      //     {
      //       path: '**',
      //       redirectTo: ''
      //     }
      //   ]
      // },
      // {
      //   path: 'venue',
      //   children: [
      //     {
      //       path: '',
      //       component: VenueInfoComponent,
      //     },
      //     {
      //       path: '**',
      //       redirectTo: ''
      //     }
      //   ]
      // },
      {
        path: '**',
        redirectTo: ''
      },
    ]
  },
];
