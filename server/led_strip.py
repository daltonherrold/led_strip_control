import time
from rpi_ws281x import *

class LedStrip():
    

    def __init__(self, gpio_pin, num_leds, brightness):
        self.strip = Adafruit_NeoPixel(num_leds, gpio_pin, 800000, 10, False, brightness, 0)
        self.strip.begin()
        self.kill = False
    

    def kill_thread(self):
        self.kill = True


    ##################################################################################################
    ########################################### Effects ###########################################
    ##################################################################################################


    def staticColor(self, red, green, blue, brightness=1, animation='instant', animation_speed=10, **kwargs):
        self.kill = False
        fn = getattr(self, animation, None)
        fn(LedStrip.adjustBrightness(red, green, blue, brightness), **{'wait_ms': animation_speed})


    def rainbowCycle(self, reverse=False, speed=20, **kwargs):
        self.kill = False
        j = 0
        num_pixels = self.strip.numPixels()
        while True:
            j += 1
            for i in range(num_pixels):
                if not reverse:
                    self.strip.setPixelColor(i, LedStrip.wheel((int(i * 256 / num_pixels) + j) & 255))
                else:
                    self.strip.setPixelColor(i, LedStrip.wheel((int(i * 256 / num_pixels) - j) & 255))
            self.strip.show()
            if self.kill:
                break
            time.sleep(speed/1000.0)


    def rainbowBreathing(self, speed=50, animation='instant', animation_speed=10, step=1, reverse=False, **kwargs):
        self.kill = False
        j = 0
        fn = getattr(self, animation, None)
        while True:
            j += step if not reverse else -step
            fn(LedStrip.wheel(j % 256), **{'wait_ms': animation_speed})
            if self.kill:
                break
            time.sleep(speed/1000.0)


    ##################################################################################################
    ########################################### Animations ###########################################
    ##################################################################################################
    

    def instant(self, color, **kwargs):
        for i in range(self.strip.numPixels()):
            self.strip.setPixelColor(i, color)
        self.strip.show()
    
    def colorWipe(self, color, wait_ms=1, **kwargs):
        for i in range(self.strip.numPixels()):
            self.strip.setPixelColor(i, color)
            self.strip.show()
            if self.kill:
                break
            time.sleep(wait_ms/1000.0)

    def colorWipeTwoSided(self, color, wait_ms=1, **kwargs):
        num_pixles = self.strip.numPixels()
        for i in range(num_pixles//2 + 1):
            self.strip.setPixelColor(i, color)
            self.strip.setPixelColor(num_pixles-i, color)
            self.strip.show()
            if self.kill:
                break
            time.sleep(wait_ms/1000.0)


    ##################################################################################################
    ######################################## Helper Functions ########################################
    ##################################################################################################


    def clear(self):
        for i in range(self.strip.numPixels()):
            self.strip.setPixelColor(i, Color(0,0,0))
        self.strip.show()


    def adjustBrightness(red, green, blue, brightness):
        return Color(int(red*brightness), int(green*brightness), int(blue*brightness))


    def wheel(pos):
        if pos < 85:
            return Color(pos * 3, 255 - pos * 3, 0)
        elif pos < 170:
            pos -= 85
            return Color(255 - pos * 3, 0, pos * 3)
        else:
            pos -= 170
            return Color(0, pos * 3, 255 - pos * 3)
