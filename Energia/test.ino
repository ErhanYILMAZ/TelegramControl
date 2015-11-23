/*****************************************************
 * Designer: Erhan YILMAZ		             		 *
 * Application: Energia test application             *
 * Date: 23-11-2015				     				 *
 * Version: 1.0					     				 *					
 * Description:	Energia test code for Telegram       *
 * control application,codes are runing on MSP430    *
 * Launchpad(MSP430G2553)                            *		
 * **************************************************/


void setup() {
  // initialization
  Serial.begin(9600);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(PUSH2, INPUT_PULLUP);  
  digitalWrite(RED_LED, LOW);
  digitalWrite(GREEN_LED, LOW);
}

void loop() {
  if (Serial.available()) 
  {
    int inByte = Serial.read();
    switch(inByte)
    {
      case '1':
        digitalWrite(GREEN_LED, HIGH);
        Serial.print("Green LED On");
      break;
    
      case '2':
        digitalWrite(GREEN_LED, LOW);
        Serial.print("Green LED Off");
      break;
    
      case '3':
        digitalWrite(RED_LED, HIGH);
        Serial.print("Red LED On");
      break;
    
      case '4':
        digitalWrite(RED_LED, LOW);
        Serial.print("Red LED Off");
      break;
    
      case '5':
        if(digitalRead(PUSH2)==HIGH)
        {
          Serial.print("Button Not Pressed");
        }
        else
        {
          Serial.print("Button Pressed");
        }
      break;
    
      default:
        Serial.println("Undefined Command");
        Serial.println("Available Commands");
        Serial.println("Ledgreenon");
        Serial.println("Ledgreenoff");
        Serial.println("Ledredon");
        Serial.println("Ledredoff");
        Serial.print("Button");
      break;
    }
  }
}
