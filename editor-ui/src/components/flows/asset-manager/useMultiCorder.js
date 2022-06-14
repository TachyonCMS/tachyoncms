import { ref } from "vue";

/**
 * SHARED
 * The following are defined outside of the function because they only need to be set once.
 */

// List of available cameras
const cameras = ref([]);

// Has the list of available cameras been loaded?
const camerasLoaded = ref(false);

// Is HTML5 screeenshare/capture supported?
const screenshareSupported = ref(false);

/**
 * EXPORTED FUNCTION
 */

export default function useFlows() {
  /**
   * REACTIVE PROPERTIES
   */

  // Types of video supported [camera,screen]
  const videoTypes = ref(["camera", "screen"]);

  // The current snapshot image
  const snapshot = ref(null);

  // The currently select videoSource
  const videoSource = ref(null);

  // The list of available videoSources, cameras and screenshare
  const videoSourceList = ref([]);

  /**
   * FUNCTIONS
   */

  // Set desired video types support and do any init required
  const initVideoOptions = (reqVideoTypes = ["camera", "screen"]) => {
    console.log("initVideoOptions");
    if (reqVideoTypes.includes("screen")) {
      initScreen();
    }
    if (reqVideoTypes.includes("camera")) {
      initCameras();
      camerasLoaded.value = true;
    }
  };

  // Initialize screenshare
  const initScreen = () => {
    console.log("initScreen");
    // @todo Add check for browsers that don't support screenshare.
    screenshareSupported.value = true;
  };

  // Init cameras, get list of available cameras
  const initCameras = () => {
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = legacyGetUserMediaSupport();
    }

    testVideoAccess();
  };

  // Make sure the device supports Video and Audio
  // @todo fix resolution check
  const testVideoAccess = () => {
    console.log("testVideoAcess");
    let constraints = { video: true, audio: { echoCancellation: true } };
    /*
      if (this.resolution) {
        constraints.video = {};
        constraints.video.height = this.resolution.height;
        constraints.video.width = this.resolution.width;
      }
      */
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        let tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        loadCameras();
      })
      .catch((error) => this.$emit("error", error));
  };

  // Handle older browsers
  // @todo deprecate
  const legacyGetUserMediaSupport = () => {
    return (constraints) => {
      let getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        navigator.oGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  };

  // Load the available cameras into a ref list
  const loadCameras = () => {
    console.log("loadCameras");
    navigator.mediaDevices
      .enumerateDevices()
      .then((deviceInfos) => {
        for (let i = 0; i !== deviceInfos.length; ++i) {
          let deviceInfo = deviceInfos[i];
          if (deviceInfo.kind === "videoinput") {
            // store only the data we need
            cameras.value.push({
              text: deviceInfo.label,
              value: deviceInfo.deviceId,
            });
          }
        }
      })
      .then(() => {
        if (!camerasLoaded.value) {
          camerasLoaded.value = true;
        }
      })
      .catch((error) => ("error", error));
  };

  /**
   * RETURN
   * Allow access to these outside of `setup`
   */

  return {
    // Allow initializing devices
    initVideoOptions,
    // Provide list access to cameras (global)
    cameras,
    // The list of available video sources (global)
    videoSourceList,
    // The current captured image
    snapshot,
    // The selected video source for this instance
    videoSource,
  };
}
