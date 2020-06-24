const request = require('supertest') // test the http request by using this package
const app = require('../src/app')
const User = require('../Mongodb/database/models/user-schema')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

                //--------------------------important note------------------//

// we have to to be careful while using user and task testing api.. during testing only on api file can be test 
// at a time other wise it will show duplicate key error while both (setupdatabase) are enable in the files
// so we have to disable one file during testing to change its name at the moment.for example:- (user.tes.js) or (task.tes.js).

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/task-manager-api-v1/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: '1234567890',
        age: 23
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew',
            email: 'andrew@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass777!')
})

// for login a user and then check the authenticate token of this existing user and then verify to first token  
test('Should login existing user', async () => {
    const response = await request(app)
    .post('/task-manager-api-v1/users/login')
    .send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/task-manager-api-v1/users/myProfile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/task-manager-api-v1/users/myProfile')
        .send()
        .expect(401)
})


test('Should delete account for user', async () => {
    await request(app)
        .delete('/task-manager-api-v1/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user', async () => {
    await request(app)
        .delete('/task-manager-api-v1/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/task-manager-api-v1/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/task-manager-api-v1/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})


test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/task-manager-api-v1/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Philadelphia'
        })
        .expect(400)
})
