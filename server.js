const http = require('http');



function getEndpoint(url)
{
	if (url.indexOf("?") != -1)
		return url.substr(1,url.indexOf("?") - 1);
	return url.substr(1,url.length);
}

function getParameter(url,endpoint)
{
	url = url.substr(endpoint.length + 2,url.length);
	const params = url.split("&");
	const data = params.map((val) => val.split("="));
	console.log(data);
}

function main(req,res)
{
	const endpoint = getEndpoint(req.url);
	getParameter(req.url,endpoint);
	console.log(endpoint);
	res.end("");
}



const server = http.createServer(main);
server.listen(8080);
