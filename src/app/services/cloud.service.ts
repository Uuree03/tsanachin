import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { RegData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  constructor(private fns: AngularFireFunctions) { }

  createUserProfile(regData: RegData){
    const callable = this.fns.httpsCallable('createUserProfile');
    return callable(regData);
  }


}
