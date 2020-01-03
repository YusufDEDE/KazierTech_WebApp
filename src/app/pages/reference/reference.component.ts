import { Component, OnInit } from '@angular/core';
import { References } from 'src/app/utils/services/model/references';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReferenceService } from 'src/app/utils/services/reference.service';


@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {
  referenceForm : FormGroup;
  references: References[];

  referenceID:any;

  required = false;
  required2 = false;
  required3 = false;

  loading = false;
  update = false;
  add = true;


  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(
    private referenceService : ReferenceService,
    private formBuilder: FormBuilder,
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
    this.getReference()
    this.referenceForm = this.formBuilder.group({
      referenceName:['', Validators.required],
      referenceDesc: ['', Validators.required],
      referencePic: ['', Validators.required]
     });    
  }

  get f() { return this.referenceForm.controls; } 

  canUpdateBtn(id, referenceName, referenceDesc, referencePic) {
    console.log("id : ", id);
    if (!this.update){
      this.referenceID = id;
      this.f.referenceName.setValue(referenceName);
      this.f.referenceDesc.setValue(referenceDesc);
      this.fileData = referencePic;
      this.update = true;
      this.add = false;
    }else {
      this.update = false;
      this.add = true;

      this.f.referenceName.setValue('')
      this.f.referenceDesc.setValue('')
    }
    
  }

  onSubmit() {
    if (this.f.referenceName.value == '' || this.f.referenceDesc.value == '' || this.fileData == null ){
      this.required = false;
      this.required2 = false;
      this.required3 = false;
      if (this.f.referenceName.value == '') {
        this.required = true;
      }
      if (this.f.referenceDesc.value == '') {
        this.required2 = true;
      }
      if (this.fileData == null){
        this.required3 = true;
      }
    }
    else {
      this.loading = true;
      const bodyFormData = new FormData();
      bodyFormData.set('reference_name', this.f.referenceName.value);
      bodyFormData.set('ref_description', this.f.referenceDesc.value);
      bodyFormData.append('ref_picture', this.fileData);

      this.referenceService.addReference(bodyFormData)
      .subscribe(response => {
        console.log("add Category", response);
      });
    }
  }

  getReference() {
    this.referenceService.getReference().subscribe(data => {
      console.log(data)
      this.references = data;
      this.references.reverse();
    })
  }

  onUpdateReference(id){
    if (this.f.referenceName.value == '' || this.f.referenceDesc.value == '' || this.fileData == null ){
      this.required = false;
      this.required2 = false;
      this.required3 = false;
      if (this.f.referenceName.value == '') {
        this.required = true;
      }
      if (this.f.referenceDesc.value == '') {
        this.required2 = true;
      }
      if (this.fileData == null){
        this.required3 = true;
      }
    }
    else {  
      this.loading = true;
      const bodyFormData = new FormData();
      bodyFormData.set('reference_name', this.f.referenceName.value);
      bodyFormData.set('ref_description', this.f.referenceDesc.value);
      bodyFormData.append('ref_picture', this.fileData);

      console.log(bodyFormData.get('cat_picture'));

      this.referenceService.updateReference(id, bodyFormData).subscribe(data => {
        console.log('update data', data);
      })
    }
  }

  onDeleteReference(id){
    this.referenceService.deleteReference(id).subscribe(data => {
      console.log('component data', data);
    })
  }
  
}
