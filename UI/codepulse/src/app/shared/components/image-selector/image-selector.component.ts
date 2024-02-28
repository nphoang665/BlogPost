import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageService } from './image.service';
import { Observable, of } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { url } from 'inspector';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.css'
})
export class ImageSelectorComponent implements OnInit {
  private file?: File;
  fileName: string = '';
  title: string = '';

  id: string | null = null;


  images$?: Observable<BlogImage[]>;

  @ViewChild('form', { static: false }) imageUploadForm?: NgForm;

  constructor(private imageService: ImageService,
    private toastr: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.getImage();
  }

  onFileUploadChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.file = element.files?.[0];
  }




  uploadImage(): void {
    if (this.file && this.title !== '') {
      // Image service to upload the image 
      this.imageService.uploadImage(this.file, this.fileName, this.title)
        .subscribe({
          next: (response) => {
            this.imageUploadForm?.resetForm();
            this.getImage();
            this.toastr.success('Thêm ảnh thành công', 'Thông báo', {
              timeOut: 1000,
            });
            this.resetInputFile();
          },
          error: (error) => {
            if (error.status === 400) {
              this.toastr.error('File ảnh không đúng định dạng. Vui lòng kiểm tra lại.', 'Thông báo', {
                timeOut: 2000,
              });
              // this.imageUploadForm?.resetForm();
              this.resetInputFile();
            } else {
              console.error('Đã xảy ra lỗi:', error);
            }
          }
        });
    }
  }

  resetInputFile() {
    const fileInput: HTMLInputElement | null = document.querySelector('#fileInput');
  
    if (fileInput) {
      fileInput.value = '';
    }
  }

  selectImage(image: BlogImage): void {
    // if (image.url) {
    //   // Ghép apiBaseUrl và image.url để tạo đường dẫn đầy đủ
    //   const imageUrlWithBaseUrl = `${environment.apiBaseUrl}${image.url}`;
  
    //   // Tạo một đối tượng mới với đường dẫn đã được cập nhật
    //   const imageWithBaseUrl: BlogImage = { ...image, url: imageUrlWithBaseUrl };
  
    //   // Chuyển hình ảnh đã được cập nhật đến next
    //   this.imageService.selectImage(imageWithBaseUrl);
    //   console.log(imageUrlWithBaseUrl);
    // } else {
    //   // Nếu không có URL, chỉ chuyển image hiện tại đến next
    // }
    this.imageService.selectImage(image);
    
  }




  onDelete(event: Event, image: BlogImage): void {
    event.stopPropagation();
    // console.log(image.id);
    if (image.id) {
      this.imageService.deleteImage(image.id)
        .subscribe({
          next: (response) => {
            // Xử lý sau khi xóa thành công
            this.getImage();
          },
          error: (error) => {
            // Xử lý lỗi khi xóa
            console.error('Error deleting image:', error);
          }
        });
    }
  }

  
  





  private getImage() {
    // Gọi API để lấy danh sách hình ảnh từ imageService
    this.imageService.getAllImage().subscribe(
      (images: BlogImage[]) => {
        // Kiểm tra từng hình ảnh và thêm apiBaseUrl vào URL nếu có
        const imagesWithBaseUrl = images.map(image => {
          if (image.url) {
            return { ...image, url: `${environment.apiBaseUrl}${image.url}` };
          } else {
            return image;
          }
        });
  
        // Lưu danh sách hình ảnh đã được cập nhật vào biến images$
        this.images$ = of(imagesWithBaseUrl);
      },
      error => {
        console.error('Error fetching images:', error);
      }
    );
  }
  

}
