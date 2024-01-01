import {ToasterModule, ToasterService, ToasterConfig, Toast} from 'angular2-toaster';
import {Injectable} from '@angular/core';

@Injectable()
export class MessageService {
  private toasterService: ToasterService;
  constructor(toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  public config: ToasterConfig =
  new ToasterConfig({
    showCloseButton: true,
    tapToDismiss: false,
    timeout: 3000
  });

  popToastSuccess(messagsucess) {
    var toast: Toast = {
      type: 'success',
      body: messagsucess
    };
    this.toasterService.pop(toast);
  }

  popToastError() {
    var toast: Toast = {
      type: 'error',
      body: "something went wrong"
    };

    this.toasterService.pop(toast);
  }
  
  
  validationError(errorMessage) {
    var toast: Toast = {
      type: 'error',
      body: errorMessage
    };

    this.toasterService.pop(toast);
  }
  
  popToastForOrderCreate(messagsucess) {
    this.toasterService.pop({
      type: 'success',
      body: messagsucess,
      timeout: 3000,
    });
  }
  
  popToastForRegister() {
    this.toasterService.pop({
      type: 'error',
      body: "Please register to save the article, Please register to add the product to wishlist.",
      timeout: 4000,
    });
  }
  
  
  wishListDeleteToast() {
    this.toasterService.pop({
      type: 'success',
      body: 'Wishlist item deleted successfully',
      timeout: 3000,
    });
  }
  
}