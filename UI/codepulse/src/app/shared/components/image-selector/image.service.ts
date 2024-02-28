import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogImage } from '../../models/blog-image.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { title } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  selectedImage: BehaviorSubject<BlogImage> = new BehaviorSubject<BlogImage>({
    id: '',
    fileExtenstion: '',
    // fileName: '',
    title: '',
    url: '',
  });


  constructor(private http: HttpClient) { }

  getAllImage(): Observable<BlogImage[]> {
    return this.http.get<BlogImage[]>(`${environment.apiBaseUrl}/api/images`)
  }

  uploadImage(file: File, fileName: string, title: string): Observable<BlogImage> {
    const formData = new FormData;
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);

    return this.http.post<BlogImage>(`${environment.apiBaseUrl}/api/images`, formData);
  }

  // selectImage(image: BlogImage): void {
  //   this.selectedImage.next(image);
  // }

  selectImage(image: BlogImage): void {
    // Kiểm tra xem image có URL không, nếu có thì thêm apiBaseUrl
    // if (image.url) {
    //   // Thêm apiBaseUrl vào trước image.url
    //   const imageUrlWithBaseUrl = environment.apiBaseUrl + image.url;
    //   const imageWithBaseUrl: BlogImage = { ...image, url: imageUrlWithBaseUrl };

    //   // Chuyển hình ảnh đã được cập nhật đến next
    //   this.selectedImage.next(imageWithBaseUrl);
    // } else {
    //   // Nếu không có URL, chỉ chuyển image hiện tại đến next
    // }
    this.selectedImage.next(image);
  }
  
  deleteImage(id:string):Observable<BlogImage>{
    return this.http.delete<BlogImage>(`${environment.apiBaseUrl}/api/images/${id}`);
  }

  onSelectImage(): Observable<BlogImage> {
    return this.selectedImage.asObservable();
  }


}
