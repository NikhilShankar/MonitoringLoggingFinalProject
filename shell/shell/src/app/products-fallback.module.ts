import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    template: `
    <div style="padding: 20px; border: 2px dashed #ccc; text-align: center; margin: 20px;">
      <h2>Products Microfrontend Not Available</h2>
      <p>The products microfrontend at <code>http://localhost:4201</code> is not running or not properly configured.</p>
      <p>Please ensure the products app is running and properly exposing its modules.</p>
      <ul style="text-align: left; display: inline-block;">
        <li>Check if the products app is running on port 4201</li>
        <li>Verify the remoteEntry.js is accessible</li>
        <li>Ensure the ProductsModule is properly exposed</li>
      </ul>
    </div>
  `
})
export class ProductsFallbackComponent { }

@NgModule({
    declarations: [ProductsFallbackComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: ProductsFallbackComponent }
        ])
    ]
})
export class ProductsFallbackModule { }
