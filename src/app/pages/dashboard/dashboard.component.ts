import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// MODELS
import { Product } from 'src/app/models/products.model';
import { User } from '../../models/users.model';

// SERVICES
import { ProductsService } from '../../services/products.service';
import { UsersService } from '../../services/users.service';
import { Corrective } from 'src/app/models/correctives.model';
import { Preventive } from '../../models/preventives.model';
import { PreventivesService } from '../../services/preventives.service';
import { CorrectivesService } from '../../services/correctives.service';
import { Abonado } from 'src/app/models/abonado.model';
import { ClientsService } from '../../services/clients.service';
import { SearchService } from '../../services/search.service';
import { Client } from 'src/app/models/clients.model';
import Swal from 'sweetalert2';
import { AbonadosService } from '../../services/abonados.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  public user!: Abonado;

  constructor(  private productsService: ProductsService,
                private usersService: UsersService,
                private clientsService: ClientsService,
                private searchService: SearchService,
                private abonadosService: AbonadosService,
                private preventivesServices: PreventivesService,
                private correctivesService: CorrectivesService,) {  }

  ngOnInit(): void {

    this.user = this.usersService.user;

    // CARGAR CLIENTES
    this.loadClients();

  }

  /** ======================================================================
   * LOAD USERS
  ====================================================================== */
  public desde:number = 0;
  public limite:number = 50;
  public clients: any[] = [];
  public clientsTemp: Client[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;  

  loadClients(){

    this.cargando = true;
    this.sinResultados = false;    

    this.abonadosService.loadAbonadoId(this.user.aid!)
        .subscribe( ({abonado}) => {            
          
          // COMPROBAR SI EXISTEN RESULTADOS
          if (abonado.clients!.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = abonado.clients!.length;
          this.clients = abonado.clients!;
          

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }

  /** ======================================================================
   * SEARCH
  ====================================================================== */
  public resultados: number = 0;
  search( termino:string ){

    let query = `desde=${this.desde}&hasta=${this.limite}`;

    if (termino.length === 0) {
      this.clients = this.clientsTemp;
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('clients', termino, query)
        .subscribe( ({resultados}) => {

          this.clients = resultados;
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
    
    this.loadClients();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){    

    this.limite = Number(cantidad);
    this.loadClients();

  }

  /** ======================================================================
   * LOAD PRODUCTS CLIENTS
  ====================================================================== */
  public PorductsClient: Product[] = [];
  public clientSelected!: Client;
  public cargandoProductos: boolean = false;
  public totalProductsClient: number = 0;
  loadProductsClient( client: any ){

    this.cargandoProductos = true;
    this.PorductsClient = [];
    this.clientSelected = client;
    
    this.productsService.loadProductsClient(client._id)
    .subscribe( ({products}) => {

          this.cargandoProductos = false;
          this.PorductsClient = products;
          this.totalProductsClient = products.length;       
          
        }, (err) => {
          console.log(err);
          this.totalProductsClient = 0;
          this.PorductsClient = [];
          this.cargandoProductos = false;
          Swal.fire('Error', err.error.msg, 'error');
          
        });

  }
  

  // FIN DE LA CLASE
}
