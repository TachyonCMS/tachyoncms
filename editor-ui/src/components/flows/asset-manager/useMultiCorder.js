import { ref, computed } from "vue";

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

  // Types of desired video support [camera,screen]
  const videoTypes = ref(null);

  // The current snapshot image
  const snapshot = ref(null);

  // The currently selected videoSource
  const videoSource = ref(null);

  // The friendly name for the videoSource
  const videoSourceName = ref(null);

  // Legacy video use @todo deprecate
  const source = ref(null);

  // The HTML <video> element for THIS multicorder

  /**
   * FUNCTIONS
   */

  // Set desired video types support and do any init required
  const initVideoOptions = (reqVideoTypes = ["camera", "screen"]) => {
    videoTypes.value = reqVideoTypes;
    console.log("initVideoOptions");
    if (videoTypes.value.includes("screen")) {
      initScreen();
    }
    if (videoTypes.value.includes("camera")) {
      initCameras();
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
      .catch((error) => console.error("error", error));
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
    if (!camerasLoaded.value) {
      console.log("loadCameras");
      console.log(cameras);
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
          camerasLoaded.value = true;
        })
        .catch((error) => ("error", error));
    }
    console.log(cameras.value);
  };

  // Handle switching the video source to the given one
  const changeVideoSource = (videoSource, videoElem) => {
    console.log(videoSource);
    console.log(videoElem);

    stopVideo(videoElem);

    if (videoSource) {
      if (videoSource == "screen") {
        startScreenshare(videoElem);
      } else {
        loadCamera(videoSource, videoElem);
      }
    }
  };

  // Get a video stream from a specific camera
  const loadCamera = (device, videoElem) => {
    let constraints = {
      video: {
        deviceId: {
          exact: device,
        },
      },
      audio: { echoCancellation: true },
    };

    // if (this.resolution) {
    //   constraints.video.height = this.resolution.height;
    //   constraints.video.width = this.resolution.width;
    // }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => loadSrcStream(stream, videoElem))
      .catch((e) => console.error(e));
  };

  // Start video from screenshare
  const startScreenshare = (videoElem) => {
    try {
      navigator.mediaDevices
        .getDisplayMedia()
        .then((stream) => loadSrcStream(stream, videoElem));
    } catch (e) {
      console.error(e);
    }
  };

  // Load a src stream into the HTML5 video element
  const loadSrcStream = (stream, videoElem) => {
    if ("srcObject" in videoElem) {
      // new browsers api
      videoElem.srcObject = stream;
    } else {
      // old broswers
      source.value = window.HTMLMediaElement.srcObject(stream);
    }
    // Emit video start/live event
    videoElem.onloadedmetadata = () => {
      //("video-live", stream);
      console.log("video streaming to " + videoElem);
    };
  };

  const stopVideo = (videoElem) => {
    if (videoElem.srcObject) {
      stopStreamedVideo(videoElem);
    }
  };

  const stopStreamedVideo = (videoElem) => {
    let stream = videoElem.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();

      videoElem.srcObject = null;
      source.value = null;
    });
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
    // The current captured image
    snapshot,
    // The selected video source for this instance
    videoSource,
    // Allow changing the videoSource
    changeVideoSource,
    // Permitting stopping video
    stopVideo,
    // Permit loading a single camera
    loadCamera,
    // Allow screen capture via HTML5 screen share
    startScreenshare,
  };
}
