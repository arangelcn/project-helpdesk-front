import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { SharedService } from './../../services/shared.service';
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

// Essa classe intercepta toda requisição HttpClient e coloca o Authorization no Header
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    // Instancia do servico compartilhado
    shared : SharedService;
    constructor() { 
          this.shared = SharedService.getInstance();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
        // Autorização: se o usuario ja está logado, clone o token dele 
        let authRequest : any;
        if(this.shared.isLoggedIn()){
            authRequest = req.clone({
                setHeaders: {
                    'Authorization' : this.shared.token
                }
            });
            return next.handle(authRequest);
        } else {
            return next.handle(req);
        }
    }

}