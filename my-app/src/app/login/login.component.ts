import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private afs: AngularFirestore;
  constructor(_afs: AngularFirestore) {
    this.afs = _afs;
  }

  ngOnInit() {
  }

  signin(user: User): void {
    this.afs.firestore.a.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

}
