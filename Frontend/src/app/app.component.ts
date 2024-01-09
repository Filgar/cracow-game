import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { MainPageTab } from './models/MainPageTab';
import { NavigationComponent } from "./navigation/navigation.component";
import { AboutComponent } from "./main/about/about.component";
import { TutorialComponent } from "./main/tutorial/tutorial.component";
import { GameComponent } from "./main/game/game.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, HeaderComponent, NavigationComponent, AboutComponent, TutorialComponent, GameComponent]
})

export class AppComponent {
  mainPageTab = MainPageTab;
  public selectedTab: MainPageTab = MainPageTab.Play;
  
  selectTab(newTab: MainPageTab): void {
    this.selectedTab = newTab;
  }
}
