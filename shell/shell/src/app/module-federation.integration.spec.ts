describe('Module Federation Integration - Products Remote', () => {

  it('should successfully load the Products remoteEntry.js file', async () => {
    const response = await fetch('http://localhost:4201/remoteEntry.js');

    expect(response).toBeTruthy();
    expect(response.status).toBe(200);

    const content = await response.text();
    expect(content).toContain('webpack');
  });

});
