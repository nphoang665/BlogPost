import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/categories.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({
    categoryName: new FormControl(''),
    categoryUrlHandle: new FormControl('')
  });
  submitted = false;


  id: string | null = null;
  paramasSubscription?: Subscription;
  editCategorySubscription?: Subscription;
  category?: Category

  constructor(private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) { }


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

    this.paramasSubscription = this.route.paramMap.subscribe({
      next: (paramas) => {
        this.id = paramas.get('id');

        if (this.id) {
          // Get the data from the API for this category Id
          this.categoryService.getCategoryById(this.id)
            .subscribe({
              next: (response) => {
                this.category = response;
              }
            })
        }
      }
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onFormSubmit(): void {

     //validation
     this.submitted = true;
     Object.values(this.form.controls).forEach(control => {
       control.markAsTouched();
     });
     if (this.form.invalid) {
       return;
     }

    const updateCategoryRequest: UpdateCategoryRequest = {
      name: this.category?.name ?? '',
      urlHandle: this.category?.urlHandle ?? ''
    }

    //pass this object to service
    if (this.id) {
      this.editCategorySubscription = this.categoryService.updateCategory(this.id, updateCategoryRequest)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/categories');
            this.toastr.success('Sửa thể loại thành công', 'Thông báo',{
              timeOut: 1000,
            });
          }
        });
    }
  }

  onDelete(): void {
    if (this.id) {
      this.categoryService.deleteCategory(this.id)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/categories');
            this.toastr.success('Xóa thể loại thành công', 'Thông báo',{
              timeOut: 1000,
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.paramasSubscription?.unsubscribe();
    this.editCategorySubscription?.unsubscribe();
  }
}
