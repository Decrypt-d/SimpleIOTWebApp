const http = require('http');
let light1Level = null;

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
	return data;
}


function updateData(dataToUpdate,valueToUpdate)
{
	if (dataToUpdate == "light1")
		light1Level = valueToUpdate;
}

function updateAllData(allData)
{
	allData.map((val) => updateData(val[0],val[1]))
}

function sendBackData(dataToRetrieve,res)
{
	console.log(dataToRetrieve);
	if (dataToRetrieve[0][1] == "light1")
		res.end(light1Level);
}

function main(req,res)
{
	const endpoint = getEndpoint(req.url);
	const data = getParameter(req.url,endpoint);
	if (endpoint == "data")
		updateAllData(data);
	else if (endpoint == "retrieveData")
		sendBackData(data,res);
	res.end("");
}



const server = http.createServer(main);
server.listen(8080);
