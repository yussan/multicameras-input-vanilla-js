const ElView = document.getElementById("cam__viewfinder");
const ElSelect = document.getElementById("cam__select");
let ElVideo = null;

// global variable
let stream = null;

// check camera permission
init();

// start programs
function init() {
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    // check permission
    navigator.permissions
      .query({ name: "camera" })
      .then(async (permissionObj) => {
        console.log(permissionObj);

        if (["prompt", "granted"].includes(permissionObj.state)) {
          // render video tag
          ElView.innerHTML = "<video id='cam__video'></video>";

          ELVideo = document.getElementById("cam__video");
          ELVideo.height = ElView.offsetHeight;
          ELVideo.width = ElView.offsetWidth;

          await navigator.mediaDevices.getUserMedia({ video: true });

          // count total cameras
          navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
              var cams = devices.filter(
                (device) => device.kind == "videoinput"
              );
              console.log("You have " + cams.length + " camera(s).");
              if (cams.length) {
                console.log("cams", cams);

                renderAvailableCameras(cams);
                handleSelectCam(cams[0].deviceId);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          const err = "Access camera denied";
          return showError(err, err);
        }
      })
      .catch((err) => {
        return showError(err, err.message);
      });
  } else {
    const err = "Your browser not support camera";
    return showError(err, err);
  }
}

// ElSelect onchange listener
ElSelect.addEventListener("change", function (e) {
  console.log(e.target.value);
  handleSelectCam(e.target.value);
});

// function to handle select camera
function handleSelectCam(deviceId) {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: 1280,
        height: 720,
        deviceId: { exact: deviceId },
      },
    })
    .then((stream) => {
      ELVideo.srcObject = stream;
      ELVideo.onloadedmetadata = function (e) {
        ELVideo.play();
      };
    });
}

// render available cameras
function renderAvailableCameras(cams = []) {
  let options = "";
  cams.map((n) => {
    options += `<option value="${n.deviceId}" >${n.label}</option>`;
  });

  return (ElSelect.innerHTML = options);
}

// show error to get media
function showError(err, message) {
  console.error(err);
  ElView.innerHTML = message;
}
