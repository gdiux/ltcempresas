import { Component, OnInit } from '@angular/core';
import { Abonado } from 'src/app/models/abonado.model';

// MODELS
import { User } from 'src/app/models/users.model';

// SERVICES
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public user!: Abonado;

  constructor(  private usersService: UsersService) { 

    // CARGAR USER
    this.user = usersService.user;

  }

  ngOnInit(): void {
  }

}
