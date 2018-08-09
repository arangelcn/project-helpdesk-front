import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../model/user.model';
import { HELP_DESK_API } from './helpdesk.api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  // Login na aplicação
  login(user: User) {
    return this.http.post(`${HELP_DESK_API}/api/auth`, user);
  }

  // Criar ou atualizar um usuário:
  createOrUpdate(user: User) { 
    if (user.id != null && user.id != '') { 
      // Update
      return this.http.put(`${HELP_DESK_API}/api/user`, user);
    } else { 
      // Create New
      user.id = null;
      return this.http.post(`${HELP_DESK_API}/api/user`, user);
    }
  }

  // Todos os registros com paginação
  findAll(page: number, count: number) {
    return this.http.get(`${HELP_DESK_API}/api/user/${page}/${count}`);
  }

  // Procurar usuarios pelo ID 
  findById(id: string) {
    return this.http.get(`${HELP_DESK_API}/api/user/${id}`);
  }

  // Deletar um usuário:
  delete (id: string) { 
    return this.http.delete(`${HELP_DESK_API}/api/user/${id}`);
  }

}
