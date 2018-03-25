import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../core/http/http.service';

const EXPANDABLE_HEAD_HEIGHT = 150;
const HEAD_MIN_HEIGHT = '60px';
const HEAD_MAX_HEIGHT = '200px';
const FONT_NORMAL = '60px';
const FONT_MOBILE = '40px';

const navOptions = [
  { name: 'Latest', class: 'fa-clock-o' },
  { name: 'Javascript', class: 'fa-book' },
  { name: 'Networking', class: 'fa-book' },
  { name: 'Machine Learning', class: 'fa-book' },
  { name: 'CSS', class: 'fa-book' },
];

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss', './blog-animation.scss', '../shared/styles/toast.scss']
})
export class BlogComponent implements OnInit, OnDestroy {

  /**
   *  All the blogs
   *
   * @type {*}
   * @memberof BlogComponent
   */
  public blogs: any = [{}, {}];

  /** Whether articles are loading or not */
  public isLoading = true;

  /** Current page no */
  public pageNo = 1;

  /** Toast message */
  toastMessage = '';

  /** Is toast on */
  isToastOn = false;

  /** tag to search for */
  tag = '';

  /** Navoptions */
  navOptions = navOptions;

  isMobile = false;

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
    window.addEventListener('scroll', this.onScroll);
    this.isMobile = window.matchMedia('(max-width: 480px)').matches;
  }

  /**
   * On Destroy to remove event listener
   *
   * @memberof BlogComponent
   */
  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
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
    this.blogs = this.blogs.length !== 0 ? this.blogs : [{}, {}];
    this.httpService.getAllTiles(this.pageNo, this.tag)
      .subscribe(
        res => {
          if (res.length !== 0 || this.pageNo === 1) {
            this.blogs = res;
          } else {
            this.pageNo--;
          }
          if (res.length === 0) {
            this.openToast('Not Avaiable', 2000);
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

    // Only select tab
    if (e.target.tagName !== 'DIV') {
      return;
    }
    const parent = e.target.parentElement;
    const childs = parent.children;
    const tag = e.target.innerText.trim().toLowerCase();

    for (let i = 0; i < childs.length; i++) {
      if (childs[i].classList.contains('selected')) {
        childs[i].classList.remove('selected');
      }
    }

    e.target.classList.add('selected');

    this.pageNo = 1;
    this.tag = tag === 'latest' ? '' : tag;
    this.getTiles();
  }

  /**
   * To open and close navbar in mobile
   *
   * @memberof BlogComponent
   */
  toggleNav() {
    const el = document.getElementsByTagName('nav')[0] as HTMLElement;
    if (el.style.left === '0px') {
      el.style.left = '-200px';
    } else {
      el.style.left = '0';
    }
  }

  /**
   * On scroll of page
   *
   * @memberof BlogComponent
   */
  onScroll = () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (st > EXPANDABLE_HEAD_HEIGHT) {
      (document.getElementsByClassName('head')[0] as HTMLElement).style.height = HEAD_MIN_HEIGHT;
      (document.getElementsByClassName('logo')[0] as HTMLElement).style.fontSize = '0';
    } else {
      (document.getElementsByClassName('head')[0] as HTMLElement).style.height = HEAD_MAX_HEIGHT;
      (document.getElementsByClassName('logo')[0] as HTMLElement).style.fontSize = width <= 480 ? FONT_MOBILE : FONT_NORMAL;
    }
  }
}
