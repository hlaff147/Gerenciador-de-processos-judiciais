import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { inputNumberValdiator } from 'src/validators/input-numer';
import { UserService } from 'src/services/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  cpf = new FormControl('', [inputNumberValdiator(11)]);
  password = new FormControl('', [Validators.required]);
  rememberUser = new FormControl('');

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}

  loginUser(): void {
    if (!this.cpf.valid) return;
    if (!this.password.valid) return;

    const cpf = this.cpf.value;
    const password = this.password.value;

    this.userService.loginUser(cpf, password).subscribe();
  }
}
