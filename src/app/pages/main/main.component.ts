import {Component, OnInit} from '@angular/core';
import {WebSocketService} from '../../services/web-socket.service';
import {ClockComponent} from '../../components/clock/clock.component';

@Component({
  selector: 'app-main',
  imports: [
    ClockComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  constructor(
    private webSocketService: WebSocketService,
  ) {
  }

  time = new Date();
  intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }
}
