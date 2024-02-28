// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { AddBlogpost } from '../models/add-blog-post.model';
// import { BlogPostService } from '../services/blog-post.service';
// import { Router } from '@angular/router';
// import { CategoryService } from '../../category/services/category.service';
// import { Observable, Subscription } from 'rxjs';
// import { Category } from '../../category/models/categories.model';
// import { ImageService } from '../../../shared/components/image-selector/image.service';
// import { subscribe } from 'diagnostics_channel';
// import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-add-blogpost',
//   templateUrl: './add-blogpost.component.html',
//   styleUrl: './add-blogpost.component.css'
// })
// export class AddBlogpostComponent implements OnInit, OnDestroy, OnInit {



//   form: FormGroup = new FormGroup({
//     title: new FormControl('', [Validators.required]),
//     shortDescription: new FormControl('', [Validators.required]),
//     urlHandle: new FormControl('', [Validators.required]),
//     content: new FormControl('', [Validators.required]),
//     featuredImageUrl: new FormControl('', [Validators.required]),
//     author: new FormControl('', [Validators.required]),
//     isVisible: new FormControl(true),
//     publishedDate: new FormControl(new Date(), [Validators.required]),
//     categories: new FormControl([], [Validators.required])
//   });
//   submitted = false;

//   model: AddBlogpost;
//   categories$?: Observable<Category[]>;
//   isImageSelectorVisible: boolean = false;

//   imageSelectorSubscription?: Subscription;

//   constructor(private blogPostService: BlogPostService,
//     private router: Router,
//     private categoriService: CategoryService,
//     private imageService: ImageService,
//     private formBuilder: FormBuilder) {
//     this.model = {
//       title: '',
//       shortDescription: '',
//       urlHandle: '',
//       content: '',
//       featuredImageUrl: '',
//       author: '',
//       isVisible: true,
//       publishedDate: new Date(),
//       categories: []
//     }
//   }


//   onFieldTouched(fieldName: string): void {
//     this.form.get(fieldName)?.markAsTouched();
//   }


//   ngOnInit(): void {
//     this.form = this.formBuilder.group({
//       title: ['',
//         [
//           Validators.required,
//           Validators.minLength(6),
//           Validators.maxLength(20)
//         ]],
//       shortDescription: ['', [
//         Validators.required,
//         Validators.minLength(6),
//       ]
//       ],
//       urlHandle: ['',
//         [
//           Validators.required,
//           Validators.minLength(5),
//           Validators.maxLength(20)
//         ]
//       ],
//       content: ['',
//         [
//           Validators.required,
//           Validators.minLength(20),
//         ]
//       ],
//       author: ['',
//         [
//           Validators.required,
//           Validators.minLength(4),
//           Validators.maxLength(20)
//         ]
//       ],
//       isVisible: [],
//       featuredImageUrl: ['', [
//         Validators.required,
//         Validators.pattern('(https?://.*\\.(?:png|jpg|jpeg))')
//       ]],
//       publishedDate: [new Date(), [
//         Validators.required,
//       ]],
//       categories: [[], [
//         Validators.required,
//       ]]
//     })


//     this.categories$ = this.categoriService.getAllCategories();
//     this.imageSelectorSubscription = this.imageService.onSelectImage()
//       .subscribe({
//         next: (selectedImage) => {
//           this.model.featuredImageUrl = selectedImage.url;
//           this.closeImageSelector();
//         }
//       })
//   }

//   get f(): { [key: string]: AbstractControl } {
//     return this.form.controls;
//   }

//   onFormSubmit(): void {
//     //validation
//     this.submitted = true;
//     Object.values(this.form.controls).forEach(control => {
//       control.markAsTouched();
//     });
//     if (this.form.invalid) {
//       return;
//     }


//     console.log(this.model);
//     this.blogPostService.createBlogPost(this.model)
//       .subscribe({
//         next: (response) => {
//           this.router.navigateByUrl('/admin/blogposts')
//         }
//       })
//   }

//   openImageSelector() {
//     this.isImageSelectorVisible = true;
//   }

//   closeImageSelector() {
//     this.isImageSelectorVisible = false;
//   }

//   ngOnDestroy(): void {
//     this.imageSelectorSubscription?.unsubscribe();
//   }

// }


import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddBlogpost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/categories.model';
import { ImageService } from '../../../shared/components/image-selector/image.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  submitted = false;

  model: AddBlogpost = {
    title: '',
    shortDescription: '',
    urlHandle: '',
    content: '',
    featuredImageUrl: '',
    author: '',
    isVisible: true,
    publishedDate: new Date(),
    categories: []
  };

  categories$?: Observable<Category[]>;
  isImageSelectorVisible = false;
  imageSelectorSubscription?: Subscription;

  constructor(
    private blogPostService: BlogPostService,
    private router: Router,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  onFieldTouched(fieldName: string): void {
    this.form.get(fieldName)?.markAsTouched();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      shortDescription: ['', [Validators.required, Validators.minLength(6)]],
      urlHandle: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      author: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      isVisible: [[]],
      featuredImageUrl: ['', [Validators.required]],
      publishedDate: [new Date(), [Validators.required]],
      categories: [[], [Validators.required]],
    });

    this.categories$ = this.categoryService.getAllCategories();
    
    this.imageSelectorSubscription = this.imageService.onSelectImage()
      .subscribe({
        next: (selectedImage) => {
          this.model.featuredImageUrl = selectedImage.url;
          this.closeImageSelector();
        }
      });
  }

  get f(): { [key: string]: any } {
    return this.form.controls;
  }

  onFormSubmit(): void {
    // Validation
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    console.log(this.model);

    this.blogPostService.createBlogPost(this.model)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
          this.toastr.success('Thêm bài đăng thành công', 'Thông báo', {
            timeOut: 1000,
          });
        }
      });
  }

  openImageSelector() {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector() {
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.imageSelectorSubscription?.unsubscribe();
  }
}
