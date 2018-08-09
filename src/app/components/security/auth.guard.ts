import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { SharedService } from "../../services/shared.service";
import { UserService } from "../../services/user.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

// Classe responsável por verificar se há usuário logado
// Se existe => exibe console
// Caso contrário, redireciona para login; 
@Injectable()
export class AuthGuard implements CanActivate {

    public shared: SharedService;

    constructor(private userService: UserService,
        private router: Router) {
        this.shared = SharedService.getInstance();
    }

    canActivate(
        route: ActivatedRouteSnapshot, //Pega um snapshot do caminho atual  
        state: RouterStateSnapshot): Observable<boolean> | boolean { 
        if (this.shared.isLoggedIn()) { //Se está logado 
            return true;                // Libera a rota 
        }
        this.router.navigate(['/login']);   // Se não, redireciona para o login 
        return false;
    }
    
}