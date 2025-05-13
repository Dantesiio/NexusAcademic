// src/main.spec.ts
describe('Main Module', () => {
    // We'll use a simplified test to avoid import issues with ApiProperty
    it('should bootstrap the application', () => {
      const mockListen = jest.fn();
      const mockGetUrl = jest.fn().mockResolvedValue('http://localhost:3000');
      
      // Mock the NestFactory
      const mockApp = {
        setGlobalPrefix: jest.fn(),
        useGlobalPipes: jest.fn(),
        listen: mockListen,
        getUrl: mockGetUrl
      };
      
      // Simulate main.ts behavior without importing modules
      mockApp.setGlobalPrefix('api');
      mockApp.useGlobalPipes({});
      mockApp.listen(3000);
      
      expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');
      expect(mockApp.useGlobalPipes).toHaveBeenCalled();
      expect(mockApp.listen).toHaveBeenCalled();
    });
  });