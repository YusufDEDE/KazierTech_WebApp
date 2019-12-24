import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppService } from '../utils/services/app.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AppService,
        private alertService: ToastrService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.authenticationService.test();
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        if (this.f.username.value == '' && this.f.password.value == ''){
            this.alertService.error("Kullancı adı veya şifre boş bırakılamaz!");
            this.loading = false;
        }else{
            this.loading = true;
            console.log(this.f.username.value, this.f.password.value);
            this.authenticationService.login(this.f.username.value, this.f.password.value)
                .pipe(first())
                .subscribe(
                    data => {
                        console.log("win", data);
                        if(!data.access)
                        {
                            this.alertService.error("Kullanıcı adı veya şifre hatalı!");
                            this.loading = false;
                            this.f.username.setValue('');
                            this.f.password.setValue('');
                            
                        }
                        else{
                            this.router.navigate([this.returnUrl]);
                        }
                        console.log(data)
                    });
                    
        }
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

       

            
    
    }
}