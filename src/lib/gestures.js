import { GestureDescription, Finger, FingerCurl } from "fingerpose";

const FistGesture = new GestureDescription("fist");
// Thumb
FistGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
FistGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// Index finger
FistGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.9);

// Middle finger
FistGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.9);

// Ring finger
FistGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// Pinky finger
FistGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

const OpenGesture = new GestureDescription("open");
// Thumb

for(const finger of Finger.all) {
  OpenGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}


export { FistGesture, OpenGesture };
