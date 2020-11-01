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
#define LED_PIN 14
#define LED_PIN2 12
#define USE_SERIAL Serial1
#define LED_COUNT 60

#define PATAPON "patapatapon"
#define PATAPON_PASS "oreooreo123"
#define PATAPON_SERVER_IP "192.168.43.81"

#define HOME "Livebox-FA80"
#define HOME_PASS "7gxgMFqdtRzoQZ3gFy"
#define HOME_SERVER_IP "192.168.1.10"

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel strip2(LED_COUNT, LED_PIN2, NEO_GRB + NEO_KHZ800);

int inPin = 13;   
int val = HIGH;
uint32_t testColor = strip.Color(100,20,200);
int timer = 0;
bool canShowSecondLedStrip = false;


void colorStripRed(const char * payload, size_t length) {
 canShowSecondLedStrip = false;
  Serial.println("event received");
  testColor = strip.Color(255,10,0);
  colorWipe(testColor, 5);
  webSocket.emit("hello","\"this is a putain de reponse ws\"");
  //rainbow(10);
}
void colorStripBlue(const char * payload, size_t length) {
  canShowSecondLedStrip = true;
  Serial.println("event received");
  testColor = strip.Color(0,130,255);
  colorWipe(testColor, 5);
  webSocket.emit("hello","\"this is a putain de reponse ws\"");
  //rainbow(10);
}
void colorStripPurple(const char * payload, size_t length) {
  Serial.println("event received");
  canShowSecondLedStrip = true;
  testColor = strip.Color(105,10,180);
  colorWipe(testColor, 5);
  webSocket.emit("hello","\"this is a putain de reponse ws\"");
  //rainbow(10);
}
void identify(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  webSocket.emit("HandShakeAnswered","\"PortraitLed:lighting\"");
  turnStripOff();
  
  //rainbow(10);
}
void refresh(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  
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

    webSocket.on("edisonCompleted", colorStripRed);
    webSocket.on("teslaCompleted", colorStripBlue);
    webSocket.on("westinghouseCompleted", colorStripPurple);
    webSocket.on("startHandShake", identify);
    
    webSocket.begin(PATAPON_SERVER_IP,3000);
    webSocket.emit("hello","\"je suis le centre de la map o/\"");
    #if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
    #endif
      // END of Trinket-specific code.
    
      strip.begin();
      strip2.begin();// INITIALIZE NeoPixel strip object (REQUIRED)
      strip.show();
      strip2.show();// Turn OFF all pixels ASAP
      strip.setBrightness(200); 
      strip2.setBrightness(200); // Set BRIGHTNESS to about 1/5 (max = 255)
}

    // use HTTP Basic Authorization this is optional remove if not needed
    //webSocket.setAuthorization("username", "password");

void loop() {
    webSocket.loop();
    
    
    if (timer == 500){
      stats("test");
      webSocket.emit("hello","\"this is a reponse ws\"");
      timer = 0;
    }
    timer ++;
    

}

void turnStripOff(){
  for(int i=0; i<strip.numPixels(); i++){
    strip.setPixelColor(i, strip.Color(0, 0, 0));
    strip.show();
  }
  for(int i=0; i<strip2.numPixels(); i++){
    strip2.setPixelColor(i, strip.Color(0, 0, 0));
    strip2.show();
  }
  
   
}


void colorWipe(uint32_t color, int wait) {
  for(int i=0; i<strip.numPixels(); i++) { // For each pixel in strip...
    strip.setPixelColor(i, color);         //  Set pixel's color (in RAM)
    strip.show();                          //  Update strip to match
    delay(wait);                           //  Pause for a moment
  }
  if(canShowSecondLedStrip){
    for(int i=0; i<strip2.numPixels(); i++) { // For each pixel in strip...
    strip2.setPixelColor(i, color);         //  Set pixel's color (in RAM)
    strip2.show();                          //  Update strip to match
    delay(wait);  
  }
                             //  Pause for a moment
  
  }
  
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
