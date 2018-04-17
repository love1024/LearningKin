import { Injectable } from '@angular/core';

@Injectable()
export class ParserService {

  public htmlToJson(title: string, html: string): any {
    const wrapper = document.createElement('div') as HTMLElement;
    wrapper.innerHTML = html;
    const childrens = wrapper.children[0].children;

    const data = [];
    data.push(this.createTitle(title));
    for (let i = 0; i < childrens.length; i++) {
      const classes = childrens[i].classList;
      if (classes.contains('codeContainer')) {
        data.push(this.createCode(childrens[i] as HTMLElement));
      } else if (classes.contains('content')) {
        data.push(this.createContent(childrens[i] as HTMLElement));
      } else if (classes.contains('imageContainer')) {
        data.push(this.createImage(childrens[i] as HTMLElement));
      } else if (classes.contains('videoContainer')) {
        data.push(this.createVideo(childrens[i] as HTMLElement));
      }
    }
    return data;
  }

  private createContent(node: HTMLElement) {
    return {
      tagName: 'text',
      html: node.innerHTML
    };
  }

  private createCode(node: HTMLElement) {
    return {
      tagName: 'code',
      html: node.innerHTML
    };
  }

  private createImage(node: HTMLElement) {
    const imgURL = node.getElementsByTagName('img')[0].src;
    const resizeClass = node.getElementsByTagName('img')[0].classList.contains('image');
    return {
      tagName: 'img',
      src: imgURL,
      original: resizeClass
    };
  }

  private createVideo(node: HTMLElement) {
    const videoURL = node.getElementsByTagName('video')[0].src;
    return {
      tagName: 'video',
      src: videoURL
    };
  }

  private createTitle(value: string) {
    return {
      tagName: 'title',
      value: value
    };
  }

}
