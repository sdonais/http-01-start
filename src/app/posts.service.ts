import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map } from 'rxjs/operators'

@Injectable({providedIn: 'root'})

export class PostsService {

    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content}
        this.http.post<{ name: string }>( //recommended to let it know what type of data it is
            'https://ng-complete-guide-e532a-default-rtdb.firebaseio.com/posts.json',
            postData
            ).subscribe(responseData => {
              console.log(responseData); 
            });
    }

    fetchPosts() {
        return this.http
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
      ); //end pipe 
    } //end fetchPosts

    



}//end class