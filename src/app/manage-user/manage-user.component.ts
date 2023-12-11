import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {MatTable, MatTableModule} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { UserServiceService } from '../user-service.service';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


export interface User {
  id: number;
  index: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
}

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [MatTableModule, CommonModule, ReactiveFormsModule, HttpClientModule, MatProgressSpinnerModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [UserServiceService],
})
export class ManageUserComponent implements OnInit {
  dataSource: User[] = [];
  columnsToDisplay: any[] = [];
  expandedElement!: User;
  userDetail!: FormGroup;
  isLoading = false;

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  constructor(private userService: UserServiceService) { }

  ngOnInit(): void {
    const observer = this.userService.getUser().subscribe((res: any) => {
      this.formatUser(res.users);
      this.columnsToDisplay = ['firstName', 'lastName', 'gender', 'email'];
      this.userDetail = new FormGroup({
        firstName: new FormControl('',Validators.required),
        lastName: new FormControl('', Validators.required),
        gender: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
      });      
    });
  }

  formatUser(users: User[]){
    let index = 0;
    for(let user of users){
      let person:User = {
        id: 0,
        index: 0,
        firstName : '',
        lastName : '',
        gender : '',
        email : '',
      };
      person.id = user.id;
      person.firstName = user.firstName;
      person.lastName = user.lastName;
      person.gender = user.gender;
      person.email = user.email;
      person.index = index;
      this.dataSource.push(person);
      index++;
    }
  }
  
  expandRow(user: User) {
    this.expandedElement = user;
    this.userDetail = new FormGroup({
        firstName: new FormControl(this.expandedElement.firstName,Validators.required),
        lastName: new FormControl(this.expandedElement.lastName, Validators.required),
        gender: new FormControl(this.expandedElement.gender, Validators.required),
        email: new FormControl(this.expandedElement.email, Validators.required),
    });
  }

  updateUser() {
    this.isLoading = true;
    
    let user = this.dataSource.findIndex(user => user.id === this.expandedElement.id);
    this.dataSource[user] = this.userDetail.value;
    this.dataSource[user].id = this.expandedElement.id;
    setInterval(() => {
      this.isLoading = false;
      this.table.renderRows();
    },1000);
  }

  revertValue() {
    console.log("I am here");
    this.expandedElement = {
      id: 0,
        index: 0,
        firstName : '',
        lastName : '',
        gender : '',
        email : '',
    };
  }
}
