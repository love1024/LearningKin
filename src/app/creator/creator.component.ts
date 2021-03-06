import { Component, OnInit, ViewChild, Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';
import { HttpService } from '../core/http/http.service';
import { ParserService } from '../core/parser/parser.service';
import { ActivatedRoute } from '@angular/router';

declare const document: any;
const defaultImage = './assets/image-not-found.png';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss', '../shared/styles/toast.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorComponent implements OnInit {

  /** Id of the blog if available for editor  */
  id: string;

  /**
   * Content Container which includes Title
   * and Content area
   * @type {ElementRef}
   * @memberof CreatorComponent
   */
  @ViewChild('content') content: ElementRef;

  /**
   *  Title of the blog
   * @type {ElementRef}
   * @memberof CreatorComponent
   */
  @ViewChild('titleText') title: ElementRef;

  /**
   * To show pop up box
   * @memberof CreatorComponent
   */
  isPopUpOn = false;

  /** To show toast message */
  isToastOn = false;

  /** Toast message  */
  toastMessage = '';

  /**
   * To Save selected text or caret postion
   * while opening pop up box
   * @memberof CreatorComponent
   */
  selections: any;

  /**
   * To save link inserted in pop up box
   * @memberof CreatorComponent
   */
  link: string;

  /**
   * Function to call when there link is inserted
   * in pop up box
   * @memberof CreatorComponent
   */
  popUpCallback: any;

  /**
   * Creates an instance of CreatorComponent.
   * @param {Renderer2} _renderer
   * @memberof CreatorComponent
   */
  constructor(
    private _renderer: Renderer2,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private parser: ParserService
  ) { }

  /**
   * Lifecycle hook on intialization of component
   * Used to put focus on the title of the blog
   * and add eventListener for keydown
   * @memberof CreatorComponent
   */
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.httpService.getById(this.id)
        .subscribe(
          res => {
            this.content.nativeElement.children[1].remove();
            this.parseData(res[0].data);
          },
          err => {
            console.log(err);
          }
        );
    }

    this.content.nativeElement.children[0].focus();
    document.addEventListener('keydown', this.backspaceListener.bind(this));
  }

  /**
   * Method to autogrow the title bar when input exceeds
   * one line and also decrease size when lines get deleted
   * @param {any} el - The element which we are goint to autogrow (Title)
   * @memberof CreatorComponent
   */
  autoGrow(el) {
    if (el.scrollHeight > el.clientHeight) {
      el.style.minHeight = (el.scrollHeight + 50) + 'px';
    } else {

      // Prevent height from growing when deleting lines.
      el.style.minHeight = '1px';
      el.style.minHeight = el.scrollHeight + 'px';
    }
  }


  /**
   * Format text according to the given command
   * execCommand is used to format the contentEditable area
   * Commands can be - bold, italic, underline etc.
   * @param {string} cmd - Command use to format text
   * @param {string} view - The element which for certain command
   * For insertHTML h1 is used
   * @memberof CreatorComponent
   */
  formatText(cmd: string, view: string) {
    document.execCommand(cmd, false, view);
  }

  /**
   * Insert new image at the caret position or append the
   * image in the container area if caret is not in valid position
   * @memberof CreatorComponent
   */
  insertImage() {
    // Take the element where current selection is
    const curEl = document.getSelection().anchorNode as HTMLElement;

    this.openPopUp((link: string) => {
      if (!link) {
        return;
      }

      // Create the image div with the delete button
      const div = this._renderer.createElement('div');
      this._renderer.addClass(div, 'imageContainer');
      const img = this.createImageElement(link, false);
      const del = this.createDeleteElement();
      const resize = this.createResizeElement();
      this._renderer.appendChild(div, del);
      this._renderer.appendChild(div, resize);
      this._renderer.appendChild(div, img);

      this.appendElement(curEl, div);
      this.addNextEditableBox(div);
    });
  }

  /**
   * Insert video at the caret postion or append video to container
   * if valid caret is not available
   * @memberof CreatorComponent
   */
  insertVideo() {
    const curEl = document.getSelection().anchorNode as HTMLElement;
    this.openPopUp((link: string) => {
      if (!link) {
        return;
      }

      const div = this._renderer.createElement('div');
      this._renderer.addClass(div, 'videoContainer');
      const video = this.createVideoElement(link);
      const del = this.createDeleteElement();
      this._renderer.appendChild(div, del);
      this._renderer.appendChild(div, video);

      this.appendElement(curEl, div);
      this.addNextEditableBox(div);
    });
  }


  /**
   * Add the next editable box after insertion of video
   * or image so that user can insert something after this
   * @param {any} el
   * @memberof CreatorComponent
   */
  addNextEditableBox(el) {
    const div = this._renderer.createElement('div');
    this._renderer.addClass(div, 'content');
    this._renderer.setAttribute(div, 'contentEditable', 'true');
    this._renderer.setAttribute(div, 'placeholder', 'This is extra Content...');

    // this._renderer.appendChild(this.content.nativeElement, div);
    this._renderer.insertBefore(this.content.nativeElement, div, el.nextSibling);
  }

  /**
   * Create image element using the give link
   * @param {string} link - the path of the image
   * @returns
   * @memberof CreatorComponent
   */
  createImageElement(link: string, original: boolean) {
    const el = this._renderer.createElement('img');
    if (!original) {
      this._renderer.addClass(el, 'image');
    }
    this._renderer.setAttribute(el, 'src', link);
    this._renderer.listen(el, 'error', (e) => {
      e.srcElement.src = defaultImage;
    });
    return el;
  }

  /**
   * Create new video element according to the given link
   * @param {string} link - Link of the path of video
   * @returns
   * @memberof CreatorComponent
   */
  createVideoElement(link: string) {
    const video = this._renderer.createElement('iframe');

    const id = this.getVideoId(link);
    if (id === 'error') {
      alert('Please Add valid link');
      return;
    }

    link = 'https://www.youtube.com/embed/' + id;
    this._renderer.setAttribute(video, 'src', link);
    this._renderer.setAttribute(video, 'frameborder', '0');
    this._renderer.addClass(video, 'video');

    return video;
  }


  /**
   * Create a delete element which can be used to
   * delete the image or video element
   * @returns The delete element
   * @memberof CreatorComponent
   */
  createDeleteElement() {
    const el = this._renderer.createElement('i');
    this._renderer.addClass(el, 'fa');
    this._renderer.addClass(el, 'fa-window-close');
    this._renderer.setAttribute(el, 'aria-hidden', 'true');

    // Remove the parent on click of this element
    this._renderer.listen(el, 'click', (e) => {
      const parent = this._renderer.parentNode(e.srcElement);
      this._renderer.removeChild(this.content.nativeElement, parent);
    });
    return el;
  }

  /**
   * To resize the image to its original size
   * and to full size
   * @memberof CreatorComponent
   */
  createResizeElement() {
    const el = this._renderer.createElement('i');
    this._renderer.addClass(el, 'fa');
    this._renderer.addClass(el, 'fa-arrows-alt');
    this._renderer.setAttribute(el, 'aria-hidden', 'true');

    // Resize image on click
    this._renderer.listen(el, 'click', (e) => {
      const img = this._renderer.nextSibling(e.srcElement)
      if (img.classList.contains('image')) {
        this._renderer.removeClass(img, 'image');
      } else {
        this._renderer.addClass(img, 'image');
      }
    });
    return el;
  }


  /**
   * Get the video id from the youtube video link
   * @param {string} url - link of the youtube video
   * @returns Id of the youtube video
   * @memberof CreatorComponent
   */
  getVideoId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    } else {
      return 'error';
    }
  }

  /**
   * To listen to backspace and when div is empty
   * Delete it on furthur backspace
   * @param {any} key
   * @memberof CreatorComponent
   */
  backspaceListener(key) {
    if (key.code === 'Backspace') {
      const curEl = document.getSelection().anchorNode as HTMLElement;
      if (curEl.innerHTML === '' && this.canDelete(curEl)) {
        curEl.remove();
      }
    }
  }

  /**
   * Check whether we can delete current element or not
   * @param {any} el - The element to check
   * @returns
   * @memberof CreatorComponent
   */
  canDelete(el) {

    // Length and children of container
    const len = this.content.nativeElement.children.length;
    const children = this.content.nativeElement.children;
    console.log(len, children);
    // If length is 2 or it is last child of container we cannot delete
    if (len === 2 || el === children[len - 1] || el.parent === children[len - 1]) {
      return false;
    }

    // Return true if we can delete
    return true;
  }

  /**
   * Insert link to the selected text
   * @returns
   * @memberof CreatorComponent
  */
  insertLink() {
    this.selections = this.saveSelection();
    this.openPopUp((link: string) => {
      if (!link) {
        return;
      }
      this.formatText('CreateLink', link);
    });
  }

  /**
   * Embed code in the content
   * @returns
   * @memberof CreatorComponent
  */
  insertCode() {

    // Take the element where current selection is
    let curEl = document.getSelection().anchorNode as HTMLElement;

    // If it is internal value some tag
    if (!curEl.tagName) {
      curEl = curEl.parentElement;
    }
    if (curEl.parentElement.classList.contains('content')) {
      curEl = curEl.parentElement;
    } else if (!curEl.classList.contains('content')) {
      return;
    }

    // Toggle codeContainer class
    if (curEl.classList.contains('codeContainer')) {
      this._renderer.removeClass(curEl, 'codeContainer');
    } else {
      this._renderer.addClass(curEl, 'codeContainer');
      this.addNextEditableBox(curEl);
    }
  }

  /**
   * Close the pop up box
   * @memberof CreatorComponent
   */
  closePopUp() {
    this.isPopUpOn = false;
    this.popUpCallback(null);
  }

  /**
   * Open the pop up box
   * @memberof CreatorComponent
   */
  openPopUp(callback: any) {
    this.isPopUpOn = true;
    this.popUpCallback = callback;
  }

  /**
   * Open toast with given message and
   * time before closing
   * @param {string} message
   * @param {number} time
   * @memberof CreatorComponent
   */
  openToast(message: string, time: number) {
    this.toastMessage = message;
    this.isToastOn = true;
    setTimeout(() => { this.isToastOn = false; }, time);
  }

  appendElement(curEl, div) {
    if (curEl.classList && (this.content.nativeElement.children.length === 2 ||
      curEl.classList.contains('container') ||
      curEl.classList.contains('fakeBox'))) {
      this._renderer.appendChild(this.content.nativeElement, div);
    } else {
      this._renderer.insertBefore(this.content.nativeElement, div, curEl.nextSibling);
    }
  }

  /**
   * When There is a link from pop up box
   * Insert it into the text
   * @memberof CreatorComponent
   */
  onLinkInserted() {
    this.isPopUpOn = false;
    this.restoreSelection(this.selections);
    this.popUpCallback(this.link);
  }

  /**
   * Save selections or selected text so that
   * while opening pop up it will not lost
   * @returns
   * @memberof CreatorComponent
   */
  saveSelection() {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        const ranges = [];
        for (let i = 0, len = sel.rangeCount; i < len; ++i) {
          ranges.push(sel.getRangeAt(i));
        }
        return ranges;
      }
    } else if (document.selection && document.selection.createRange) {
      return document.selection.createRange();
    }
    return null;
  }

  /**
   * Restore selection from the saved one
   * And insert it into window selection
   * @param {any} savedSel
   * @memberof CreatorComponent
   */
  restoreSelection(savedSel) {
    if (savedSel) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        for (let i = 0, len = savedSel.length; i < len; ++i) {
          sel.addRange(savedSel[i]);
        }
      } else if (document.selection && savedSel.select) {
        savedSel.select();
      }
    }
  }

  /**
   * Save file to the server
   *
   * @memberof CreatorComponent
   */
  save() {
    const titleText = (document.getElementsByClassName('title')[0] as HTMLTextAreaElement).value;
    const content = (document.getElementsByClassName('container')[0] as HTMLElement).outerHTML;

    const data = this.parser.htmlToJson(titleText, content);

    if (this.id) {
      this.updateBlog(data, this.id);
    } else {
      // Take tags and Call the service to save this data
      this.openPopUp((tag: string) => {
        if (!tag) {
          return;
        }

        this.httpService.post({ data })
          .subscribe(
            res => {
              this.saveTile(tag, res[0]._id);
            },
            err => {
              console.log(err);
            }
          );
      });
    }

  }

  /**
   *  Update blog with given id and blog
   *
   * @param {*} data
   * @param {string} id
   * @memberof CreatorComponent
   */
  updateBlog(data: any, id: string) {
    // Take tags and Call the service to save this data
    this.openPopUp((tag: string) => {
      if (!tag) {
        return;
      }
      this.httpService.updateBlog({ data }, id)
        .subscribe(
          res => {
            console.log(res);
            if (res.msg === 'success') {
              this.saveTile(tag, this.id);
            } else {
              this.openToast('Failed to update', 2000);
            }
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  /**
   * Save tile to show general information about blog
   *
   * @memberof CreatorComponent
   */
  saveTile(tag: string, id: string) {
    const titleText = (document.getElementsByClassName('title')[0] as HTMLTextAreaElement).value;

    const images = document.getElementsByTagName('img');
    const img = images.length > 0 ? images[0].src : defaultImage;

    // Get the description from div which is not empty
    const descriptions = document.getElementsByClassName('content');
    let desp = '...';
    for (const desc of descriptions) {
      if (desc.innerText !== '') {
        desp = desc.innerText.substr(0, 200);
        break;
      }
    }

    if (this.id) {
      this.updateTile({ id, img, titleText, desp, tag });
    } else {
      this.httpService.postTile({ id, img, titleText, desp, tag })
        .subscribe(
          res => {
            this.openToast('Saved', 2000);
          },
          err => {
            console.log(err);
            this.openToast('Failed', 2000);
          }
        );
    }
  }

  /**
   * Update tile with given blog id
   *
   * @param {*} data
   * @memberof CreatorComponent
   */
  updateTile(data: any) {
    this.httpService.updateTile(data)
      .subscribe(
        res => {
          console.log(res);
          if (res.msg === 'success') {
            this.openToast('Updated', 2000);
          } else {
            this.openToast('Failed to update', 2000);
          }
        },
        err => {
          console.log(err);
          this.openToast('Failed', 2000);
        }
      );
  }

  parseData(data: any) {
    let div, del, img, video, id, resize;

    for (let i = 0; i < data.length; i++) {
      const tagName = data[i].tagName;
      switch (tagName) {
        case 'title':
          this.title.nativeElement.value = data[i].value;
          break;
        case 'text':
          div = document.createElement('div');
          this._renderer.addClass(div, 'content');
          this._renderer.setAttribute(div, 'contentEditable', 'true');
          div.innerHTML = data[i].html;
          this._renderer.appendChild(this.content.nativeElement, div);
          break;
        case 'code':
          div = document.createElement('div');
          this._renderer.addClass(div, 'content');
          this._renderer.addClass(div, 'codeContainer');
          this._renderer.setAttribute(div, 'contentEditable', 'true');
          div.innerHTML = data[i].html;
          this._renderer.appendChild(this.content.nativeElement, div);
          break;
        case 'img':
          div = this._renderer.createElement('div');
          this._renderer.addClass(div, 'imageContainer');
          img = this.createImageElement(data[i].src, data[i].original);
          del = this.createDeleteElement();
          resize = this.createResizeElement();
          this._renderer.appendChild(div, del);
          this._renderer.appendChild(div, resize);
          this._renderer.appendChild(div, img);
          this.appendElement(this.content.nativeElement, div);
          break;
        case 'video':
          div = this._renderer.createElement('div');
          this._renderer.addClass(div, 'videoContainer');
          id = data[i].src.split('/').pop();
          video = this.createVideoElement(id);
          del = this.createDeleteElement();
          this._renderer.appendChild(div, del);
          this._renderer.appendChild(div, video);
          this.appendElement(this.content.nativeElement, div);
          break;
        default:
          console.log('INVALID TAG');
      }
    }
  }


}
