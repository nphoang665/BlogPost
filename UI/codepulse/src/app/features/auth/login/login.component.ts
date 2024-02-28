import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  }
  )
  submitted = false;

  model: LoginRequest;

  constructor(private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) {
    this.model = {
      email: '',
      password: ''
    };
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40)
        ]
      ],
    })
  }
  onFieldTouched(fieldName: string): void {
    this.form.get(fieldName)?.markAsTouched();
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


    this.authService.login(this.model)
      .subscribe({
        next: (response) => {
          //Set auth cookie
          this.cookieService.set('Authorization', `Bearer ${response.token}`,
            undefined, '/', undefined, true, 'Strict');

          // Set User
          this.authService.setUser({
            email: response.email,
            roles: response.roles
          });

          //Redirect back to home
          this.router.navigateByUrl('/');
          this.toastr.success('Đăng nhập thành công', 'Thông báo',{
            timeOut: 1000,
          });
        },
        error: (error) => {
          if (error.status === 400) {
            // Tài khoản hoặc mật khẩu không tồn tại
            this.toastr.error('Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.', 'Thông báo',{
              timeOut: 2000,
            });
            // alert('Tài khoản hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.');
          } else {
            // Xử lý lỗi khác nếu cần
            console.error('Đã xảy ra lỗi:', error);
          }
        }
      });
  }



}
