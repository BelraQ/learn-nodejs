const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static initiate(sequelize) {
        //모델 정보, 테이블 정보
        Post.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200), //한 게시글에 img가 여러 개이려면 1대N 관계가 필요(이미지 테이블 필요)
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }
    //associate: 테이블 관계
    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); //이름이 달라 헷갈릴 염려가 없음(as 제외)
        //중간 테이블에 바로 접근하고 싶다면 db.sequelize.models.PostHashtag 같이 사용하기.
    }
}
module.exports = Post;