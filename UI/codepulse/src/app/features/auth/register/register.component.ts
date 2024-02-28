import { Component, OnDestroy, OnInit } from '@angular/core';
import { Register } from '../models/register.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Validation from '../../../utils/validation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy,OnInit{

  form:FormGroup = new FormGroup({
    email: new FormGroup(''),
    password:new FormGroup(''),
    confirmPassword:new FormGroup('')
  })
  submitted = false;

  model: Register;
  private addAccountSubscribtion?: Subscription;


  constructor(private authService:AuthService,
    private router:Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) {
    this.model = {
      email: '',
      password: '',
      confirmPassword: ''
    }
  }
  onFieldTouched(fieldName: string): void {
    this.form.get(fieldName)?.markAsTouched();
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
      confirmPassword: ['', Validators.required],
    },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      })
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onFormSubmit() {
    this.submitted = true;

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    
    if (this.form.invalid && this.form.touched) {
      return;
    }


    this.addAccountSubscribtion = this.authService.createAcount(this.model).subscribe({
      next:(response)=>{
        this.router.navigateByUrl('/login');
        this.toastr.success('Đăng ký tài khoản thành công', 'Thông báo',{
          timeOut: 1000,
        });
      },
      error: (error) => {
        if (error.status === 400) {
          this.toastr.error('Tài khoản đã tồn tại!', 'Thông báo', {
            timeOut: 2000,
          });
        } else {
          console.error('Đã xảy ra lỗi:', error);
        }
      }
    });
    
  }
  ngOnDestroy(): void {
    this.addAccountSubscribtion?.unsubscribe();
  }
}
