import { TestBed } from '@angular/core/testing';

import { Pizzaria } from './pizzaria';

describe('Pizzaria', () => {
  let service: Pizzaria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pizzaria);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
