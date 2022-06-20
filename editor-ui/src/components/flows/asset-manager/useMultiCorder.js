import { ref, computed } from "vue";

// Allows us to store the resulting media
import useFlows from "../../../composables/useFlows";

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

const { storeNuggetMedia } = useFlows();

/**
 * EXPORTED FUNCTION
 */

export default function useMultiCorder() {
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

  // Microphone on|off
  const micOn = ref(false);

  // Video display on|off
  const videoLive = ref(false);

  // Recording from mic/video
  const recording = ref(false);

  // Array of recordings
  const recordings = ref([]);

  // Recording paused
  const paused = ref(false);

  // Speaker Muted
  const muted = ref(true);
  // The HTML <video> element for THIS multicorder

  // Recorder state idle|recording|paused|stopped|saving
  const recorderState = ref("idle");

  // The image format for snapshots
  const snapshotFormat = ref("image/png");

  const snapshotImgUrl = ref(null);

  const snapshotName = ref(null);

  const snapshotExt = ref("png");

  // The resolved video element
  const videoElem = ref(null);

  // The resolved canvas element
  const canvasElem = ref(null);

  // The resolved img element
  const imgElem = ref(null);

  // Physical camera resolution
  const cameraRes = ref({
    height: null,
    width: null,
  });

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
        width: { ideal: 1920 },
        height: { ideal: 1080 },
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

    let stream_settings = stream.getVideoTracks()[0].getSettings();

    // actual width & height of the camera video
    let stream_width = stream_settings.width;
    let stream_height = stream_settings.height;

    const camRes = {
      height: stream_height,
      width: stream_width,
    };

    console.log("Video Native Width: " + stream_width + "px");
    console.log("Video Native Height: " + stream_height + "px");

    cameraRes.value = camRes;

    // Emit video start/live event
    videoElem.onloadedmetadata = () => {
      //("video-live", stream);
      console.log("video streaming to " + videoElem);
    };
  };

  // Stop video in a player, it may be restarted.
  const stopVideo = () => {
    if (videoElem.value.srcObject) {
      let stream = videoElem.value.srcObject;
      let tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();

        videoElem.value.srcObject = null;
        source.value = null;
      });
    }
  };

  // Take a snapshot of the video element content
  const videoSnapshot = async (vWidth, vHeight) => {
    snapshotName.value = getMediaName("snap"); // Download and Save use the same name

    const canvasCtx = canvasElem.value.getContext("2d");
    console.log(canvasCtx);
    canvasCtx.drawImage(videoElem.value, 0, 0, vWidth, vHeight);
    const data = await canvasElem.value.toDataURL("image/" + snapshotExt.value);
    console.log(data);
    snapshot.value = data;
  };

  // Close a snapshot
  const closeSnapshot = () => {
    this.snapshot = null;
  };

  const getMediaName = (media) => {
    const snapTime = new Date().toISOString();

    const timeString = snapTime.replace(/[:.Z]/g, "");
    console.log(timeString);
    const snapName = media + "-" + timeString;
    console.log(snapName);
    return snapName;
  };

  const snapshotFullName = () => {
    return this.snapshotName + "." + this.snapshotExt;
  };

  const downloadSnapshot = async () => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = snapshot.value;
    a.download = snapshotName.value + "." + snapshotExt.value;
    a.click();
  };

  const saveNuggetMedia = async (nuggetId) => {
    const fileName = snapshotName.value + "." + snapshotExt.value;
    await storeNuggetMedia(nuggetId, fileName, snapshot.value);
  };

  const recordStart = () => {
    console.log("useMC - recordStart");
    const stream = videoElem.value;
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => pushVideoData(event.data);
    recorder.start();
    recorder.value = recorder;
  };

  const pushVideoData = async (data) => {
    if (data.size > 0) {
      data.name = getMediaName("clip") + ".webm";
      recordings.value.push(data);
    }
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
    // Is the mic on for this element?
    micOn,
    // Is the video playing in the browser?
    videoLive,
    // Is the audio/video being recorded?
    recording,
    // Is the recording paused
    paused,
    // Speaker muted?
    muted,
    // Current state of recorder
    recorderState,
    // Selected camera resolution
    cameraRes,
    // Take a snapshot
    videoSnapshot,
    // Close a snapshot
    closeSnapshot,
    // Get a hopefully unique file name
    getMediaName,
    // URL to allow browser download of image
    snapshotImgUrl,
    // name of the snapshot w/o extension
    snapshotName,
    // Snapshot extension
    snapshotExt,
    //Computed fullname of snapshot w/ extension
    snapshotFullName,
    // Friendly name for selected Video source
    videoSourceName,
    // Video HTML element
    videoElem,
    //Canvas HTML element
    canvasElem,
    // Img HTML element
    imgElem,
    // Download a snapshot
    downloadSnapshot,
    // Store new media for a Nugget
    saveNuggetMedia,
    // Start recording
    recordStart,
  };
}
