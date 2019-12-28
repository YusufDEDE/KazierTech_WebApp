import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../utils/services/category.service';
import { Category } from '../../utils/services/model/category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/utils/services/app.service';
import { HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import { RequestOptions } from '@angular/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers:[CategoryService]
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[];
  
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private http :HttpClient
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
    this.getCategories();
    this.categoryForm = this.formBuilder.group({
      categoryName:['', Validators.required],
      categoryDesc: ['', Validators.required],
      categoryPic: ['', Validators.required]
     });    
  }

  get f() { return this.categoryForm.controls; } 

  onSubmit() {
    const token = this.appService.currentUserValue;
    console.log(token);

    const bodyFormData = new FormData();
    bodyFormData.set('category_name', this.f.categoryName.value);
    bodyFormData.set('cat_description', this.f.categoryDesc.value);
    bodyFormData.append('cat_picture', this.fileData);

    this.categoryService.addCategories(bodyFormData)
      .subscribe(response => {
        console.log("add Category", response);
      });
    
  }

  getCategories() {
     this.categoryService.getCategories().subscribe(data => {
       console.log(data)
       this.categories = data;
     })
  }

  
}
