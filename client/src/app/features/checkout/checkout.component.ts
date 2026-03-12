import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatStepperModule } from '@angular/material/stepper'
import { MatAnchor, MatButton } from "@angular/material/button";
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Address, StripeAddressElement } from '@stripe/stripe-js';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox'
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatAnchor,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDeliveryComponent
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private stripeService = inject(StripeService)
  private snackbar = inject(SnackbarService)
  private accountService = inject(AccountService)
  addressElement?: StripeAddressElement;
  saveAddress = false;

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

  onSaveAddressCheckboxChange(event: MatCheckboxChange){
    this.saveAddress = event.checked
  }

  async onStepChange(event: StepperSelectionEvent){
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if(event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentsIntent())
    }
  }

  private async getAddressFromStripeAddress() {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if (address) {
      return {
        line1: address.line1,
        line2: address.line2 ?? '',
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postal_code
      }
    } else return null;
  }
}
