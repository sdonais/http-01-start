import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError } from 'rxjs/operators'
import { Subject, throwError } from "rxjs";

@Injectable({providedIn: 'root'})

export class PostsService {

    error = new Subject<string>();

    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content}
        this.http.post<{ name: string }>( //recommended to let it know what type of data it is
            'https://ng-complete-guide-e532a-default-rtdb.firebaseio.com/posts.json', postData
            ).subscribe(responseData => {
              console.log(responseData); 
            }, error => {
                this.error.next(error.message);
            });
    }

    fetchPosts() {
        return this.http
        .get<{ [key: string]: Post }>(
            'https://ng-complete-guide-e532a-default-rtdb.firebaseio.com/posts.json',
            {
                headers: new HttpHeaders({'Custom-Header': 'hello'})
            })
        .pipe(
            map(responseData => {
            const postsArray: Post[] = [];
            for (const key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key })
                } //end if
            } //end for
            return postsArray;
        }), //end map
        catchError(errorRes => {
            // generic error handling task, like send to analytics server
            return throwError(errorRes);
        })
      ); //end pipe 
    } //end fetchPosts

    deletePosts() {
        return this.http.delete(
            'https://ng-complete-guide-e532a-default-rtdb.firebaseio.com/posts.json'
            );
    }



}//end class