import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { ProductsFallbackModule } from './products-fallback.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'products',
        loadChildren: () =>
          loadRemoteModule({
            type: 'script',
            remoteEntry: 'http://localhost:4201/remoteEntry.js',
            remoteName: 'products',
            exposedModule: './ProductsModule'
          })
          .then(m => m.ProductsModule)
          .catch(err => {
            console.error('Failed to load remote module:', err);
            return ProductsFallbackModule;
          })
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
