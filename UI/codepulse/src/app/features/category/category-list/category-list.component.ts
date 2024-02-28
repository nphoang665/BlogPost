import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/categories.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {

  // Kiểu 1
  // categories?: Category[]; 

  //2
  categories$? :Observable<Category[]>

  constructor(private categoryService: CategoryService) {

  }

  //Kiểu 1
  // ngOnInit(): void {
  //   this.categoryService.getAllCategories()
  //     .subscribe({
  //       next: (response) => {
  //         this.categories = response;
  //       }
  //     });
  // }


  //2
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

  }
}
