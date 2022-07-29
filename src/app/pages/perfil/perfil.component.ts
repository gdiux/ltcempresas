import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// SERVICES
import { UsersService } from '../../services/users.service';
import { PreventivesService } from '../../services/preventives.service';
import { CorrectivesService } from '../../services/correctives.service';

// MODELS
import { User } from '../../models/users.model';
import { Preventive } from '../../models/preventives.model';
import { Corrective } from '../../models/correctives.model';
import { Abonado } from 'src/app/models/abonado.model';
import { AbonadosService } from '../../services/abonados.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private usersService: UsersService,
                private abonadosService: AbonadosService,
                private router: Router,
                private fb: FormBuilder) { 
                  
                  this.user = usersService.user;

                }

  ngOnInit(): void {

    this.getForm();

  }

  /** ================================================================
   *  CARGAR USUARIO
  ==================================================================== */
  public user!: Abonado;

  /** ================================================================
   *  GET FORM
  ==================================================================== */
  getForm(){

    this.formUpdate.reset({
      usuario: this.user.usuario,
      name: this.user.name,
      password: '',
      repassword: ''
    });

  }

  /** ================================================================
   *  ACTUALIZAR USUARIO
  ==================================================================== */
  public formUpdateSubmitted: boolean = false;
  public formUpdate = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.minLength(6)]],
    repassword: ['', [Validators.minLength(6)]],
  });

  updateUser(){

    this.formUpdateSubmitted = true;

    if (this.formUpdate.invalid) {
      return;
    }

    if (this.formUpdate.value.password === '') {
      
      this.formUpdate.reset({
        usuario: this.formUpdate.value.usuario,
        name: this.formUpdate.value.name
      });
      
    }

    this.abonadosService.updateAbonado(this.formUpdate.value, this.user.aid!)
        .subscribe( ({abonado}) => {

          this.user = abonado;

          this.usersService.user.name = this.user.name;
          this.usersService.user.usuario = this.user.usuario;

        });

  }

  /** ======================================================================
   * VALIDATE FORM EDIT
  ====================================================================== */
  validateEditForm( campo:string ): boolean{

    if ( this.formUpdate.get(campo)?.invalid && this.formUpdateSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }


  // FIN DE LA CLASE
}
