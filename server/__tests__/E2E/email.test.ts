import 'jest';
import supertest from 'supertest';
import express from '../../src/server';
import { initDatabase } from '../../src/db/database';


afterAll((done) => {
	express.server.close(done);
	
	console.log('server is closed');
});


describe('email Controller tests', () => {
	
	it('should send succesfully an email', async () => {
		try {
			await initDatabase();
			const response = await supertest(express.app)
			.post(`/api/email`)
            .send({
                subject : "objet for test",
                message : "ceci est un message de test.",
                senderId : "5"
            })
			.expect(200);
		  } catch (error) {
			throw error; 
		  }
	});
});