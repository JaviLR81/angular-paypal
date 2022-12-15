import { Component, OnInit, Renderer2 } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Order } from './interfaces';
import { PaypalService } from './services/paypal.service';
import { TkScriptTagService } from './services/tk-script-tag.service';

declare var paypal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  orders: Order[] = [];
  title = 'casa-ideas-paypal';

  constructor(
    private renderer: Renderer2,
    private scriptService: TkScriptTagService,
    private paypalService: PaypalService
){}

  ngOnInit(): void {
    this.showPaypalButtons();
    this.getOrders();
  }

  private showPaypalButtons(){
    // TODO : Agregar valores de credenciales por medio de los archivos environments
    this.scriptService.addScript(
        this.renderer,
        'text/javascript',
        `https://www.paypal.com/sdk/js?client-id=AQijM_QdHjNkgwngjo689snezUuN9D8yrGG16Cxam5BREYrqfwpqMipfmbyXsG57RvyZ7NvPCPHzyCpi&currency=MXN`,
        'paypal-script',
        'UTF-8',
        'body',
        'someone',
        // when the script fires the onload event
        () => {
          this.configure();
        }
      );
  }

  private configure(): void {
    paypal.Buttons({
      style: {
        label: 'pay'
      },
      // createOrder() is called when the paypal button is clicked
      createOrder: () => {
        return lastValueFrom(
            this.paypalService.createOrder()
        ).then(
            (data) => {
              return data.id;
            }
          ).catch( (e) => {
            console.log(`Error al tratar de crear la orden`, e);
          }
        )
      },
      // onApprove() is called when the buyer approves the payment in paypal
      // data : data associated
      // actions : functions to realize
      onApprove: (data: any, actions: any) => {
          this.paypalService.captureOrder(data.orderID).subscribe(
            {
            next: resp => {
              console.log('Payment completed...', resp)
              this.getOrders();
            },
            error : e => {
              console.log('Error onApprove()', e)
            },
            complete: () => {
              console.log('Observable completed()')
            }
            }
          );
      },
      onError: (error: any) => {
        alert('Ha ocurrido un error en el pago de paypal');
        console.log('Ha ocurrido un error en el pago de paypal', error);
      },
      onCancel: (data: any) => {
        alert('Pago cancelado');
        console.log(data); // nos retorna el id de la orden pop up cancelado
      }
    }).render('#paypal-button-container');
  }

  private getOrders(){
    this.paypalService.getOrders()
      .subscribe( orders => {
        console.log("~orders", orders)
        this.orders = orders;
      });
  }

}
