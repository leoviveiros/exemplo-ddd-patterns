import OrderItem from './order-item';

export default class Order {
    private id: string;
    private customerId: string;
    private itens: OrderItem[];

    constructor(id: string, customerId: string, itens: OrderItem[]) {
        this.id = id;
        this.customerId = customerId;
        this.itens = itens;

        this.validate();
    }

    private validate(): void {
        if (!this.id || this.id.length === 0) {
            throw new Error("Id is required");
        }

        if (!this.customerId || this.customerId.length === 0) {
            throw new Error("CustomerId is required");
        }

        if (!this.itens || this.itens.length === 0) {
            throw new Error("Itens is required");
        }
    }

}