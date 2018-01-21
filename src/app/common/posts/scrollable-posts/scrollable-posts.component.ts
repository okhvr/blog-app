import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import { PostService } from '../../services/posts.service';
import { IPostData } from '../../interfaces/postData';

@Component({
  selector: 'blog-scrollable-posts',
  templateUrl: './scrollable-posts.component.html',
  styleUrls: ['./scrollable-posts.component.css']
})
export class ScrollablePostsComponent implements OnInit, OnChanges {

  constructor(private postService: PostService) { }

  @Input() userId?: number;

  @Input() searchQuery? = '';

  private page = 1;

  private isLoaded = false;

  postData$: Observable<IPostData>;

  private pageSubject: BehaviorSubject<number>;

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  ngOnChanges(): void {
      this.page = 1;
      this.pageSubject = new BehaviorSubject<number>(1);
      if (this.searchQuery) {
        console.log(`searched by "${this.searchQuery}"`);
      }

      this.postData$ = this.pageSubject
        .switchMap((page: number) => {
          return this.postService.getPosts(page, 10, this.userId, this.searchQuery);
        })
        .do((postData: IPostData) => {
          if (postData.result.length < 10) {
            this.pageSubject.complete();
          }
          this.isLoaded = true;
        })
        .scan((acc: IPostData, cur: IPostData) => {
          return { result: acc.result.concat(cur.result), total: cur.total };
        }, { result: [], total: null });
  }

  onScroll() {
    if (this.isLoaded && !this.pageSubject.isStopped) {
      this.pageSubject.next(++this.page);
      console.log(`infinite scroll event triggered, page: ${this.page}`);
    }
  }
}
