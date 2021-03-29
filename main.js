const x = document.getElementById("address");
const tg = document.getElementById('time');
const chieuDai = document.getElementById('length');

//Hàm lấy vị trí người dùng tự động
// window.onload = function () {
//   getLocation();
// };

function showPosition(position) {
  const latAuto = position.coords.latitude;
  const lngAuto = position.coords.longitude;

  // console.log(position);
  return latAuto, lngAuto;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation không được hỗ trợ bởi trình duyệt này.";
  }
}

function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  // khi người dùng gõ vị trí vào ô input
  document.getElementById("view").addEventListener("click", () => {
    const address = document.getElementById("txtAddress").value;
    const startPoint = document.getElementById('startPoint');

    superagent
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDBunJ4GXNEC3KJlpoGJO-iB--CjPv4o-s&address=${address}`
      )
      .end((err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(res);
        //lấy tọa độ địa chỉ mà người dùng nhập vào trong input
        const { lat, lng } = res.body.results[0].geometry.location;
        const location = res.body.results[0].formatted_address;
        x.innerHTML = location.length > 50 ? location.substr(0, 50) + "..." : location;
        startPoint.value = location;

        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 16,
          center: { lat, lng },
        });
        directionsRenderer.setMap(map);

        const marker = new google.maps.Marker({
          position: { lat, lng },
          title: location,
          map: map,
        });
      });
  });

  //Hàm lấy vị trí người dùng khi click vào button lấy vị trí
  document.getElementById("currentLocation").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(lat, lng);
        const startPoint = document.getElementById('startPoint');
        superagent
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDBunJ4GXNEC3KJlpoGJO-iB--CjPv4o-s&address=${lat},${lng}`
          )
          .end((err, res) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(res);
            //lấy tọa độ địa chỉ mà người dùng nhập vào trong input
            const { lat, lng } = res.body.results[0].geometry.location;
            const location = res.body.results[0].formatted_address;
            // x.innerHTML = location;
            x.innerHTML = location.length > 50 ? location.substr(0, 50) + "..." : location;
            startPoint.value = location;
          });
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 16,
          center: { lat, lng },
        });
        directionsRenderer.setMap(map);

        const marker = new google.maps.Marker({
          position: { lat, lng },
          title: location,
          map: map,
        });
      });
    }
  });

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  document.getElementById("startPoint").addEventListener("change", onChangeHandler);
  document.getElementById("destination").addEventListener("change", onChangeHandler);
  //chọn phương tiện di chuyển
  document.getElementById("mode").addEventListener("change", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

// Hàm chỉ dẫn đường đi
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const selectedMode = document.getElementById("mode").value;
  console.log(selectedMode);
  directionsService.route(
    {
      origin: {
        query: document.getElementById("startPoint").value,
      },
      destination: {
        query: document.getElementById("destination").value,
      },
      travelMode: google.maps.TravelMode[selectedMode],
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        const myroute = response.routes[0];
        const time    = myroute.legs[0].duration.text;
        const total   = myroute.legs[0].distance.text; 
        tg.innerHTML = "Total time: " + time;
        chieuDai.innerHTML = "Total length: " + total;
      } else { 
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}

const yearCur = new Date().getFullYear();
document.getElementById('copy').innerHTML = "&copy Copyright " + yearCur + " - Lung Tung Tu Team";

