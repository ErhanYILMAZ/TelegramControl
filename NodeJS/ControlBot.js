/****************************************************************
 * Designer: Erhan YILMAZ										*
 * Application: Control application with Telegram bot api		*
 * Date: 23-11-2015												*
 * Version: 1.0													*
 * Description:	This is NodeJS application to get/send			*
 * message over the telegram users by telegram bots and			*
 * according to message, application send/receive command		*
 * over serialport to the device that connected to serial port	*
 * *************************************************************/

// Telegram Bot API module
// https://www.npmjs.com/package/telegram-bot-api
var telegram = require('telegram-bot-api');
var api = new telegram({
	token: '158611125:AAG0vIH8F9xk36FF-fHdC2ivqL0YCpfqVaw',
	updates: {
		enabled: true,
		get_interval: 1000
	}
});
/////////////////////////////////////////////////////////

// Serial Port Module
// https://www.npmjs.com/package/serialport
var com = require("serialport");
var serialPort = new com.SerialPort(process.argv[2], {
    baudrate: 9600
	//,parser: com.parsers.readline('\r\n')
  });
/////////////////////////////////////////////////////////

// Global variables used in program
var portOpened=false;
var chatId;
var chatName;

// Open specified serial port on your system
serialPort.on('open',function(err) {
	if(err)
	{
		portOpened=false;
		console.log("Error:"+err);
	}
	else
	{
		console.log(process.argv[2]+ ' Port opened');
		portOpened=true;
	}
  
});

// Serial port data receive event 
// This function sends the message to bot that received over serial port
serialPort.on('data', function(data) {
  if(chatId)
  {
	api.sendMessage({
		chat_id: chatId,
		text: chatName+" "+data
	}, function(err, message)
	{
		if(err)console.log(err);
		//console.log(message);		// More info about message packet
		console.log(chatName+" "+data);
	});
  }
  else
	  console.log("Error:Recipient ID not defined");
});
  
// When someone send message to bot this event runs to get message.
api.on('message', function(message)
{
	chatId = message.chat.id;			// To reply we need sender id
	chatName = message.chat.first_name;	// Sender first name
	var command="";
	var txt="";
	
	// It'd be good to check received message type here
	// And react accordingly
	// We consider that only text messages can be received here
	
	message.text = message.text.toLowerCase();	// Firs convert message to lower case.
//	Check the message to get command
	if(message.text.indexOf("ledgreenon")>-1)
	{
		command="1";
		txt="Green LED On";
	}	
	else if(message.text.indexOf("ledgreenoff")>-1)
	{
		command="2";
		txt="Green LED Off";
	}
	else if(message.text.indexOf("ledredon")>-1)
	{
		command="3";
		txt="Red LED On";
	}
	else if(message.text.indexOf("ledredoff")>-1)
	{
		command="4";
		txt="Red LED Off";
	}
	else if(message.text.indexOf("button")>-1)
	{
		command="5";
		txt="Read Button State";
	}
	else	// Unknown message
	{
		command ="0";
		txt="Unknown";
	}
//////////////////////////////////////////////////

// If serial port open send command to the device(MSP430 Launchpad) that waitin for command
	if(portOpened)
	{
		serialPort.write(command, function(err) {
			if(err)
			{
				console.log("Error:"+err);
			}	
		});
		console.log("Command:"+txt);
	}
	else
	{
		console.log("SerialPort Unreachable");
	}
});
