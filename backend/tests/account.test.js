const testList = require("./account_test.js");
//const app = require('../app');
//const request = require('supertest');

test("should be 4", () => {
    expect(testList()).toBe(4);
});

/*
it('gets the test endpoint', async done => {
    const response = await request(app).get('/accountList')
    
    expect(response.status).toBe(200)
    expect(response.text).toBe("test message")
    done()
});*/