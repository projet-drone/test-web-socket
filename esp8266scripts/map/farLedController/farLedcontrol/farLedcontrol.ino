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
#define USE_SERIAL Serial1
#define LED_COUNT 60

#define PATAPON "HUAWEI-B315-E91A"
#define PATAPON_PASS "WifiDuChef01"
#define PATAPON_SERVER_IP "192.168.8.105"

#define HOME "Livebox-FA80"
#define HOME_PASS "7gxgMFqdtRzoQZ3gFy"
#define HOME_SERVER_IP "192.168.1.10"

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

int inPin = 13;   
int val = 0;
uint32_t testColor = strip.Color(0,0,0);
int timer = 0;

void colorStripRed(const char * payload, size_t length) {
  Serial.println("event received");
  testColor = strip.Color(255,10,0);
  webSocket.emit("hello","\"this is a putain de reponse ws\"");
  //rainbow(10);
}
void colorStripBlue(const char * payload, size_t length) {
  Serial.println("event received");
  testColor = strip.Color(0,130,255);
  webSocket.emit("hello","\"this is a putain de reponse ws\"");
  //rainbow(10);
}
void colorStripPurple(const char * payload, size_t length) {
  Serial.println("event received");
  testColor = strip.Color(105,10,180);
  webSocket.emit("hello","\"this is a putain de reponse ws\"");
  //rainbow(10);
}

void lightUp(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  webSocket.emit("hello","\"je suis allumé CONNARD\"");
   colorWipe(testColor, 5);
  val = 1;
  //rainbow(10);
}
void turnOff(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  webSocket.emit("hello","\"c'est bon j'arrete\"");
  turnStripOff(); 
  val = 0;
  //rainbow(10);
}
void identify(const char * payload, size_t length) {
  Serial.println("refreshing \n");
  webSocket.emit("coucouTkiRep","\"exterieur\"");
  val = 0;
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
    webSocket.on("westinghouseCompleted", colorStripPurple);
    webSocket.on("teslaCompleted", colorStripBlue);
    webSocket.on("lightUp", lightUp);
    webSocket.on("turnOff", turnOff);
    webSocket.on("coucouTki", identify);
    
    webSocket.begin(PATAPON_SERVER_IP,3000);
    webSocket.emit("hello","\"je suis l'exterieur de la map o/\"");
    #if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
    #endif
      // END of Trinket-specific code.
    
      strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
      strip.show();            // Turn OFF all pixels ASAP
      strip.setBrightness(200); // Set BRIGHTNESS to about 1/5 (max = 255)
}

    // use HTTP Basic Authorization this is optional remove if not needed
    //webSocket.setAuthorization("username", "password");

void loop() {
    webSocket.loop();
     // read input value
     int newVal = val;
    if (newVal == 1) {         // check if the input is HIGH (button released)
      colorWipe(testColor, 5); // Blue
    } 
    if (timer == 500){
      stats("test");
      timer = 0;
    }
    timer ++;
    

}

void turnStripOff(){
  for(int i=0; i<strip.numPixels(); i++){
    strip.setPixelColor(i, strip.Color(0, 0, 0));
     
  }
   strip.show();
}


void colorWipe(uint32_t color, int wait) {
  for(int i=0; i<strip.numPixels(); i++) { // For each pixel in strip...
    strip.setPixelColor(i, color);         //  Set pixel's color (in RAM)
    strip.show();                          //  Update strip to match
    delay(wait);                           //  Pause for a moment
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
