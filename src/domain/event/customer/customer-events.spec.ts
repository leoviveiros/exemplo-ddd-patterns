import Address from '../../entity/address';
import Customer from '../../entity/customer';
import EventDispatcher from '../shared/event-dispatcher';
import EnviaConsoleLog1Handler from './handler/envia-console-log-1.handler';
import EnviaConsoleLog2Handler from './handler/envia-console-log-2.handler';
import LogsWhenCustomerAddressChangedHandler from './handler/logs-when-customer-address-changed.handler';

describe('Customer Event tests', () => {

    it('should notify a customer created event', () => {
        const eventDispatcher = new EventDispatcher();
        const log1Handler = new EnviaConsoleLog1Handler();
        const log2Handler = new EnviaConsoleLog2Handler();

        const spyLog1Handler = jest.spyOn(log1Handler, 'handle');
        const spyLog2Handler = jest.spyOn(log2Handler, 'handle');

        const eventName = 'CustomerCreatedEvent';

        eventDispatcher.register(eventName, log1Handler);
        eventDispatcher.register(eventName, log2Handler);

        const customer = new Customer('1', 'Customer 1');

        customer.notifyCustomerCreated(eventDispatcher);

        expect(spyLog1Handler).toHaveBeenCalled();
        expect(spyLog2Handler).toHaveBeenCalled();
    });

    it('should notify a customer address changed event', () => {
        const eventDispatcher = new EventDispatcher();
        const addressChangedHandler = new LogsWhenCustomerAddressChangedHandler();

        const spyHandler = jest.spyOn(addressChangedHandler, 'handle');

        const eventName = 'CustomerAddressChangedEvent';

        eventDispatcher.register(eventName, addressChangedHandler);

        const address = new Address('Street 1', 125, '123-45', 'City 1');
        const customer = new Customer('234', 'Customer 1');

        customer.changeAddress(address);
        customer.notifyAddressChanged(eventDispatcher);

        expect(spyHandler).toHaveBeenCalled();
    });

});