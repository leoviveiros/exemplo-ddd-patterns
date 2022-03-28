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
import OrderRepository from './order.repository';
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

    describe('persistence tests', () => {

        let productRepository: ProductRepository;
        let orderRepository: OrderRepository;
        let orderItem: OrderItem;
        let order: Order;

        beforeEach(async () => {
            orderRepository = new OrderRepository(sequelize);

            const customerRepository = new CustomerRepository();
            const customer = new Customer('1', 'Customer 1')
            const address = new Address('Street 1', 1, 'Zip Code 1', 'City 1');

            customer.changeAddress(address);

            await customerRepository.create(customer);

            productRepository = new ProductRepository();
            const product = new Product('1', 'Product 1', 100);

            await productRepository.create(product);

            orderItem = new OrderItem('1', product.name, product.price, product.id, 2);
            order = new Order('123', customer.id, [orderItem]);
        });

        it('should create an order', async () => {
            await orderRepository.create(order);

            const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ['items'] });

            expect(orderModel.toJSON()).toStrictEqual({
                id: order.id,
                customer_id: order.customerId,
                total: order.total,
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

        it('should update an order', async () => {
            await orderRepository.create(order);

            const product2 = new Product('2', 'Product 2', 200);

            await productRepository.create(product2);

            const newItem = new OrderItem('2', product2.name, product2.price, product2.id, 2);

            order.addItem(newItem);

            await orderRepository.update(order);

            const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ['items'] });

            expect(orderModel.toJSON()).toStrictEqual({
                id: order.id,
                customer_id: order.customerId,
                total: order.total,
                items: [{
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    product_id: orderItem.productId,
                    quantity: orderItem.quantity,
                    order_id: order.id
                }, {
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    product_id: newItem.productId,
                    quantity: newItem.quantity,
                    order_id: order.id
                }],
            });
        });

        it('should delete an order', async () => {
            await orderRepository.create(order);

            let orderItems = await OrderItemModel.findAll({ where: { order_id: order.id } });

            expect(orderItems).toHaveLength(1);

            await orderRepository.delete(order.id);

            const orderModel = await OrderModel.findOne({ where: { id: order.id } });

            expect(orderModel).toBeNull();

            orderItems = await OrderItemModel.findAll({ where: { order_id: order.id } });

            expect(orderItems).toHaveLength(0);
        });

        it('should find an order', async () => {
            await orderRepository.create(order);

            const orderFound = await orderRepository.find(order.id);

            expect(orderFound).toStrictEqual(order);
        });

        it('should throw and error when an order is not found', () => {
            expect(async () => {
                await orderRepository.find('1WER');
            }).rejects.toThrow('Order not found');
        });

    });

});