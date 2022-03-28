import Order from '../../domain/entity/order';
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';

export default class OrderRepository implements OrderRepositoryInterface {

    private entityToModel(entity: Order) {
        return {
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total,
            items: entity.items.map(item => ({
                id: item.id,
                order_id: entity.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        }
    }

    async create(order: Order): Promise<void> {
        await OrderModel.create(this.entityToModel(order), {
            include: [{ model: OrderItemModel }]
        });
    }

    update(item: Order): Promise<void> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    find(id: string): Promise<Order> {
        throw new Error('Method not implemented.');
    }

    findAll(): Promise<Order[]> {
        throw new Error('Method not implemented.');
    }

}