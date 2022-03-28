import { Sequelize } from 'sequelize-typescript';
import Address from '../../domain/entity/address';
import Customer from '../../domain/entity/customer';
import Order from '../../domain/entity/order';
import OrderItem from '../../domain/entity/order-item';
import Product from '../../domain/entity/product';
import CustomerModel from '../db/sequelize/model/customer.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';
import ProductModel from '../db/sequelize/model/product.model';
import CustomerRepository from './customer.repository';
import ProductRepository from './product.repository';

describe('Order Repository Tests', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([
            OrderModel,
            OrderItemModel,
            CustomerModel,
            ProductModel
        ]);

        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create an order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Customer 1')
        const address = new Address('Street 1', 1, 'Zip Code 1', 'City 1');

        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);

        await productRepository.create(product);

        const orderItem = new OrderItem('1', product.name, product.price, product.id, 2);
        const order = new Order('123', customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ['items'] });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            items: [{
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                product_id: orderItem.productId,
                quantity: orderItem.quantity,
                order_id: order.id
            }],
        });

    });
});
