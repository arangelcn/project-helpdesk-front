import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Ticket } from '../../model/ticket.model';
import { SharedService } from '../../services/shared.service';
import { TicketService } from '../../services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { ResponseApi } from '../../model/response-api';

@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.component.html',
  styleUrls: ['./ticket-new.component.css']
})
export class TicketNewComponent implements OnInit {

  // Define o formulário filho da classe
  @ViewChild("form")
  form : NgForm

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

  ngOnInit() {
    let id : string = this.route.snapshot.params['id'];
    if (id != undefined) { 
      this.findById(id);
    }
  }

  // Procura ticket pelo id 
  findById(id: string) { 
    this.ticketService.findById(id).subscribe((responseApi: ResponseApi) => {
      this.ticket = responseApi.data;
    }, err => { 
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  // Exibir mensagens 
  private showMessage(message: {type: string, text: string}) : void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => { 
      this.message = undefined;
    }, 3000);
  }
 
  // Construir as mensagens de sucesso e erro:
  private buildClasses(type: string):void {
    this.classCss = {
      'alert' : true
    }
    this.classCss['alert-'+type] = true;
  }

  getFormGroupClass(isInvalid: boolean, isDirty:boolean): {} {
    return {
      'form-group': true,
      'has-error' : isInvalid  && isDirty,
      'has-success' : !isInvalid  && isDirty
    };
  }

  // Registrar ticket
  register(){
    this.message = {};
    this.ticketService.createOrUpdate(this.ticket).subscribe((responseApi:ResponseApi) => {
        this.ticket = new Ticket('',0,'','','','',null,null,'',null);
        let ticket : Ticket = responseApi.data;
        this.form.resetForm();
        this.showMessage({
          type: 'success',
          text: `Registered ${ticket.title} successfully`
        });
    } , err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  // Ler a imagem em anexo
  onFileChange(event) : void { 
    if (event.target.files[0].size > 2000000) {
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
