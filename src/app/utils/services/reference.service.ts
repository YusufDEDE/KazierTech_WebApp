import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from './app.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { References } from './model/references';
import { ApiConfig } from './ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  public apiconfig = new ApiConfig();

  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router:Router,
    private appService: AppService,
  ) { }

  token = this.appService.currentUserValue;

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
  }

  addReference(body) : Observable<any> {
    return this.http.post(this.apiconfig.path+'/reference/', body, {headers: new HttpHeaders({
      'Authorization': "Bearer "+this.token.access,
         })
      }).pipe(
        map((response : Response) => {
         if(response){
          this.alertService.success("Reference ekleme işlemi başarılı!");
          this.redirectTo('/reference')
          console.log("uloo ress", response);   
         }
         else{
          this.alertService.error("Reference ekleme işlemi başarısız!");
          this.redirectTo('/reference')
          console.log("uloosss ress", response);   
         }
         
         return response; 
        })
    );
  }

  getReference(): Observable<References[]> {
    return this.http.get<References[]>(this.apiconfig.path+'/reference/')
  }

  updateReference(id, body){
    return this.http.put(this.apiconfig.path+'/reference/detail/'+id+'/', body, {headers: new HttpHeaders({
      'Authorization': "Bearer "+this.token.access,
         })
      })
      .pipe(
        map((response) => {
          this.alertService.success("Referans Güncelleme işlemi başarılı!");
          this.redirectTo('/reference')
          console.log("delete res", response)
        })
      )
  }

  deleteReference(id){
    return this.http.delete(this.apiconfig.path+'/reference/detail/'+id+'/', {headers: new HttpHeaders({
      'Authorization': "Bearer "+this.token.access,
         })
      })
      .pipe(
        map((response) => {
          this.alertService.success("Referans Silme işlemi başarılı!");
          this.redirectTo('/reference')
          console.log("delete res", response)
        })
      )
  }
}
