import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrl: './blogpost-list.component.css'
})
export class BlogpostListComponent implements OnInit {

  p: number = 1;
  blogPosts$?: Observable<BlogPost[]>;


  constructor(private blogPostService: BlogPostService) {

  }

  ngOnInit(): void {
    //get all blog posts from API
    this.blogPosts$ = this.blogPostService.getAllBlogPost();
  }

}
