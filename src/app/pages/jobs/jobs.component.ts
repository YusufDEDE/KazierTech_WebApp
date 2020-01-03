import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Jobs } from 'src/app/utils/services/model/jobs';
import { CategoryService } from 'src/app/utils/services/category.service';
import { AppService } from 'src/app/utils/services/app.service';
import { JobsService } from 'src/app/utils/services/jobs.service';
import { Category } from 'src/app/utils/services/model/category';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
  providers:[CategoryService]
})
export class JobsComponent implements OnInit {
  jobsForm: FormGroup;
  categories: Category[];
  jobs : Jobs[];
  required = false;
  required2 = false;
  required3 = false;

  loading = false;
  update = false;
  add = true;

  jobID:any;
  
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  
  constructor(
    private categoryService: CategoryService,
    private jobsService : JobsService,
    private formBuilder: FormBuilder,
    private appService: AppService,
  ) { }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
  }

  ngOnInit() {
    this.getCategories()
    this.getJobs()
    this.jobsForm = this.formBuilder.group({
      categoryName:['', Validators.required],
      jobName: ['', Validators.required],
      jobPic: ['', Validators.required]
     });
         
  }
  get f() { return this.jobsForm.controls; } 

  onSubmit () {
    if (this.f.categoryName.value == '' || this.f.jobName.value == '' || this.fileData == null ){
      this.required = false;
      this.required2 = false;
      this.required3 = false;
      if (this.f.categoryName.value == '') {
        this.required = true;
      }
      if (this.f.jobName.value == '') {
        this.required2 = true;
      }
      if (this.fileData == null){
        this.required3 = true;
      }
    }else {
      this.loading = true;
      const bodyFormData = new FormData();
      bodyFormData.set('category', this.f.categoryName.value);
      bodyFormData.set('job_name', this.f.jobName.value);
      bodyFormData.append('job_picture', this.fileData);

      this.jobsService.addJobs(bodyFormData)
      .subscribe(response => {
        console.log("add Category", response);
      });
    }
  }

  canUpdateBtn(id, categoryName, jobName) {
    console.log("id : ", id);
    if (!this.update){
      this.jobID = id;
      this.f.categoryName.setValue(categoryName)
      this.f.jobName.setValue(jobName)
      this.update = true;
      this.add = false;
    }else {
      this.update = false;
      this.add = true;

      this.f.categoryName.setValue('')
      this.f.jobName.setValue('')
    }
    
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(data => {
      console.log(data)
      this.categories = data;
    })
  }

  getJobs() {
    this.jobsService.getJobs().subscribe(data => {
      console.log("jobs", data)
      this.jobs = data;
    })
  }

  onUpdateJob(id){
    if (this.f.categoryName.value == '' || this.f.jobName.value == '' || this.fileData == null ){
      this.required = false;
      this.required2 = false;
      this.required3 = false;
      if (this.f.categoryName.value == '') {
        this.required = true;
      }
      if (this.f.jobName.value == '') {
        this.required2 = true;
      }
      if (this.fileData == null){
        this.required3 = true;
      }
    }
    else {  
      this.loading = true;
      const bodyFormData = new FormData();
      bodyFormData.set('category', this.f.categoryName.value);
      bodyFormData.set('job_name', this.f.jobName.value);
      bodyFormData.append('job_picture', this.fileData);

      this.jobsService.updateJobs(id, bodyFormData).subscribe(data => {
        console.log('update data', data);
      })
    }
  }

  onDeleteJob(id){
    this.jobsService.deleteJobs(id).subscribe(data => {
      console.log('component data', data);
    })
  }


}
