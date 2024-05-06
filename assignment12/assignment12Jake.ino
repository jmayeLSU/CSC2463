#define VRX_PIN A0
#define VRY_PIN A1
#define SW_PIN 2
#define GREEN_LED_PIN 4
#define RED_LED_PIN 7
int joyX = 0, joyY = 0, sw = 0;

const int nelements = 10;
int readingsX[nelements];  // the readings from the analog input
int indexX = 0;          // the index of the current reading
int totalX = 0;              // the running total
int averageX = 0;            // the average

int readingsY[nelements];  // the readings from the analog input
int indexY = 0;          // the index of the current reading
int totalY = 0;              // the running total
int averageY = 0;            // the average

int time;
int interval;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(SW_PIN, INPUT_PULLUP);

  time = millis();

  for (int i = 0; i < nelements; i++) {
    readingsX[i] = 0;
    readingsY[i] = 0;
  }
}

void loop() {
  int power;
  while(Serial.available() > 0){
    power = Serial.parseInt();
    if (Serial.read() == '\n'){
      if(power==1)
      digitalWrite(GREEN_LED_PIN,HIGH);
      else if(power==2)
      digitalWrite(RED_LED_PIN,HIGH);
      else if(power==0){
      digitalWrite(GREEN_LED_PIN,LOW);
      digitalWrite(RED_LED_PIN,LOW);
      }
    }

  }

  totalX = totalX - readingsX[indexX];
  readingsX[indexX] = 1023-analogRead(VRX_PIN);
  totalX = totalX + readingsX[indexX];
  indexX++;
  if(indexX >= nelements){
    indexX = 0;
  }
  averageX = totalX/nelements;

  totalY = totalY - readingsY[indexY];
  readingsY[indexY] = analogRead(VRY_PIN);
  totalY = totalY + readingsY[indexY];
  indexY++;
  if(indexY >= nelements){
    indexY = 0;
  }
  averageY = totalY/nelements;

  int sw = 1 - digitalRead(SW_PIN);
 
  interval = millis();
  if(interval > time + 20){
    time = interval;
    Serial.print(averageX);
    Serial.print(" ");
    Serial.print(averageY);
    Serial.print(" ");
    Serial.println(sw);
  }

}
