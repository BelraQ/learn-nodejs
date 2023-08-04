//기본 index.js는 문제가 좀 있다고 함
const Sequelize = require('sequelize');
//const User = require('./user');
//const Post = require('./post');
//const Hashtag = require('./hashtag');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; //config 파일 불러오기
const db = {};
const sequelize = new Sequelize( //sequelize 연결 만들기
  config.database, config.username, config.password, config,
);
//재사용되기 때문에 db라는 하나의 객체로 묶어둠
db.sequelize = sequelize;

const basename = path.basename(__filename); //지금 있는 파일 이름(index.js)

fs.readdirSync(__dirname) //지금 있는 디렉토리 이름
  .filter(file => {  //file에 dirname 하위 파일이 다 적힘(들어감).
    //return file !== basename; //index.js 제외를 위한 코드
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'; // 숨김 파일 걸러내기, 확장자가 js아니면 꽝 
    //보통 리눅스를 서버에 많이 쓰는데 리눅스에는 숨김 파일이 있음
  }) 
  .forEach((file) => {
      const model = require(path.join(__dirname, file)); //commonjs는 require가 dynammic import 가능
      console.log(file, model.name); //확인해보기 (model.name = [클래스 이름])
      db[model.name] = model;
      model.initiate(sequelize);
  });
Object.keys(db).forEach(modelName => { //associate 호출 (modelName을 어떻게 불러왔는지 모르겠음)
  // 주의사항: initiate 먼저 다 끝마치고 associate 해야 함
  console.log(db, modelName);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
})
//db.User = User;
//db.Post = Post;
//db.Hashtag = Hashtag;

//한 번씩 호출이 필요(initiate, associate)
// models 폴더에 있으면 알아서 호출해주는 자동화 공부 예정 
/*
User.initiate(sequelize);
Post.initiate(sequelize);
Hashtag.initiate(sequelize);
User.associate(db);
Post.associate(db);
Hashtag.associate(db);
*/
//객체 한 번만 import하면 재사용 가능
module.exports = db;