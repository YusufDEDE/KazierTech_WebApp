import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Category } from './model/category';
import { Observable } from 'rxjs';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
@Injectable()
export class CategoryService {
  success:any;
  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router:Router,
    private appService: AppService,
  ) { }
  path: string = "http://127.0.0.1:8000/category/"
  token = this.appService.currentUserValue;

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
  }

  addCategories(body) : Observable<any> {
    

    return this.http.post(this.path, body, {headers: new HttpHeaders({
      'Authorization': "Bearer "+this.token.access,
         })
      }).pipe(
        map((response : Response) => {
         if(response){
          this.alertService.success("Kategori ekleme işlemi başarılı!");
          this.redirectTo('/category')
          console.log("uloo ress", response);   
         }
         else{
          this.alertService.error("Kategori ekleme işlemi başarısız!");
          this.redirectTo('/category')
          console.log("uloosss ress", response);   
         }
         
         return response; 
        })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.path)
  }

  getDetailCategory(id):Observable<Category[]> {
    return this.http.get<Category[]>(this.path+id+'/')
  }

  updateCategory(id, body){
    return this.http.put(this.path+'detail/'+id+'/', body, {headers: new HttpHeaders({
      'Authorization': "Bearer "+this.token.access,
         })
      })
      .pipe(
        map((response) => {
          this.alertService.success("Kategori Güncelleme işlemi başarılı!");
          this.redirectTo('/category')
          console.log("delete res", response)
        })
      )
  }

  deleteCategory(id){
    return this.http.delete(this.path+'detail/'+id+'/', {headers: new HttpHeaders({
      'Authorization': "Bearer "+this.token.access,
         })
      })
      .pipe(
        map((response) => {
          this.alertService.success("Kategori Silme işlemi başarılı!");
          this.redirectTo('/category')
          console.log("delete res", response)
        })
      )
  }
  
}