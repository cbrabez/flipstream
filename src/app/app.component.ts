
import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import { map, tap } from 'rxjs/operators'
import {HttpClient} from "@angular/common/http";
import * as _ from 'lodash';

import { AngularFirestore } from '@angular/fire/firestore';

// interface Feed {
//     title: string;
//     subtitle:string;
//     id:string;
//     updated:string;
//     rights:string;
//     entries: Array<Entry>
// }

// interface Entry {
//   title: string;
//   alternateUrl: string;
//   shortcutUrl: string;
//   relatedUrl: string;
//   id: string;
//   published: Date;
//   updated: Date;
//   author: {
//     name: string;
//     url: string;
//   }
//   content: string;
// }

interface Course {
  description: string;
  courseListIcon: string;
  iconUrl: string;
  longDescription: string;
  url: string;
}

@Component({
  selector: 'app-root',
  template: `
  <ul *ngIf="courses$ | async as courses else noData">
  <li *ngFor="let course of courses">
      {{course.description}}
  </li>
</ul>
      
      <ng-template #noData>No Data Available</ng-template>
  `})
export class AppComponent implements OnInit {
    courses$: Observable<Course[]>;
    public data;

    constructor(private http:HttpClient, private firestore: AngularFirestore) {
    }

    ngOnInit() {
        // this.feed$ = this.http
        //     .get<any>("https://angular-http-guide.firebaseio.com/courses.json")
        //     .pipe(map(data => _.values(data)))
        //     .pipe(tap(console.log));
        //     // this.saveData(this.feed$)
        // this.courses$ = this.http
        //   .get<Course[]>("https://angular-http-guide.firebaseio.com/courses.json")
        //   .pipe(tap(console.log))
        //   .pipe(map(data => _.values(data)));
        this.http.get("https://daringfireball.net/feeds/json").subscribe(response => {
          this.data = response;
          console.log(this.data);
          this.saveData(this.data)
        })

        
    }




    saveData(data){
      // Add a new document with a generated id.
      return new Promise<any>((resolve, reject) => {
        console.log(data)
        this.firestore
          .collection("feeds")
          .add(data)
          .then(res => {}, err => reject(err));
      });
    }
    
  }