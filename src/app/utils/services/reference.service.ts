import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from './app.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { References } from './model/references';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router:Router,
    private appService: AppService,
  ) { }

  path: string = "https://constructionworks.herokuapp.com/reference/"
  getReference(): Observable<References[]> {
    return this.http.get<References[]>(this.path)
  }

  addReference(body) : Observable<any> {
    const token = this.appService.currentUserValue;

    return this.http.post(this.path, body, {headers: new HttpHeaders({
      'Authorization': "Bearer "+token.access,
         })
      }).pipe(
        map((response : Response) => {
         if(response){
          this.alertService.success("Reference ekleme işlemi başarılı!");
          this.router.navigate(['/']);
          console.log("uloo ress", response);   
         }
         else{
          this.alertService.error("Reference ekleme işlemi başarısız!");
          this.router.navigate(['/']);
          console.log("uloosss ress", response);   
         }
         
         return response; 
        })
    );
  }
}
