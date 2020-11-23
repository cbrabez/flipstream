
import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import { map, tap } from 'rxjs/operators'
import {HttpClient} from "@angular/common/http";
import * as _ from 'lodash';
// let parseString = require('xml2js').parseString;
import { NgxXml2jsonService } from 'ngx-xml2json';
import { toArray } from 'rxjs/operators';

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

// interface Course {
//   description: string;
//   courseListIcon: string;
//   iconUrl: string;
//   longDescription: string;
//   url: string;
// }

@Component({
  selector: 'app-root',
  templateUrl: "./app.component.html",
})

export class AppComponent implements OnInit {
    // courses$: Observable<Course[]>;
    public feeds;
    public data;
    public arrayWithFeeds;
    db:AngularFirestore;

    constructor(private http:HttpClient, private firestore: AngularFirestore, private ngxXml2jsonService: NgxXml2jsonService) {
      this.db = firestore; 
    }

    ngOnInit() {
      this.getData();
        // this.feed$ = this.http
        //     .get<any>("https://angular-http-guide.firebaseio.com/courses.json")
        //     .pipe(map(data => _.values(data)))
        //     .pipe(tap(console.log));
        //     // this.saveData(this.feed$)
        // this.courses$ = this.http
        //   .get<Course[]>("https://angular-http-guide.firebaseio.com/courses.json")
        //   .pipe(tap(console.log))
        //   .pipe(map(data => _.values(data)));
      //    this.feeds = this.db.collection<any>('feeds').get().toPromise().then(function(querySnapshot) {
      //     querySnapshot.forEach(function(doc) {
      //         // doc.data() is never undefined for query doc snapshots
      //         console.log(doc.id, " => ", doc.data());
      //     });
      // });
      // this.arrayWithFeeds = JSON.stringify(this.db.collection('feeds').get())
              // console.log(this.feed);
              this.arrayWithFeeds = this.getData();
              console.log("OnInit" + this.arrayWithFeeds)
    }

    getAndSaveDataForFeed(feedUrl){
      // console.log('https://daringfireball.net/feeds/json')
      this.http.get(feedUrl, { responseType: 'text' }).subscribe(response => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(response, 'text/xml');
        // console.log(xml)
        const obj = this.ngxXml2jsonService.xmlToJson(xml);
        console.log(obj);
        this.data = obj
        // console.log(this.data);
        this.saveData(this.data)
      })
    }

    // convertTwoArray(feeds){
    //   let arr = [];  
    //   Object.keys(feeds).map(function(key){  
    //       arr.push({[key]:feeds[key]})  
    //       console.log("HEELO" + arr);
    //       return arr;  
    //   });
    // }

    getData(feed?){
      let parsedFeed = [];
      this.db.collection<any>('feeds').get().toPromise().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            parsedFeed.push(doc.data()); 
            // console.log("PARSED" + parsedFeed)
        });
    });
    return parsedFeed;
    }

    saveData(data){
      // Add a new document with a generated id.
      return new Promise<any>((resolve, reject) => {
        // console.log(data)
        this.firestore
          .collection("feeds")
          .add(data)
          .then(res => {}, err => reject(err));
      });
    }
    
  }