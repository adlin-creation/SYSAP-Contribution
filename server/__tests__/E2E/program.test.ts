import 'jest';
import supertest from 'supertest';
import express from '../../src/server';
import { initDatabase } from '../../src/db/database';


afterAll((done) => {
	express.server.close(done);
	
	console.log('server is closed');
});


describe('program Controller tests', () => {
	
	it('should get succesfully all prgrams', async () => {
		try {
			await initDatabase();
			const response = await supertest(express.app)
			.get(`/api/programs`)
			.expect(200);
		  } catch (error) {
			throw error; 
		  }
	});

	it('should fail getting a program by program name', async () => {

		try {
			await supertest(express.app)
			.get(`/:programName/3`)
			.expect(404);
			
		  } catch (error) {
			throw error; 
		  }

	});

	it('should get a program by program name', async () => {

		try {
			await supertest(express.app)
			.get(`/api/programs/Bravo`)
			.expect(200);
			
		  } catch (error) {
			throw error; 
		  }

	});

});

