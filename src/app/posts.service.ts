import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError, tap } from 'rxjs/operators'
import { Subject, throwError } from "rxjs";
import { cachedDataVersionTag } from "v8";

@Injectable({providedIn: 'root'})

export class PostsService {

    error = new Subject<string>();

    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content}
        this.http
        .post<{ name: string }>( //recommended to let it know what type of data it is
            'https://ng-complete-guide-e532a-default-rtdb.firebaseio.com/posts.json', 
            postData,
            {
                observe: 'response'
            }
        )
        .subscribe(responseData => {
              console.log(responseData.body); 
            }, 
            error => {
                this.error.next(error.message);
        });
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');

        return this.http
        .get<{ [key: string]: Post }>(
            'https://ng-complete-guide-e532a-default-rtdb.firebaseio.com/posts.json',
            {
                headers: new HttpHeaders({'Custom-Header': 'hello'}),
                params: new HttpParams().set('print', 'pretty'),
                //params: searchParams
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
            'https://ng-complete-guide-e532a-default-rtdb.firebaseio.com/posts.json',
            {
                observe: 'events'
            }
        ).pipe(tap(event => {
            console.log(event);
            if (event.type === HttpEventType.Sent) {
                // ... 
            }
            if (event.type === HttpEventType.Response) {
                console.log(event.body);
            }
        }));
    }



}//end class