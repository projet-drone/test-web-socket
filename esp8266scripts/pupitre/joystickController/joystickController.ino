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

#include <ArduinoJson.h>

#include <SocketIoClient.h>

#include <Hash.h>

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;
#define USE_SERIAL Serial1
#define PATAPON "HUAWEI-B315-E91A"
#define PATAPON_PASS "WifiDuChef01"
#define PATAPON_SERVER_IP "192.168.8.106"

#define HOME "Livebox-FA80"
#define HOME_PASS "7gxgMFqdtRzoQZ3gFy"
#define HOME_SERVER_IP "192.168.1.10"



int inPin = 14;
int inPin2 = 12;
int inPin3 = 13;     
int val = 0;
int val2 = 0;
int val3 = 0;

int timer = 0;


void refresh(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  
  //rainbow(10);
}

void identify(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  webSocket.emit("HandShakeAnswered","\"Pupitre:installation\"");
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

   
    webSocket.on("startHandShake",identify);
    
    webSocket.begin(PATAPON_SERVER_IP,3000);
    
    #if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
    #endif
      // END of Trinket-specific code.
    
}

    // use HTTP Basic Authorization this is optional remove if not needed
    //webSocket.setAuthorization("username", "password");

void loop() {
    webSocket.loop();
    int newVal = digitalRead(inPin);
    int newVal2 = digitalRead(inPin2);
    int newVal3 = digitalRead(inPin3);// read input value
    if (newVal != val) { 
      if(newVal == HIGH){
         webSocket.emit("spheroLifted","\"Edison\""); // Blue
         USE_SERIAL.printf("EDISON lifted");
      }else{
         webSocket.emit("spheroDropped","\"Edison\"");
      }
      //webSocket.emit("hello","\"btn 1 puhed\""); // Blue
    }
    if (newVal2 != val2) {         // check if the input is HIGH (button released)
      if(newVal == HIGH){
         webSocket.emit("spheroLifted","\"Westinghouse\""); // Blue
      }else{
         webSocket.emit("spheroDropped","\"Westinghouse\"");
      }
    }
    if (newVal3 != val3) {         // check if the input is HIGH (button released)
       if(newVal == HIGH){
         webSocket.emit("spheroLifted","\"Tesla\""); // Blue
      }else{
         webSocket.emit("spheroDropped","\"Tesla\"");
      }
    }
    
  val = newVal;
  val2 = newVal2;
  val3 = newVal3;

  USE_SERIAL.printf("%d",val);

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
