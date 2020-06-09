import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as mocks from './mocks';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  jest.setTimeout(30000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    mocks.mocksArr.forEach((myMock) => { 
    request(app.getHttpServer())
    .post('/sessions')
    .send( { sessionId: myMock.sessionId,
            userIp: myMock.userIp,
            visitDate: myMock.visitDate,
            device: myMock.device,
            browser: myMock.browser,
            location: myMock.location,
            reffer: myMock.reffer })
          .then(() => {return null})
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('App is working');
  });

  it('Post valid data', () => {
    return request(app.getHttpServer())
    .post('/sessions')
    .send({
      sessionId: '_session11',
      userIp: '11.11.123',
      visitDate: '12/12/12',
      device: 'desktop',
      browser: 'firefox',
      location: 'China',
      reffer: 'facebook'
    })
    .expect(201)
    .expect('_session11')
  });

  it('Throws error if post data is empty', () => {
    return request(app.getHttpServer())
    .post('/sessions')
    .send({ })
    .expect(400)
  });

  it('/ GET Sessions', () => {
    return request(app.getHttpServer())
    .get('/sessions')
    .expect(200)
  });

  it('Get single session by id', () => {
    return request(app.getHttpServer())
    .get('/sessions/_session1')
    .expect(200)
  });

  it('Throws error when session id is inavild in get request', () => {
    return request(app.getHttpServer())
    .get('/sessions/_session12')
    .expect(404)
  });

  it('Updates user data by user id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/_session1')
    .send({ userId: mocks.mockedUserId })
    .expect(200)
  });

  it('Updates user data by user id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/_session2')
    .send({ userId: mocks.mockedUserId })
    .expect(200)
  });

  it('Updates user data by user id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/_session3')
    .send({ userId: mocks.mockedUserId })
    .expect(200)
  });

  it('Throws error when requested updated have invalid session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/_session12')
    .expect(404);
  });

  it('Get all sessions of user by id', () => {
    return request(app.getHttpServer())
    .get('/sessions/user/' + mocks.mockedUserId)
    .expect(200)
  });

  it('Throws error when user id is invalid in get by user id request', () => {
    return request(app.getHttpServer())
    .get('/user/invalidId')
    .expect(404)
  });

  it('Get full data of all users from database', () => {
    return request(app.getHttpServer())
    .get('/users')
    .expect(200)
  });

  it('Gets all data of single user by user id', () => {
    return request(app.getHttpServer())
    .get('/users/' + mocks.mockedUserId)
    .expect(200)
  });

  it('Throws error if get all data of single user have invalid user id', () => {
    return request(app.getHttpServer())
    .get('/users/invalidUserId')
    .expect(404)
  });

  it('Gets averange data of all users', () => {
    return request(app.getHttpServer())
    .get('/users/all/average')
    .expect(200)
  });

  it('Gets average data of single user by user Id', () => {
    return request(app.getHttpServer())
    .get('/users/average/' + mocks.mockedUserId)
    .expect(200)
  });

  it('Throws error if get average data of single user have invalid user id', () => {
    return request(app.getHttpServer())
    .get('/users/average/invalidUserId')
    .expect(404)
  });

  it('Insert new page with time on it, to requested session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/pages/_session1')
    .send({
      name: 'home',
      timeOn: 300
    })
    .expect(200)
  });

  it('Throws error if page is send to invalid session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/pages/_session12')
    .send({
      name: 'home',
      timeOn: 300
    })
    .expect(404)
  });

  it('Throws error if page is send with invalid data type', () => {
    return request(app.getHttpServer())
    .patch('/sessions/pages/_session1')
    .send({
      name: 'home',
      timeOn: '300'
    })
    .expect(400)
  });

  it('Throws error if time value is lower than zero', () => {
    return request(app.getHttpServer())
    .patch('/sessions/pages/_session1')
    .send({
      name: 'home',
      timeOn: -12
    })
    .expect(400)
  });

  it('Inserts item into user cart by session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/cartitems/_session1')
    .send({
      itemName: 'Tomato',
      itemAction: 'Add'
    })
    .expect(200)
  });

  it('Throws error if insert data to cart is requested to invalid session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/cartitems/_session12')
    .send({
      itemName: 'Tomato',
      itemAction: 'Add'
    })
    .expect(404)
  });

  it('Throws error if item is send with invalid data type', () => {
    return request(app.getHttpServer())
    .patch('/sessions/cartitems/_session1')
    .send({
      itemName: 'Tomato',
      itemAction: true
    })
    .expect(400)
  });

  it('Throws error if item action is not Add/Remove', () => {
    return request(app.getHttpServer())
    .patch('/sessions/cartitems/_session1')
    .send({
      itemName: 'Tomato',
      itemAction: 'Changed'
    })
    .expect(400)
  });

  it('Insert data into sessions buyed items array by session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/buyeditems/_session1')
    .send({
      itemName: 'Tomato',
      itemQuantity: 2
    })
    .expect(200)
  });

  it('Throws error if insert request got invalid session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/buyeditems/_session12')
    .send({
      itemName: 'Tomato',
      itemQuantity: 2
    })
    .expect(404)
  });

  it('Throw error if buyed item is send with invalid data type', () => {
    return request(app.getHttpServer())
    .patch('/sessions/buyeditems/_session1')
    .send({
      itemName: 'Tomato',
      itemQuantity: '2'
    })
    .expect(400)
  });

  it('Throws error if item quantity is lower than zero', () => {
    return request(app.getHttpServer())
    .patch('/sessions/buyeditems/_session1')
    .send({
      itemName: 'Tomato',
      itemQuantity: -1
    })
    .expect(400)
  });

  it('Changes logged status to true by session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/logged/_session1')
    .send({
      isLogged: true
    })
    .expect(200)
  });

  it('Throw error if logged change request have invalid sessionId', () => {
    return request(app.getHttpServer())
    .patch('/sessions/logged/_session12')
    .send({
      isLogged: true
    })
    .expect(404)
  });

  it('Throw error if logged status have incorrect format', () => {
    return request(app.getHttpServer())
    .patch('/sessions/logged/_session2')
    .send({
      isLogged: 'true'
    })
    .expect(400)
  })

  it('Changes contacted status to true by session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/contacted/_session1')
    .send({
      isContacted: true
    })
    .expect(200)
  });

  it('Throw error if contacted status change have invalid session id', () => {
    return request(app.getHttpServer())
    .patch('/sessions/contacted/_session12')
    .send({
      isContacted: true
    })
    .expect(404)
  });

  it('Throw error if change contacted status have invalid data', () => {
    return request(app.getHttpServer())
    .patch('/sessions/contacted/_session2')
    .send({
      isContacted: 'true'
    })
    .expect(400)
  });

  it('removes session by session id', () => {
    return request(app.getHttpServer())
    .delete('/sessions/_session11')
    .expect(200)
  });

  it('Throws error if remove request have invalid session id', () => {
    return request(app.getHttpServer())
    .delete('/sessions/_session12')
    .expect(404)
  });

  afterAll(async () => {
    mocks.mocksArr.forEach((someMock) => {
      request(app.getHttpServer())
      .delete('/sessions/' + someMock.sessionId)
      .end();
    });
    await app.close();
  });
});





