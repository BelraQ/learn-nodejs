jest.mock('../models/user');
const User = require('../models/user');
const follow = require('./user');

describe('follow', () => {
    test('사용자를 찾아 팔로잉을 추가하고 ok를 반환함', async () => {
        User.findOne.mockReturnValue({
            addFollowing(id) {
                Promise.resolve(true);
            }
        });
        const result = await follow(1, 2);
        expect(result).toEqual('ok');
    });
    
    test('사용자를 못 찾으면 no user를 반환함', async () => {
        User.findOne.mockReturnValue(null);
        const result = await follow(1, 2);
        expect(result).toEqual('no user');
    });

    test('DB에서 에러가 발생하면 throw', async () => {
        const message = 'DB 에러';
        User.findOne.mockReturnValue(Promise.reject(message));
        try {
            await follow(1, 2);
        } catch (error) {
            expect(error).toEqual(message);
        }
    });
})






//서비스 분리 이전의 controllers/usr.test.js ..follow

// jest.mock('../models/user'); //user.js의 User를 mocking함
// const User = require('../models/user');
// const { follow } = require('../controllers/user');


// describe('follow', () => {
//     const req = {
//         user: {id: 1},
//         params: {id: 2},
//     };
//     const res = {
//         status: jest.fn(() => res),
//         send: jest.fn(),
//     };
//     const next = jest.fn();
//     test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
//         User.findOne.mockReturnValue({
//             addFollowing(id) {
//                 return Promise.resolve(true);
//             }
//         }); //findOne mocking, findOne의 addFollowing mocking.
//         await follow(req, res, next);
//         expect(res.send).toBeCalledWith('success');
//     });
//     test('사용자를 못 찾으면 res.status(404).send(no user)를 호출함', async () => {
//         User.findOne.mockReturnValue(null);
//         await follow(req, res, next);
//         expect(res.status).toBeCalledWith(404);
//         expect(res.send).toBeCalledWith('no user');
//     });
//     test('DB에서 에러가 발생하면 next(error)를 호출함', async () => {
//         const message = "DB 에러";
//         User.findOne.mockReturnValue(Promise.reject(message));
//         await follow(req, res, next);
//         expect(next).toBeCalledWith(message);
//     });
// })