import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  shared : SharedService;

  constructor() {
    this.shared = SharedService.getInstance();
  }

  logout() : void{ 
    this.shared.token = null;
    this.shared.user = null;
    window.location.href = "/login";
    window.location.reload();
  }

  ngOnInit() {
  }

}
