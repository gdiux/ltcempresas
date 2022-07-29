import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

// MODELS
import { Preventive } from '../../models/preventives.model';

// SERVICES
import { PreventivesService } from '../../services/preventives.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-preventivos',
  templateUrl: './preventivos.component.html',
  styleUrls: ['./preventivos.component.css']
})
export class PreventivosComponent implements OnInit {

  constructor(  private preventivesServices: PreventivesService,
                private searchService: SearchService,
                private fb: FormBuilder) { }

  ngOnInit(): void {

    this.loadPreventives();
  }

  /** ======================================================================
   * LOAD USERS
  ====================================================================== */
  public desde:number = 0;
  public limite:number = 50;
  public preventives: Preventive[] = [];
  public preventivesTemp: Preventive[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;

  loadPreventives(){

    this.cargando = true;
    this.sinResultados = false;

    this.preventivesServices.loadPreventives(this.desde, this.limite)
        .subscribe( ({ preventives, total }) => {

          // COMPROBAR SI EXISTEN RESULTADOS
          if (preventives.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.preventives = preventives;
          this.preventivesTemp = preventives;          

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }


  /** ======================================================================
   * SEARCH
  ====================================================================== */
  public resultados: number = 0;
  search( termino:string ){

    let query = `desde=${this.desde}&hasta=${this.limite}`;

    if (termino.length === 0) {
      this.preventives = this.preventivesTemp;
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('preventives', termino, query)
        .subscribe( ({resultados}) => {

          this.preventives = resultados;
          this.resultados = resultados.length;

        });   

  }

  /** ================================================================
   *   CAMBIAR PAGINA
  ==================================================================== */
  @ViewChild('mostrar') mostrar!: ElementRef;
  cambiarPagina (valor: number){
    
    this.limite = Number(this.mostrar.nativeElement.value);
    
    if (this.limite > 10) {
      valor = valor * (this.limite/10);      
    }
    
    this.desde += valor;
    
    if (this.desde < 0) {
      this.desde = 0;
    }else if( this.desde > this.total ){
      this.desde -= valor;
    }
    
    this.loadPreventives();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){    

    this.limite = Number(cantidad);
    this.loadPreventives();

  }

  // FIN DE LA CLASE
}
