const http = require('http');
const fs = require('fs');
let light1Level = null;
let proximity = null;
let temperature = null;

let lightActive = false;
let ACActive = false;

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


function regulateLightLevel()
{
	if (light1Level != null && light1Level < 30)
		lightActive = true;
	else
		lightActive = false;
}

function updateData(dataToUpdate,valueToUpdate)
{
	if (dataToUpdate == "light1")
	{
		light1Level = valueToUpdate;
		regulateLightLevel();
	}
	else if (dataToUpdate =="proximity")
		proximity = valueToUpdate;
	else if (dataToUpdate == "temperature")
		temperature = valueToUpdate;
}

function updateAllData(allData)
{
	allData.map((val) => updateData(val[0],val[1]))
}

function sendBackData(dataToRetrieve,res)
{
	if (dataToRetrieve[0][1] == "light1")
		res.end(light1Level);
	else if (dataToRetrieve[0][1] == "proximity")
		res.end(proximity);
	else if (dataToRetrieve[0][1] == "temperature")
		res.end(temperature);
	else if (dataToRetrieve[0][1] == "AC")
		res.end(ACActive.toString());
	else if (dataToRetrieve[0][1] == "light")
		res.end(lightActive.toString());
}




function serveResources(endpoint,res)
{
	fs.exists(__dirname + "/" + endpoint, (exists) => {
		if (exists) {
			const readStream = fs.createReadStream(__dirname + "/" + endpoint, "utf-8");
			readStream.pipe(res);
			readStream.on('end', () => {
				readStream.close();
				res.end()
			});
		}
		else {
			res.end();
		}
	})
}

function main(req,res)
{
	res.setHeader("access-control-allow-origin","*");
	const endpoint = getEndpoint(req.url);
	const data = getParameter(req.url,endpoint);
	if (endpoint == "data")
	{
		updateAllData(data);
		res.end("");
	}
	else if (endpoint == "retrieveData")
		sendBackData(data,res);
	else 
		serveResources(endpoint,res);
}



const server = http.createServer(main);
server.listen(8080);
