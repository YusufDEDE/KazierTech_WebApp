import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { Jobs } from './model/jobs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(
    private http: HttpClient,
    private alertService: ToastrService,
    private router:Router,
    private appService: AppService,
  ) { }

  path: string = "http://127.0.0.1:8000/jobs/"
  getJobs(): Observable<Jobs[]> {
    return this.http.get<Jobs[]>(this.path)
  }

  addJobs(body) : Observable<any> {
    const token = this.appService.currentUserValue;

    return this.http.post(this.path, body, {headers: new HttpHeaders({
      'Authorization': "Bearer "+token.access,
         })
      }).pipe(
        map((response : Response) => {
         if(response){
          this.alertService.success("İş ekleme işlemi başarılı!");
          this.router.navigate(['/']);
          console.log("uloo ress", response);   
         }
         else{
          this.alertService.error("iş ekleme işlemi başarısız!");
          this.router.navigate(['/']);
          console.log("uloosss ress", response);   
         }
         
         return response; 
        })
    );
  }
}
