import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../core/http/http.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  /**
   *  All the blogs
   *
   * @type {*}
   * @memberof BlogComponent
   */
  public blogs: any;

  /** Whether articles are loading or not */
  public isLoading = true;

  /** Current page no */
  public pageNo = 1;

  /** Toast message */
  toastMessage = '';

  /** Is toast on */
  isToastOn = false;


  /**
   * Creates an instance of BlogComponent.
   * @param {HttpService} httpService
   * @param {Router} router
   * @memberof BlogComponent
   */
  constructor(private httpService: HttpService, private router: Router) { }

  /**
   * Get all the blogs from the server
   *
   * @memberof BlogComponent
   */
  ngOnInit() {
    this.getTiles();
  }

  /** Get next tiles */
  getMoreTiles() {
    this.pageNo++;
    this.getTiles();
  }

  /** Get previous tiles */
  getLessTiles() {
    if (this.pageNo === 1) {
      return;
    }
    this.pageNo--;
    this.getTiles();
  }

  /** Get tiles from server according to page no */
  getTiles() {
    this.isLoading = true;
    this.httpService.getAllTiles(this.pageNo)
      .subscribe(
      res => {
        if (res.length !== 0) {
          this.blogs = res;
        } else {
          this.pageNo--;
          this.openToast('More Not Avaiable', 1000);
        }
        this.isLoading = false;
      },
      err => {
        console.log(err);
      }
      );
  }

  openToast(message: string, time: number) {
    this.toastMessage = message;
    this.isToastOn = true;
    setTimeout(() => { this.isToastOn = false; }, time);
  }

  /**
   * Open blog in the viewer component
   *
   * @param {string} id
   * @memberof BlogComponent
   */
  openBlog(id: string) {
    this.router.navigate(['/viewer', id]);
  }

  /**
   * Highlight the tab which is selected
   *
   * @param {any} e
   * @returns
   * @memberof BlogComponent
   */
  onNavSelection(e) {
    if (e.target.tagName !== 'DIV') {
      return;
    }
    const parent = e.target.parentElement;
    const childs = parent.children;

    for (let i = 0; i < childs.length; i++) {
      if (childs[i].classList.contains('selected')) {
        childs[i].classList.remove('selected');
      }
    }

    e.target.classList.add('selected');
  }
}
