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

  private truncatedWords = [];

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
    this.httpService.getAllTiles()
      .subscribe(
      res => {
        this.blogs = res;
      },
      err => {
        console.log(err);
      }
      );
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
