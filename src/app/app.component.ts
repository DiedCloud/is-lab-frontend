import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {UserService} from "./services/user.service";
import {CommonModule} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {WebSocketService} from './services/web-socket.service';
import {UserType} from './models/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink,
    CommonModule,
    MatToolbar, MatButton, MatMenuTrigger, MatMenu, MatMenuItem,
    MatTableModule, MatSortModule, MatPaginatorModule, MatInputModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'islab-frontend';

  constructor(
    public userService: UserService,
    public router: Router,
    public webSocketService: WebSocketService
  ) {
  }

  ngOnInit(): void {
    if (this.userService.user$ || localStorage.getItem('authToken')) {
      this.userService.validateUser();
      this.webSocketService.connectWs();
    }
  }

  logout() {
    this.userService.logout()
  }

  admin() {
    this.router.navigate(['/admin']).finally()
  }

  protected readonly UserType = UserType;
}
