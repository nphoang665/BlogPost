import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent implements OnDestroy, OnInit {

  form: FormGroup = new FormGroup({
    categoryName: new FormControl(''),
    categoryUrlHandle: new FormControl('')
  });
  submitted = false;



  model: AddCategoryRequest;
  private addCategorySubscribtion?: Subscription;

  constructor(private categoryService: CategoryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) {
    this.model = {
      name: '',
      UrlHandle: ''
    };
  }

  onFieldTouched(fieldName: string): void {
    this.form.get(fieldName)?.markAsTouched();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        categoryName: ['',
          [
            Validators.required,
            Validators.maxLength(20)
          ]
        ],
        categoryUrlHandle: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ]
      })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onFormSubmit() {
    //validation
    this.submitted = true;
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    if (this.form.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form.value, null, 2));
    this.addCategorySubscribtion = this.categoryService.addCategory(this.model)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/categories');
          this.toastr.success('Thêm mới thể loại thành công', 'Thông báo',{
            timeOut: 1000,
          });
        }
      });


  }

  ngOnDestroy(): void {
    this.addCategorySubscribtion?.unsubscribe();
  }

}
