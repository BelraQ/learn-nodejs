const Sequelize = require('sequelize');
const { associate } = require('./user');

class Domain extends Sequelize.Model {
    static initiate(sequelize) {
        Domain.init({
            host: {
                type: Sequelize.STRING(80),
                allowNull: false,     
            },
            type: {
               type: Sequelize.ENUM('free', 'premium'),
               allowNull: false, 
            },
            clientSecret: {
                type: Sequelize.UUID, //UUID: 고유 문자(진짜 웬만하면 거의 안 겹침)
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Domain',
            tableName: 'domains',
        })
    }

    static associate(db) {
        db.Domain.belongsTo(db.User);
    }
}

module.exports = Domain;