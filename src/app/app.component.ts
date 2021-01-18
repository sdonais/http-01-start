import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
t    this.http.post<{ name: string }>( //recommended to let it know what type of data it is
      'https://ng-complete-guide-e532a-default-rtdb.firebaseio.com/posts.json',
      postData
      ).subscribe(responseData => {
        console.log(responseData); 
      });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    this.http
      .get<{ [key: string]: Post }>('https://ng-complete-guide-e532a-default-rtdb.firebaseio.com/posts.json')//ng now understands responseData will have this format
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key })
            } //end if
          } //end for
          return postsArray;
        }) //end map
      ) //end pipe
      .subscribe(posts => {
        console.log(posts);
      });
  }

}
