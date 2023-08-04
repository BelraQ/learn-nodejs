const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        //모델 정보, 테이블 정보
        User.init({ 
            //테이블 설정
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100), //패스워드 암호화 시 길어질 것 감안
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: { // 로그인 id 받아 저장하면 email 대용으로 사용 가능
                type: Sequelize.STRING(30),
                allowNull: true,
            },
            //snsId가 없으면 email로 가입한 사람, email이 없으면 snsId로 가입한 사람
            //email로 가입한 사람은 provider가 local, snsId는 kakao
            //sequelize가 값 존재 여부 검사 기능이 있기 때문에 email, snsId 모두 allowNull: true로 해 두었음
        },
            {
                sequelize,
                timestamps: true, //createdAt, updatedAt User생성일, User수정일 자동 기록
                underscored: false, // true 시 created_at, updated_at로 컬럼명 변경
                modelName: 'User', //자바스크립트에서 쓰는 이름  
                tableName: 'users', //DB의 테이블 이름
                paranoid: 'true', //deletedAt 유저 삭제일 기록(탈퇴했다고 삭제하면 복구가 번거롭기 때문에
                //데이터를 지우지 않고 삭제일을 만들어 삭제일로 삭제 여부 식별 => soft delete / 싹 날리면 hard delete)
                charset: 'utf8', //db 문자 저장 방식(이모티콘까지 저장하고 싶다면 utf8mb4, utf8mb4_general_ci)
                collate: 'utf8_general_ci', //문자 저장 방식의 정렬 방법(무난하게 general_ci)
        })
    }
    //associate: 테이블 관계
    static associate(db) {
        db.User.hasMany(db.Post); //사용자와 게시글은 1 : N 관계
        //팔로잉과 팔로워 N : M 관계(중간 테이블 생성)
        db.User.belongsToMany(db.User, { //팔로워: followingId에서 Followers를 찾을 수 있기 때문에
            foreignKey: 'followingId',
            as: 'Followers', //as: 테이블 모델 구분을 위해
            through: 'Follow',
        });
        db.User.belongsToMany(db.User, { //팔로잉: followerId에서 Followings을 찾을 수 있기 때문에
            foreignKey: 'followerId', //foreignKey와 as의 관계 이해 어렵네
            as: 'Followings',
            through: 'Follow',
        });
        db.User.hasMany(db.Domain);
    }
}
module.exports = User;