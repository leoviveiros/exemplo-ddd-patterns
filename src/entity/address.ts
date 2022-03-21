
export default class Address {
    _street: string;
    _number: number;
    _complement: string;
    _zipCode: string;
    _city: string;

    constructor(street: string, number: number, complement: string, zipCode: string, city: string) {
        this._street = street;
        this._number = number;
        this._complement = complement;
        this._zipCode = zipCode;
        this._city = city;

        this.validade();
    }

    validade() {
        if (!this._street || this._street.length === 0) {
            throw new Error("Street is required");
        }

        if (!this._number) {
            throw new Error("Number is required");
        }

        if (!this._zipCode || this._zipCode.length === 0) {
            throw new Error("ZipCode is required");
        }

        if (!this._city || this._city.length === 0) {
            throw new Error("City is required");
        }
    }

    toString() {
        return `${this._street}, ${this._number}, ${this._complement}, ${this._zipCode}, ${this._city}`;
    }

}