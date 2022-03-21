import Address from './address';

/*
Complexidade de Negócio:
- domain (regras de negocio)
    - entity
        - customer.ts

Complexidade Acidental
- infra (mundo externo)
    - model
        - customer.ts (getters / setters)
*/
export default class Customer {
    _id: string;
    _name: string;
    _address!: Address;
    _active: boolean = false;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;

        this.validade();
    }

    changeName(name: string) {
        this._name = name;

        this.validade();
    }

    activate() {
        if (!this._address) {
            throw new Error("Customer must have an address");
        }

        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    validade() {
        if (!this._id || this._id.length === 0) {
            throw new Error("Id is required");
        }

        if (!this._name || this._name.length === 0) {
            throw new Error("Name is required");
        }
    }

    set Address(address: Address) {
        this._address = address;
    }

}