import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  colorPalette: string[] =
    ['#E42E4B', '#BBE365', '#0998FF', '#4E9A00', '#DA3FAE', '#84CE33',
      '#A1A6B0', '#F69599', '#FF9800', '#5E4ACF', '#E42E4B', '#FF5123',
      '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400',
      '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
      '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
      '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E']

  colorPaletteStatus: string[][] = [
    ['#FFF', 'rgb(224,230,233,0.2)'], /* 0 Disable */
    ['#32C5FF', 'rgb(51,149,240,0.2)'], /* 1 Available */
    ['#d6ce38', 'rgb(214,206,56,100)'], /* 2 Reserved */
    ['#F64662', 'rgb(238,166,166,0.2)'], /* 3 Busy */
    ['#58ff32', 'rgb(240,180,51,0.2)'],  /* 4 Coming */
    ['#13C91B', 'rgb(19,201,27,0.2)'] /* 5 Billed */

  ];

  getColor(postion: number) {
    return this.colorPalette[postion];
  }

  getColorStatus(position: number, type: number = 0) {
    return this.colorPaletteStatus[position][type];
  }


}
