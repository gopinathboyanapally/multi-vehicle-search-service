import { sampleOutput } from '../../sampleJsonOutput';
import { getLocations } from '../handlers/locationHandler.mjs';

describe('get the locations', () => {
    it('should send the 200 response with the correct output', async () => {
        const mockRequest = {
            body: [
                { "length": 10, "quantity": 1 },
                { "length": 20, "quantity": 2 },
                { "length": 25, "quantity": 1 }
            ]
        };
  
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await getLocations(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(sampleOutput);
    });

    it('should send the 400 response with the an error', async () => {
        const mockRequest = {
            body: []
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await getLocations(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: [
                {
                    "type": "field",
                    "value": [],
                    "msg": "Request body must be a non-empty array.",
                    "path": "",
                    "location": "body"
                }
            ]
        });
    });
    it('should return 400 for an invalid JSON input object array', async () => {
        const faultyJson = `[
          {
              "length": 10,
              "quantity": 1
          },
          {
              "length": 20,
              "quantity": 2
          },
          {
              "length": 25,
              "quantity": 1
        `;

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await getLocations(faultyJson, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
});
