const ElView = document.getElementById("cam__viewfinder");
const ElSelect = document.getElementById("cam__select");

// global variable
let stream = null;

// check camera permission
init();

function init() {
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    // check permission
    navigator.permissions
      .query({ name: "camera" })
      .then((permissionObj) => {
        console.log(permissionObj);

        if (["prompt", "granted"].includes(permissionObj.state)) {
          // render video tag
          ElView.innerHTML = "<video id='cam__video'></video>";

          const ELVideo = document.getElementById("cam__video");
          ELVideo.height = ElView.offsetHeight;
          ELVideo.width = ElView.offsetWidth;

          // count total cameras
          navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
              await navigator.mediaDevices.getUserMedia({video: true}); 
              var cams = devices.filter(
                (device) => device.kind == "videoinput"
              );
              console.log("You have " + cams.length + " camera(s).");
              if (cams.length) {
                console.log("cams", cams);

                renderAvailableCameras(cams);

                return navigator.mediaDevices
                  .getUserMedia({
                    video: {
                      width: 1280,
                      height: 720,
                      deviceId: { exact: cams[0].deviceId },
                    },
                  })
                  .then((stream) => {
                    ELVideo.srcObject = stream;
                    ELVideo.onloadedmetadata = function (e) {
                      ELVideo.play();
                    };
                  });
              }
            })
            .catch((err) => {
              console.error(err);
            });
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

// render available cameras
function renderAvailableCameras(cams = []) {
  let options = "";
  cams.map((n) => {
    options += `<option data-deviceid="${n.deviceId}" >${n.label}</option>`;
  });

  return (ElSelect.innerHTML = options);
}

// show error to get media
function showError(err, message) {
  console.error(err);
  ElView.innerHTML = message;
}
