import { DialogService } from './../../dialog.service';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Ticket } from '../../model/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';
import { ResponseApi } from '../../model/response-api';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  assignedToMe: boolean = false;
  page: number = 0;
  count: number = 5;
  pages: Array<number>;
  shared: SharedService;
  message: {};
  classCss: {};
  listTicket = [];
  ticketFilter = new Ticket('',null,'','','','',null,null,'',null);

  constructor(
    private dialogService: DialogService,
    private ticketService: TicketService,
    private router: Router) {
      this.shared = SharedService.getInstance();
  }

  ngOnInit() {
    this.findAll(this.page, this.count);
  }

   //Procurar todos os tickets no banco
   findAll(page: number, count: number) { 
    this.ticketService.findAll(page, count).subscribe((responseApi: ResponseApi) => { 
      this.listTicket = responseApi['data']['content'];
      this.pages = new Array(responseApi['data']['totalPages']);

    }, err => { 
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  // Métodos para trabalhar as mensagens de sucesso e erro
  private showMessage(message: {type: string, text: string}) : void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => { 
      this.message = undefined;
    }, 3000); // Define um tempo de exibição da mensagem 
  }

  private buildClasses(type: string):void {
    this.classCss = {
      'alert' : true
    }
    this.classCss['alert-'+type] = true;
  }

  // Metodo para fazer os filtros de pesquisa: 
  filter() : void { 
    this.page = 0;
    this.count = 5;
    this.ticketService.findByParams(this.page,this.count,this.assignedToMe,this.ticketFilter)
    .subscribe((responseApi: ResponseApi) => {
      this.ticketFilter.title = this.ticketFilter.title == 'uninformed' ? '' : this.ticketFilter.title;
      this.ticketFilter.number = this.ticketFilter.number == 0 ? null : this.ticketFilter.number;
      this.listTicket = responseApi['data']['content'];
      this.pages = new Array(responseApi['data']['totalPages']);
    }, err => { 
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  // Metodo para limpar os filtros: 
  cleanFilter() { 
    this.assignedToMe = false;
    this.page = 0;
    this.count = 5;
    this.ticketFilter = new Ticket('',null,'','','','',null,null,'',null);
    this.findAll(this.page, this.count); // Não é boa prática para aplicões grandes 
  }

  // Metodo para editar um ticket: 
  edit(id: string) { 
    this.router.navigate(['/ticket-new', id]);
  }

  // Metodo para detalhar um ticket: 
  detail(id: string) { 
    this.router.navigate(['/ticket-detail', id]);
  }

  // Metodo para excluir um ticket:
  delete(id: string) {
    this.dialogService.confirm('Do you want to delete the ticket ?')
    .then((canDelete: boolean) => { 
      if (canDelete) {
        this.message = {};
        // Exclui o usuario no banco
        this.ticketService.delete(id).subscribe((responseApi: ResponseApi) =>  {
          // Exibe a mensagem de que foi excluido com sucesso 
          this.showMessage({
            type: 'success',
            text: 'Registro excluído'
          });
          // Recarrega a página: 
          this.findAll(this.page, this.count);
        }, err => { 
          this.showMessage({
            type: 'error',
            text: err['error']['errors'][0]
          });
        });
      }
    });
  }

  // Paginações:
  
  // Método responsável pela paginação next:
  setNextPage(event: any) {
    event.preventDefault();
    if (this.page + 1 < this.pages.length) { 
      this.page = this.page + 1;
      this.findAll(this.page, this.count);
    }
  }

  // Método responsável pela paginação previous:
  setPeviousPage(event: any) {
    event.preventDefault();
    if (this.page > 0) { 
      this.page = this.page - 1;
      this.findAll(this.page, this.count);
    }
  }

  // Método responsável pela paginação pelo índice:
  setPage(i, event: any) {
    event.preventDefault();
    if (this.page > 0) { 
      this.page = i;
      this.findAll(this.page, this.count);
    }
  }

}
