import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created.handler';
import EventDispatcher from './event-dispatcher';

describe('Domain Event tests', () => {

    it('shoud register an event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const eventName = 'ProductCreatedEvent';

        eventDispatcher.register(eventName, eventHandler);

        expect(eventDispatcher.getEventHandlers(eventName)).toBeDefined();
        expect(eventDispatcher.getEventHandlers(eventName)).toHaveLength(1);
        expect(eventDispatcher.getEventHandlers(eventName)[0]).toMatchObject(eventHandler);
    });

});