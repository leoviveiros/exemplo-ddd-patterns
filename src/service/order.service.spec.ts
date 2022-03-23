import Order from '../entity/order';
import OrderItem from '../entity/order-item';
import OrderService from './order.service';

describe('Order Service unit tests', () => {

    it('should get total of all orders', () => {
        const item1 = new OrderItem('1', 'Item1', 100, 'product1', 1);
        const item2 = new OrderItem('2', 'Item2', 200, 'product2', 2);

        const order1 = new Order('1', 'customer1', [item1]);
        const order2 = new Order('2', 'customer2', [item2]);

        const orders = [order1, order2];

        const total = OrderService.total(orders);

        expect(total).toBe(500);
    });

});