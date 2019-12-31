import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Category } from './model/category';
import { Observable } from 'rxjs';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable()
export class CategoryService {
  success:any;
  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router:Router,
    private appService: AppService,
  ) { }
  path: string = "https://constructionworks.herokuapp.com/category/"
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.path)
  }

  addCategories(body) : Observable<any> {
    const token = this.appService.currentUserValue;

    return this.http.post(this.path, body, {headers: new HttpHeaders({
      'Authorization': "Bearer "+token.access,
         })
      }).pipe(
        map((response : Response) => {
         if(response){
          this.alertService.success("Kategori ekleme işlemi başarılı!");
          this.router.navigate(['/']);
          console.log("uloo ress", response);   
         }
         else{
          this.alertService.error("Kategori ekleme işlemi başarısız!");
          this.router.navigate(['/']);
          console.log("uloosss ress", response);   
         }
         
         return response; 
        })
    );
  }
  
}