import { Component, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { District } from '../../../models/District';
import { UrbanObjectType } from '../../../models/UrbanObjectType';
import { GameService } from '../../../services/game.service';
import { ToastrService } from 'ngx-toastr';
import { StorageConsts } from '../../../models/StorageConsts';


@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [MatCheckboxModule, MatListModule, CommonModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})

export class SetupComponent implements OnInit{
  public types: Array<any> = [];
  public districts: Array<any> = [];
  public districtsListVisible: boolean = false;
  public amount!: number;
  public isValid: boolean = false;

  constructor(
    private readonly dataService: DataService,
    private readonly gameService: GameService,
    private readonly toastr: ToastrService
    ) {}
  
    async ngOnInit(): Promise<void> {
    const storedConfigData = localStorage.getItem(StorageConsts.gameConfig);

    if (storedConfigData) {
      const storedConfig = JSON.parse(storedConfigData);
      this.types = storedConfig.types;
      this.districts = storedConfig.districts;
      this.amount = storedConfig.amount;
      this.validateForm();
    }
    else {
      const types: UrbanObjectType[] = await this.dataService.getUrbanObjectTypes();
      this.types = types.map(x => ({"name": x, "checked": true}));
  
      const districts: District[] = await this.dataService.getDistricts();
      this.districts = districts.map(x => ({"name": x.name, "value": x.value, "checked": true}))
    }
  }


  getTypeName(type: string): string {
    switch(type) {
      case 'pa': return 'Bus stops';
      case 'pt': return 'Tram stops';
      case 'pta': return 'Bus terminals';
      case 'ul': return 'Streets';
    }
    return type;
  };

  toggleDistricts(): void {
    this.districtsListVisible = !this.districtsListVisible;
  }

  setAmount(): void {
    this.amount = Math.floor(Math.max(1, Math.min(this.amount, 50)));
    this.validateForm();
  }

  validateForm(): void {
    this.isValid = this.types.some(x => x.checked) &&
      this.districts.some(x => x.checked) &&
      this.amount != null;
  }

  async play(): Promise<void> {
    this.saveConfig();
    
    const storedIds = localStorage.getItem(StorageConsts.forbiddenIds);
    const forbiddenIds = storedIds ? JSON.parse(storedIds) : [];
    const gameData = await this.dataService.getUrbanObjects(forbiddenIds, this.types.filter(x => x.checked).map(x => x.name), this.getDistrictsValue(), this.amount);
    
    if (gameData.length == 0) {
      this.toastr.error('No objects found matching your criteria. Please change your settings and try again.', 'No objects found');
      return;
    }

    if (gameData.length < this.amount) {
      this.toastr.info('Found less objects matching criteria than requested amount.', 'Not enough objects found');
    }

    this.gameService.startGame(gameData);
  }
  
  private getDistrictsValue(): number {
    return this.districts.filter(x => x.checked).reduce((x, {value}) => x + value, 0);
  }

  private saveConfig(): void {
    const config = {
      types: this.types,
      districts: this.districts,
      amount: this.amount
    };
    localStorage.setItem(StorageConsts.gameConfig, JSON.stringify(config));
  }
}
