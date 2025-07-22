// CloudFront Function para reescrever URLs
// Use este código no AWS Console > CloudFront > Functions

function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    console.log('Original URI:', uri);
    
    // Se a URI termina com /, adiciona index.html
    if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
        console.log('Rewritten URI (trailing slash):', request.uri);
    }
    // Se é uma pasta sem extensão, adiciona /index.html
    else if (!uri.includes('.') && !uri.endsWith('/')) {
        request.uri = uri + '/index.html';
        console.log('Rewritten URI (no extension):', request.uri);
    }
    
    return request;
}

// INSTRUÇÕES:
// 1. Vá no AWS Console > CloudFront > Functions
// 2. Create Function: "url-rewrite-function"
// 3. Cole este código
// 4. Publish
// 5. Vá na sua Distribution > Behaviors
// 6. Edit Default (*) behavior
// 7. Function associations > Viewer request > Associate this function
// 8. Save changes
// 9. Aguarde deploy (5-10 min)
