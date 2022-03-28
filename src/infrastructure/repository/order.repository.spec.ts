import { Sequelize } from 'sequelize-typescript';
import CustomerModel from '../db/sequelize/model/customer.model';

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
            // OrderModel
            CustomerModel
        ]);

        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });
});
