import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/categories.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { Router } from '@angular/router';
import { ImageService } from '../../../shared/components/image-selector/image.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css'
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[];
  isImageSelectorVisible: boolean = false;


  routeSubscription?: Subscription;
  updateBlogPostSubcription?: Subscription;
  getBlogPostSubcription?: Subscription;
  deleteBlogPostSubcription?: Subscription;
  imageSelectSubcription?: Subscription;




  constructor(private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router, 
    private imageService: ImageService,
    private toastr: ToastrService) { }


  ngOnInit(): void {

    this.categories$ = this.categoryService.getAllCategories();

    this.routeSubscription = this.route.paramMap.subscribe({
      next: (prams) => {
        this.id = prams.get('id');

        // Get blogPost from API
        if (this.id) {
          this.getBlogPostSubcription = this.blogPostService.getBlogPostById(this.id)
            .subscribe({
              next: (response) => {
                this.model = response;
                this.selectedCategories = response.categories.map(x => x.id)
              }
            });
        }

        this.imageSelectSubcription = this.imageService.onSelectImage()
          .subscribe({
            next: (response) => {
              if (this.model) {
                this.model.featuredImageUrl = response.url;
                this.isImageSelectorVisible = false;
              }
            }
          });

      }


    })
  }

  onFormSubmit(): void {
    // Convert this model to request object
    if (this.model && this.id) {
      var updateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        publishedDate: this.model.publishedDate,
        title: this.model.title,
        urlHandle: this.model.urlHandle,
        categories: this.selectedCategories ?? []
      };

      this.updateBlogPostSubcription = this.blogPostService.updateBlogPost(this.id, updateBlogPost)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts')
            this.toastr.success('Sửa bài đăng thành công', 'Thông báo', {
              timeOut: 1000,
            });
          }
        });
    }
  }

  onDelete(): void {
    if (this.id) {
      //Call service and delete blogPost
      this.deleteBlogPostSubcription = this.blogPostService.deleteBlogPost(this.id)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
            this.toastr.success('Xóa bài đăng thành công', 'Thông báo', {
              timeOut: 1000,
            });
          }
        })
    }
  }

  openImageSelector() {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector() {
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.updateBlogPostSubcription?.unsubscribe();
    this.getBlogPostSubcription?.unsubscribe();
    this.deleteBlogPostSubcription?.unsubscribe();
    this.imageSelectSubcription?.unsubscribe();
  }


}
