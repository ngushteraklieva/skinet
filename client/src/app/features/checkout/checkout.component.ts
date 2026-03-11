import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatStepperModule } from '@angular/material/stepper'
import { MatAnchor, MatButton } from "@angular/material/button";
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StripeAddressElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatAnchor,
    MatButton,
    RouterLink
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private stripeService = inject(StripeService)
  private snackbar = inject(SnackbarService)
  addressElement?: StripeAddressElement;

  async ngOnInit(){
    try{
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
    } catch (error:any){
      this.snackbar.error(error.message)
    }
  }

  ngOnDestroy(): void {
    this.stripeService.disposeElements()
  }
}
