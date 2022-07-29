import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// MODELS
import { Client } from '../../models/clients.model';
import { Product } from 'src/app/models/products.model';

// SERVICES
import { ClientsService } from '../../services/clients.service';
import { SearchService } from '../../services/search.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: [
  ]
})
export class ClientesComponent implements OnInit {

  constructor(  private clientsService: ClientsService,
                private searchService: SearchService,
                private fb: FormBuilder,
                private productsService: ProductsService) { }

  ngOnInit(): void {
    
    // CARGAR CLIENTES
    this.loadClients();

  }

  /** ======================================================================
   * LOAD USERS
  ====================================================================== */
  public desde:number = 0;
  public limite:number = 50;
  public clients: Client[] = [];
  public clientsTemp: Client[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;  

  loadClients(){

    this.cargando = true;
    this.sinResultados = false;           

    this.clientsService.loadClients(this.desde, this.limite)
        .subscribe( ({clients, total}) => {  
          
          // COMPROBAR SI EXISTEN RESULTADOS
          if (clients.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.clients = clients;
          this.clientsTemp = clients;

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }

  /** ======================================================================
   * CREATE
  ====================================================================== */
  public savingNew: boolean = false;
  public newClientSubmitted: boolean = false;
  public newClientForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    cedula: [''],
    email: [''],
    address: [''],
    city: [''],
    department: ['']
  });

  createClient(){

    this.savingNew = true;
    this.newClientSubmitted = true;

    if (this.newClientForm.invalid) {
      this.savingNew = false;
      return;
    }

    this.clientsService.createClient( this.newClientForm.value )
        .subscribe( ({client}) => {

          this.clients.push(client);
          this.total ++;
          this.newClientSubmitted = false;
          this.newClientForm.reset();
          this.savingNew = false;

          Swal.fire('Estupendo', 'El cliente se ha creado exitosamente!', 'success');

        }, (err) => { 
          Swal.fire('Error', err.error.msg, 'error');
          this.savingNew = false;
        });

  }

  /** ======================================================================
   * VALIDATE FORM NEW
  ====================================================================== */
  validateNewForm( campo:string ): boolean{

    if ( this.newClientForm.get(campo)?.invalid && this.newClientSubmitted ) {      
      return true;
    }else{
      return false;
    }

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
   * SELECT
  ====================================================================== */  
  selectClient(client: Client){

    this.editClientForm.reset({
      name: client.name, 
      phone: client.phone, 
      cedula: client.cedula || '', 
      email: client.email || '', 
      address: client.address || '', 
      city: client.city || '', 
      department: client.department || '',
      cid: client.cid
    });

  }

  /** ======================================================================
   * EDIT
  ====================================================================== */
  public savingEdit: boolean = false;
  public editClientSubmitted: boolean = false;
  public editClientForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    cedula: [''],
    email: [''],
    address: [''],
    city: [''],
    department: [''],
    cid:['']
  });

  editClient(){

    this.savingEdit = true;
    this.editClientSubmitted = true;

    if (this.editClientForm.invalid) {
      this.savingEdit = false;
      return;
    }

    this.clientsService.updateClient( this.editClientForm.value, this.editClientForm.value.cid )
        .subscribe( ({client}) => {

          this.clients.push(client);
          this.total ++;
          this.editClientSubmitted = false;
          this.selectClient(client);
          this.loadClients();
          this.savingEdit = false;

          Swal.fire('Estupendo', 'El cliente se ha creado exitosamente!', 'success');

        }, (err) => { 
          console.log(err);
          
          Swal.fire('Error', err.error.msg, 'error');
          this.savingEdit = false;
        });

  }

  /** ======================================================================
   * VALIDATE FORM EDIT
  ====================================================================== */
  validateEditForm( campo:string ): boolean{

    if ( this.editClientForm.get(campo)?.invalid && this.editClientSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }

  /** ======================================================================
   * LOAD PRODUCTS CLIENTS
  ====================================================================== */
  public PorductsClient: Product[] = [];
  public clientSelected!: Client;
  public cargandoProductos: boolean = false;
  public totalProductsClient: number = 0;
  loadProductsClient( client: Client ){

    this.cargandoProductos = true;
    this.PorductsClient = [];
    this.clientSelected = client;
    
    
    this.productsService.loadProductsClient(client.cid!)
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
