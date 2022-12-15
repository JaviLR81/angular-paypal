export interface PaypalOrderResponse {
    id:     string;
    status: string;
    links:  Link[];
}

export interface PaypalCaptureResponse {
  id:     string;
  status: string;
  links:  Link[];
}

export interface Link {
    href:   string;
    rel:    string;
    method: string;
}

export interface Order {
  id:                number;
  paypalOrderId:     string;
  paypalOrderStatus: string;
  amount:            number;
}

