import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { executeInterval } from 'src/app/utils/general-utils';

@Component({
  selector: 'app-list-shuffling',
  templateUrl: './list-shuffling.component.html',
  styleUrls: ['./list-shuffling.component.less'],
})
export class ListShufflingComponent {
  @ViewChild('listInput')
  private listInputElement?: ElementRef;
  @ViewChild('listContainer')
  private listContainerElement?: ElementRef;

  list: string[] = [];
  inputValue: string = '';
  isShuffling: boolean = false;

  resetList(): void {
    this.list = [];
    this.inputValue = '';
    this.listInputElement?.nativeElement?.focus();
  }

  submitInput(): void {
    this.addToList(this.inputValue);
    this.inputValue = '';
    this.listInputElement?.nativeElement?.focus();
  }

  private addToList(value: string): void {
    const trimmedValue = value?.trim() ?? '';

    if (trimmedValue.length < 1) {
      return; // ignore empty strings
    }

    this.list.push(trimmedValue);
  }

  shuffleList(): void {
    if (this.isShuffling || this.list.length < 2) {
      // don't bother with a list that can't be shuffled
      return;
    }
    
    this.isShuffling = true;
    const intervalMs = 300, intervalEndMs = 3000;
    let intervalCounter = 0;

    const collection: HTMLCollection = this.listContainerElement?.nativeElement?.children;
    const listElements = (Array.from(collection) ?? []) as HTMLElement[];
    const startColor = 'Magenta', endColor = 'Cyan';

    const interval = executeInterval(() => {
      if (intervalCounter * intervalMs >= intervalEndMs) {
        setTimeout(() => {
          listElements.forEach(element => element.style.removeProperty('background'));
        }, intervalMs);

        this.isShuffling = false;
        clearInterval(interval);
      }

      this.list.sort((_, __) => Math.random() - 0.5);
      const background = `linear-gradient(${(intervalCounter * 90) % 360}deg, ${startColor}, ${endColor})`;
      listElements.forEach(element => element.style.background = background);
      intervalCounter++;
    }, intervalMs);

    this.listInputElement?.nativeElement?.focus();
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }
}