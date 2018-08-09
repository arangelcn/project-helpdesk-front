import { Component, OnInit, ViewChild } from '@angular/core';
import { Ticket } from '../../model/ticket.model';
import { SharedService } from '../../services/shared.service';
import { TicketService } from '../../services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { ResponseApi } from '../../model/response-api';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {

  @ViewChild("form")
  form: NgForm;

  // Definindo o ticket vazio:
  ticket: Ticket = new Ticket('',0,'','','','',null,null,'',null);

  // Definindo o Servico Compartilhado
  shared: SharedService;

  message : {};
  classCss : {} ;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute) {
      this.shared = SharedService.getInstance();
  }

  // Essa classe será inicializada com um ID, portanto deve ser tratado 
  ngOnInit() {
    let id: string = this.route.snapshot.params['id'];
    if (id != undefined) { 
      this.findById(id);
    }
  }

  // Procura ticket pelo id 
  findById(id: string) { 
    this.ticketService.findById(id).subscribe((responseApi: ResponseApi) => {
      this.ticket = responseApi.data;
      this.ticket.date = new Date(this.ticket.date).toISOString();    
    }, err => { 
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  // Metodo para alterar o status do ticket: 
  changeStatus(status: string) : void { 
    this.ticketService.changeStatus(status, this.ticket)
    .subscribe((responseApi: ResponseApi) =>  {
      this.ticket = responseApi.data;
      this.ticket.date = new Date(this.ticket.date).toISOString();
      this.showMessage({
        type: 'success',
        text: 'Status alterado com sucesso'
      });
    }, err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  getFormGroupClass(isInvalid: boolean, isDirty:boolean): {} {
    return {
      'form-group': true,
      'has-error' : isInvalid  && isDirty,
      'has-success' : !isInvalid  && isDirty
    };
  }

  private showMessage(message: {type: string, text: string}): void {
      this.message = message;
      this.buildClasses(message.type);
      setTimeout(() => {
        this.message = undefined;
      }, 3000);
  }

  private buildClasses(type: string): void {
     this.classCss = {
       'alert': true
     }
     this.classCss['alert-'+type] =  true;
  }

  onFileChange(event): void{
    if(event.target.files[0].size > 2000000){
      this.showMessage({
        type: 'error',
        text: 'Maximum image size is 2 MB'
      });
    } else {
      this.ticket.image = '';
      var reader = new FileReader();
      reader.onloadend = (e: Event) => {
          this.ticket.image = reader.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
