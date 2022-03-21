export default class OrderItem {
    private id: string;
    private name: string;
    private price: number;

    constructor(id: string, name: string, price: number) {
        this.id = id;
        this.name = name;
        this.price = price;

        this.validate();
    }

    private validate(): void {
        if (!this.id || this.id.length === 0) {
            throw new Error("Id is required");
        }

        if (!this.name || this.name.length === 0) {
            throw new Error("Name is required");
        }

        if (!this.price) {
            throw new Error("Price is required");
        }
    }

}