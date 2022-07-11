import { ref, reactive, computed } from "vue";

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

const { storeNuggetMedia, storeNuggetMediaMeta } = useFlows();

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

  // User entered snapshot meta data for current snapshot
  const snapMeta = reactive({
    title: "",
    caption: "",
    altText: "",
    description: "",
    tags: "",
  });

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

  // The recorder
  const recorder = ref(null);

  // Recording from mic/video
  const recording = ref(false);

  // Array of recordings
  const recordings = ref([]);

  // Recording paused
  const paused = ref(false);

  // The screen ratio
  const screenRatio = ref(0.562);

  // Speaker Muted
  const muted = ref(true);
  // The HTML <video> element for THIS multicorder

  // Recorder state streaming|recording|paused|stopped|saving
  const recorderState = ref("streaming");
  const recorderStates = [
    "streaming", // live video visible but not recorded
    "recording", // Video being recorded
    "paused", // Recording paused, can be restarted
    "stopped", // Recording stopped and available for download or saving.
    "saving", // In the process of saving, it will go back to streaming when done
  ];

  // User entered recording meta data for current recording
  const recMeta = reactive({
    title: "",
    caption: "",
    altText: "",
    description: "",
    tags: "",
  });

  const setRecorderState = (state) => {
    if (recorderStates.includes(state)) {
      console.log("Recorder is currently : " + state);
      recorderState.value = state;
    } else {
      console.error("Invalid recorder state: " + state);
    }
  };

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
      console.log(cameras.value);
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
  };

  // Handle switching the video source to the given one
  const changeVideoSource = (videoSource, videoElem) => {
    console.log(videoSource);
    console.log(videoElem);

    closeVideoSource(videoElem);

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

    const deviceRatio = stream_height / stream_width;

    screenRatio.value = deviceRatio;

    cameraRes.value = camRes;
    console.log(cameraRes.value);

    // Emit video start/live event
    videoElem.onloadedmetadata = () => {
      //("video-live", stream);
      console.log("video streaming to " + videoElem);
    };
  };

  // Stop video in a player, it may be restarted.
  const closeVideoSource = () => {
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
    console.log(vWidth);
    console.log(vHeight);
    console.log(videoElem);
    const vRatio = videoElem.value.videoHeight / videoElem.value.videoWidth;
    console.log(videoElem.value.videoWidth);
    console.log("Native Height: " + videoElem.value.videoHeight);
    console.log(videoElem.value.width);
    console.log("Current Height: " + videoElem.value.height);
    console.log("TARGET WIDTH: " + vHeight * vRatio);
    const canvasCtx = canvasElem.value.getContext("2d");
    console.log(canvasCtx);
    const rRatio = videoElem.value.height / videoElem.value.videoHeight;
    console.log("RRatio" + rRatio);

    canvasCtx.drawImage(videoElem.value, 0, 0, vWidth, vHeight);
    const data = await canvasElem.value.toDataURL("image/" + snapshotExt.value);
    //   console.log(data, vWidth, vHeight);
    snapshot.value = data;
  };

  // Close a snapshot
  const closeSnapshot = () => {
    this.snapshot = null;
  };

  const getMediaName = (media) => {
    const createTime = new Date().toISOString();

    const timeString = createTime.replace(/[:.Z]/g, "");
    console.log(timeString);
    const fileName = media + "-" + timeString;
    console.log(fileName);
    return fileName;
  };

  const snapshotFullName = computed(() => {
    return snapshotName.value + "." + snapshotExt.value;
  });

  const downloadSnapshot = async () => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = snapshot.value;
    a.download = snapshotFullName.value;
    a.click();
  };

  const saveNuggetSnap = async (nuggetId) => {
    const fileName = snapshotName.value + "." + snapshotExt.value;
    await storeNuggetMedia(nuggetId, fileName, snapshot.value);
    console.log(snapMeta);
    await storeNuggetMediaMeta(nuggetId, fileName, { ...snapMeta });
    return fileName;
  };

  const deleteSnap = async (nuggetId) => {
    snapshot.value = null;

    snapMeta.title = "";
    snapMeta.caption = "";
    snapMeta.altText = "";
    snapMeta.description = "";
    snapMeta.tags = "";

    snapshotImgUrl.value = null;
    snapshotName.value = null;
  };

  const recordStart = () => {
    console.log("useMC - recordStart");
    let stream = videoElem.value.srcObject;
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (event) => pushVideoData(event.data);
    rec.start();
    recorder.value = rec;
    setRecorderState("recording");
  };

  const pushVideoData = async (data) => {
    if (data.size > 0) {
      data.name = getMediaName("clip") + ".webm";
      recordings.value.push(data);
      console.log("Recording...");
      console.log(data);
    }
  };

  // Pause recording, can be restarted
  const recordPause = () => {
    videoElem.value.pause();
    setRecorderState("paused");
  };

  // Resume recording after pause
  const recordResume = () => {
    videoElem.value.play();
    setRecorderState("recording");
  };

  // Stop recording, cannot be restarted. New video required.
  const recordStop = () => {
    recorder.value.stop();
    setRecorderState("stopped");
  };

  // Stop recording, cannot be restarted. New video required.
  const recordDelete = () => {
    setRecorderState("streaming");
    recorder.value = null;
    recMeta.title = "";
    recMeta.caption = "";
    recMeta.altText = "";
    recMeta.description = "";
    recMeta.tags = "";
  };

  // Stop recording, cannot be restarted. New video required.
  const recordDownload = async (recordingIndex = 0) => {
    const blob = recordings.value[recordingIndex];
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = blob.name;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const deleteRecording = (recordingIndex) => {
    //if (this.recorderMode == "single") {
    //  this.setView("video");
    //}
    recordings.value.splice(index, 1);
    //this.$emit("delete-recording", index);
    setRecorderState("stopped");
  };

  // Stop recording, cannot be restarted. New video required.
  const recordSave = async (nuggetId, recordingIndex = 0) => {
    const blob = recordings.value[recordingIndex];
    const url = URL.createObjectURL(blob);
    const fileName = blob.name;
    await storeNuggetMedia(nuggetId, fileName, url);
    await storeNuggetMediaMeta(nuggetId, fileName, recMeta);
    setRecorderState("streaming");
    recorder.value = null;
    return fileName;
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
    // User provided meta data for snapshot
    snapMeta,
    // The selected video source for this instance
    videoSource,
    // Allow changing the videoSource
    changeVideoSource,
    // Permitting stopping video
    closeVideoSource,
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
    saveNuggetSnap,
    // Start recording
    recordStart,
    // Pause recording, can be restarted
    recordPause,
    // Resume recording after pause
    recordResume,
    // Stop recording, cannot be restarted. New video required.
    recordStop,
    // Delete the current recording
    recordDelete,
    // Download the resulting the video
    recordDownload,
    // Save the recording the the TachyonCMS
    recordSave,
    // User provided recording meta data
    recMeta,
    // Delete a snapshot
    deleteSnap,
    // Screen ratio
    screenRatio,
  };
}
