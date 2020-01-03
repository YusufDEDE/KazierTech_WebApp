import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { Jobs } from './model/jobs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfig } from './ApiConfig';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

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

  addJobs(body) : Observable<any> {
    return this.http.post(this.apiconfig.path+'/jobs/', body, {headers: new HttpHeaders({
      'Authorization': "Bearer "+this.token.access,
         })
      }).pipe(
        map((response : Response) => {
         if(response){
          this.alertService.success("İş ekleme işlemi başarılı!");
          this.redirectTo('/jobs')
          console.log("uloo ress", response);   
         }
         else{
          this.alertService.error("iş ekleme işlemi başarısız!");
          this.redirectTo('/jobs')
          console.log("uloosss ress", response);   
         }
         
         return response; 
        })
    );
  }

  getJobs(): Observable<Jobs[]> {
    return this.http.get<Jobs[]>(this.apiconfig.path+'/jobs/')
  }

  updateJobs(id, body){
    console.log("token", this.token.access)
    return this.http.put(this.apiconfig.path+'/jobs/detail/'+id+'/', body, {headers: new HttpHeaders({
      'Authorization': "Bearer "+this.token.refresh,
         })
      })
      .pipe(
        map((response) => {
          this.alertService.success("İş Güncelleme işlemi başarılı!");
          this.redirectTo('/jobs')
          console.log("delete res", response)
        })
      )
  }

  deleteJobs(id){
    return this.http.delete(this.apiconfig.path+'/jobs/detail/'+id+'/', {headers: new HttpHeaders({
      'Authorization': "Bearer "+this.token.access,
         })
      })
      .pipe(
        map((response) => {
          this.alertService.success("İş Silme işlemi başarılı!");
          this.redirectTo('/jobs')
          console.log("delete res", response)
        })
      )
  }
}
