/*
 * WebSocketClientSocketIO.ino
 *
 *  Created on: 06.06.2016
 *
 */

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <Adafruit_NeoPixel.h>
#include <Stepper.h>
#include <ArduinoJson.h>

#include <SocketIoClient.h>

#include <Hash.h>

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;
#define LED_PIN 14
#define LED_PIN2 12
#define USE_SERIAL Serial1
#define LED_COUNT 60

#define PATAPON "HUAWEI-B315-E91A"
#define PATAPON_PASS "WifiDuChef01"
#define PATAPON_SERVER_IP "192.168.8.106"

#define HOME "Livebox-FA80"
#define HOME_PASS "7gxgMFqdtRzoQZ3gFy"
#define HOME_SERVER_IP "192.168.1.10"

int inPin = 4;   
int val = HIGH;
int timer = 0;
boolean canRotateMotors = true;
const int stepsPerRevolution = 2048;
Stepper myStepper = Stepper(stepsPerRevolution, 14, 13, 12, 15);

void identify(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  webSocket.emit("HandShakeAnswered","\"motor:map\"");
  
  //rainbow(10);
}

void activateNearMotors(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  canRotateMotors = true;
  
  //rainbow(10);
}
void disableMotors(const char * payload, size_t length) {
  canRotateMotors = false;
  Serial.println("refreshing \n");
  
  //rainbow(10);
}
void activateAllMotors(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  canRotateMotors = true;
  
  //rainbow(10);
}
void setup() {
    Serial.begin(115200);

    USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    pinMode(inPin, INPUT);

      for(uint8_t t = 4; t > 0; t--) {
          USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
          USE_SERIAL.flush();
          delay(1000);
      }
    WiFi.getMode();
    //WiFi.mode(WIFI_AP);
    WiFiMulti.addAP(PATAPON, PATAPON_PASS);

    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }

    webSocket.on("edisonCompleted", activateNearMotors);
    webSocket.on("westinghouseCompleted", disableMotors);
    webSocket.on("teslaCompleted", activateAllMotors);
    webSocket.on("startHandShake", identify);
    
    webSocket.begin(PATAPON_SERVER_IP,3000);
    webSocket.emit("hello","\"je suis le centre de la map o/\"");
    #if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
    #endif
      // END of Trinket-specific code.
      myStepper.setSpeed(16);
}

    // use HTTP Basic Authorization this is optional remove if not needed
    //webSocket.setAuthorization("username", "password");

void loop() {
    webSocket.loop();
    int newVal = digitalRead(inPin);
     // read input value
    if (newVal == LOW && canRotateMotors) {         // check if the input is HIGH (button released)
      myStepper.step(100);// Blue
    }
    if (timer == 500){
      stats("test");
      webSocket.emit("hello","\"this is a reponse ws\"");
      timer = 0;
    }
    timer ++;
    

}


void stats(const char* what) {
  // we could use getFreeHeap() getMaxFreeBlockSize() and getHeapFragmentation()
  // or all at once:
  uint32_t free;
  uint16_t max;
  uint8_t frag;
  ESP.getHeapStats(&free, &max, &frag);

  Serial.printf("free: %5d - max: %5d - frag: %3d%% <- ", free, max, frag);
  // %s requires a malloc that could fail, using println instead:
  Serial.println(what);
}
