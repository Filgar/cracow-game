import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MainPageTab } from '../models/MainPageTab';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Output() tabSelectedEvent: EventEmitter<MainPageTab> = new EventEmitter<MainPageTab>();
  @ViewChild('marker') selectionMarker!: ElementRef; 
  mainPageTab = MainPageTab;
  public selectedTab: MainPageTab = MainPageTab.Play;

  constructor() {
    
  }

  selectTab(newTab: MainPageTab): void {
    this.selectedTab = newTab;
    this.tabSelectedEvent.emit(newTab);
    const { offsetWidth } = this.selectionMarker.nativeElement;
    this.selectionMarker.nativeElement.setAttribute('style', `transform: translateX(${offsetWidth * newTab}px)`);
  }
}
