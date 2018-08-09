import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { DialogService } from '../../dialog.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ResponseApi } from '../../model/response-api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  page: number = 0;
  count: number = 5; 
  pages: Array<number>;
  shared: SharedService;
  message: {};
  classCss: {};
  listUser = [];

  constructor(
    private dialogService: DialogService, // Dialogo de confirmação
    private userService: UserService,     
    private router: Router) {
      
      this.shared = SharedService.getInstance();

  }


  ngOnInit() {
    this.findAll(this.page, this.count);
  }

  //Procurar todos os usuários no banco
  findAll(page: number, count: number) { 
    this.userService.findAll(page, count).subscribe((responseApi: ResponseApi) => { 
      this.listUser = responseApi['data']['content'];
      this.pages = new Array(responseApi['data']['totalPages']);

    }, err => { 
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

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

  // Metodo para edição de usuários:
  edit(id: string) { 
    this.router.navigate(['/user-new', id]); // Faz uma pesquisa e traz o usuário para a tela de cadastro
  }

  // Metodo para excluir usuário:
  delete(id: string) {
    this.dialogService.confirm('Do you want to delete the user ?')
    .then((canDelete: boolean) => { 
      if (canDelete) {
        this.message = {};
        // Exclui o usuario no banco
        this.userService.delete(id).subscribe((responseApi: ResponseApi) =>  {
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
