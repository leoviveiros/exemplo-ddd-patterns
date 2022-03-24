import Address from './domain/entity/address';
import Customer from './domain/entity/customer';
import Order from './domain/entity/order';
import OrderItem from './domain/entity/order-item';

// Customer Aggregate
const customer = new Customer('123', 'John');
const address = new Address('Rua Vergueiro', 300, '01310-200', 'São Paulo');

customer.Address = address;
customer.activate();

// Order Aggregate
const item1 = new OrderItem('1', 'Product 1', 10, '2', 2);
const item2 = new OrderItem('2', 'Product 2', 20, '3', 1);

const order = new Order('1', '123', [item1, item2]);
