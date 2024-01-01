import { TestBed, inject } from '@angular/core/testing';

import { ProductlistService } from './productlist.service';

describe('ProductlistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductlistService]
    });
  });

  it('should be created', inject([ProductlistService], (service: ProductlistService) => {
    expect(service).toBeTruthy();
  }));
});
