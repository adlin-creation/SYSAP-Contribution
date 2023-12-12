import 'jest';
import supertest from 'supertest';
import express from '../../src/server';
import { initDatabase } from '../../src/db/database';


afterAll((done) => {
	//closeConnection();
	express.server.close(done);
	
	console.log('server is closed');
});

describe('program Enrollment Controller tests', () => {
	
	it('should get a program enrollement by patient id', async () => {
		try {
			await initDatabase();
			const response = await supertest(express.app)
			.get(`/api/programEnrollment/user/3`)
			.expect(200);
		  } catch (error) {
			throw error; 
		  }
	});

	it('should fail getting a program enrollement by patient id', async () => {

		try {
			await supertest(express.app)
			.get(`/api/programEnrollment/user/0`)
			.expect(404);
			
		  } catch (error) {
			throw error; 
		  }

	});

	it('should set today as start date', async () => {

		try {
			await supertest(express.app)
			.put(`/api/programEnrollment/user/startDate`)
            .send(
                {
                    userId :'3'
                }
            )
			.expect(200);
			
		  } catch (error) {
			throw error; 
		  }

	});

});


