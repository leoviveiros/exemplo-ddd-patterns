import { Sequelize } from 'sequelize-typescript';

import Order from '../../domain/entity/order';
import OrderItem from '../../domain/entity/order-item';
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';

export default class OrderRepository implements OrderRepositoryInterface {

    constructor(private sequelize: Sequelize) { }

    private entityToModel(entity: Order) {
        return {
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total,
            items: entity.items.map(item => this.orderItemEntityToModel(item, entity.id))
        }
    }

    private orderItemEntityToModel(orderItem: OrderItem, order_id: string) {
        return {
            id: orderItem.id,
            order_id: order_id,
            product_id: orderItem.productId,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity
        }
    }

    async create(order: Order): Promise<void> {
        await OrderModel.create(this.entityToModel(order), {
            include: [{ model: OrderItemModel }]
        });
    }

    async update(order: Order): Promise<void> {
        return this.sequelize.transaction(async transaction => {
            await OrderModel.update(this.entityToModel(order), {
                where: { id: order.id },
                transaction: transaction
            });

            const orderItems = order.items.map(item => this.orderItemEntityToModel(item, order.id));
            const promises: Promise<any>[] = [];

            orderItems.forEach(async item => {
                promises.push(OrderItemModel.upsert(item, { transaction: transaction }));
            });

            await Promise.all(promises);
        });
    }

    async delete(id: string): Promise<void> {
        return this.sequelize.transaction(async transaction => {
            await OrderModel.destroy({
                where: { id: id },
                transaction: transaction
            });

            await OrderItemModel.destroy({
                where: { order_id: id },
                transaction: transaction
            });
        });
    }

    find(id: string): Promise<Order> {
        throw new Error('Method not implemented.');
    }

    findAll(): Promise<Order[]> {
        throw new Error('Method not implemented.');
    }
    
}