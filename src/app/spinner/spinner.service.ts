import {Injectable} from '@angular/core';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Injectable()
export class SpinnerService {

  constructor(private spinnerService: Ng4LoadingSpinnerService) {
  }

  start() {
    this.spinnerService.show();
  }

  end() {
    this.spinnerService.hide();
  }
}