exports.handler = async (event) => {
    const path = event.path || event.rawPath;
    
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    };
    
    if (path === '/api/test') {
        response.body = JSON.stringify({
            message: 'RBTC Nigeria API is working!',
            timestamp: new Date().toISOString()
        });
    } else if (path === '/health') {
        response.body = JSON.stringify({ status: 'OK' });
    } else {
        response.statusCode = 404;
        response.body = JSON.stringify({ error: 'Not found' });
    }
    
    return response;
};