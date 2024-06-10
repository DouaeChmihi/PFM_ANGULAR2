import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffersRoutingModule } from './offers-routing.module';
import { SpecialOfferComponent } from './components/special-offer/special-offer.component';
import { PromotionComponent } from './components/promotion/promotion.component';


@NgModule({
  declarations: [
    SpecialOfferComponent,
    PromotionComponent
  ],
  imports: [
    CommonModule,
    OffersRoutingModule
  ]
})
export class OffersModule { }
