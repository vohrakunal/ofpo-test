import { TestBed, inject } from '@angular/core/testing';

import { ProductUtilService } from './product-util.service';

describe('ProductUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductUtilService]
    });
  });

  it('should be created', inject([ProductUtilService], (service: ProductUtilService) => {
    expect(service).toBeTruthy();
  }));
});
