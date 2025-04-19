<template>
  <div class="row">
    <div class="col-7 mt-4 mr-1 border-radius-xl position-relative" :style="{
      backgroundColor: '#2dce89',
      backgroundSize: 'cover'
    }">
      <main class="mt-1 main-content border-radius-lg">
        <div class="section min-vh-85 position-relative transform-scale-0 transform-scale-md-7 text-center">
          <div class="d-flex justify-content-center infor-lable">
            <h1>There are <span class="text-danger">{{ occupation }}/{{ capacity }}</span> cars parked</h1>
          </div>
          <img v-if="isQRCode" :style="{ width: '600px' }" :src="`data:image/png;base64, ${qrCode}`" />
          <video
            v-else
            ref="video"
            autoplay
            playsinline
            style="width: 100%; max-width: 720px; border: 1px solid #ccc;"
          ></video>
          <div style="margin-top: 10px;">
            <template v-if="!isQRCode">
              <parking-button v-if="!isStreamRunning" color="primary" size="lg" class="ms-auto" @click="startCamera">Start</parking-button>
              <parking-button v-if="isStreamRunning" color="danger" size="lg" class="ms-auto" @click="stopCamera">Stop</parking-button>
            </template>
            <parking-button v-if="!isQRCode && !isStreamRunning" color="warning" size="lg" style="margin-left: 12px !important;" class="ms-auto" @click="isQRCode=true; openQRCode()">Use QR Code</parking-button>
            <parking-button v-if="isQRCode && !isStreamRunning" color="warning" size="lg" style="margin-left: 12px !important;"  class="ms-auto" @click="isQRCode=false">Use Camera</parking-button>
          </div>
        </div>
      </main>
    </div>
    <div class="col-4 mt-4 border-radius-xl position-relative" :style="{
      backgroundColor: '#2dce89',
      backgroundSize: 'cover'
    }">
      <main class="mt-1 main-content border-radius-lg">
        <div class="section min-vh-85 position-relative transform-scale-0 transform-scale-md-7 text-center">
          <div class="d-flex justify-content-center infor-lable">
            <h2>Checking Information</h2>
            <div class="row mt-3">
              <label for="example-text-input" class="form-control-label">Plate Number</label>
              <input class="form-control" type="text" :value="plateNumber" disabled />
            </div>
            <div class="row mt-3">
              <label for="example-text-input" class="form-control-label">Check In Date</label>
              <input class="form-control" type="text" :value="checkInDate" disabled />
            </div>
            <div class="row mt-3">
              <label for="example-text-input" class="form-control-label">Check Out Date</label>
              <input class="form-control" type="text" :value="checkOutDate" disabled />
            </div>
            <div class="row mt-3 mb-3" v-if="prices">
              <label for="example-text-input" class="form-control-label">Price</label>
              <input class="form-control" type="text" :value="prices" disabled />
            </div>
            <div class="row mt-3" v-if="prices">
              <parking-button color="danger" size="lg" class="ms-auto" @click="onPayment">Payment</parking-button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <app-footer class="py-3 bg-white border-radius-lg" />
</template>

<script>
import axios from "axios";
import AppFooter from "@/examples/Footer.vue";
import RepositoryFactory from '@/repository/RepositoryFactory';
import { database, ref, onValue } from '@/firebase/firebase';
import ParkingButton from "@/components/ParkingButton.vue";
// import SockJS from "sockjs-client";
// import Stomp from "webstomp-client";
const QRCodeRepository = RepositoryFactory.get('qr_code');
const ParkingRepository = RepositoryFactory.get('parking');
const PaymentManagement = RepositoryFactory.get('payment')
const CheckingRepository = RepositoryFactory.get('checking')


const body = document.getElementsByTagName("body")[0];

export default {
  name: "qr-code",
  components: {
    AppFooter,
    ParkingButton,
  },
  data() {
    return {
      isQRCode: false,
      qrCode: '',
      userId: '',
      capacity: 0,
      occupation: 0,
      messages: [],
      plateNumber: '',
      checkInDate: '',
      checkOutDate: '',
      prices: 0,
      paymentId: '',

      // Stream
      isStreamRunning: false,
      stream: null,
      isLoading: false,

      isPayment: false,
    }
  },

  created() {
    this.getData();
  },

  methods: {
    async getData() {
      await this.getInfo();
    },

    async openQRCode() {
      await this.getQRCode();
    },

    async startCamera() {
      this.isStreamRunning = true;
      await this.startStream();
      this.startSending();
    },

    stopCamera() {
      this.isStreamRunning = false;
      this.stopSending();
      this.stopStream();
    },

    async startStream() {
      try {
        // Request access to the camera
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = this.stream;
      } catch (error) {
        console.error("Error accessing the camera:", error);
        alert("Unable to access the camera. Please check permissions.");
      }
    },

    startSending() {
      const video = this.$refs.video;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      let current = new Date();
      let isFirst = true;
      this.isPayment = false

      this.sendingInterval = setInterval(() => {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame on the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image as a data URL
        const frameData = canvas.toDataURL("image/jpeg");
        // console.log(frameData)

        //Send the frame to the backend
        axios
          .post("http://localhost:8089/plate-number", { frame: frameData })
          .then((response) => {
            // console.log("Frame sent successfully:", response.data);
            const data = response.data
            if (data.plate_number && data.plate_number.length) {
              const runDateTime = new Date();
              // console.log("runDateTime > current", runDateTime, current)
              // console.log("runDateTime - current", runDateTime.getTime() - current.getTime())
              const isRunning = runDateTime.getTime() > current.getTime() + 1000;
              if ((isRunning || isFirst) && !this.isLoading && !this.isPayment) {
                isFirst = false;
                current = runDateTime;
                this.checking(data, frameData)
              }
            }
          })
          .catch((error) => {
            console.error("Error sending frame:", error);
          });
      }, 1000); // Send every 100ms (10 frames per second)
    },

    stopSending() {
      if (this.sendingInterval) {
        clearInterval(this.sendingInterval);
        this.sendingInterval = null;
      }
    },

    stopStream() {
      if (this.stream) {
        // Stop all video tracks
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
      }
    },

    async onPayment() {
      const { data } = await PaymentManagement.get('complete/' + this.paymentId);
      if (data.status == 200) {
        this.prices = 0
        this.paymentId = ''
        this.isPayment = false
        this.$toast.show("Payment successfully!", {
          type: 'error',
          position: 'bottom',
          dismissible: true
        });
      }
    },

    async getInfo() {
      const { data } = await ParkingRepository.get('capacity-information');
      if (data.status == 200) {
        const dataResponse = data.data;
        this.occupation = dataResponse.occupation;
        this.capacity = dataResponse.capacity;
      }
    },
    
    async checking(checkingData, frameData) {
      console.log('call plateNumber')
      const plateNumber = checkingData.plate_number
      try {
        this.isLoading = true;
        const { data } = await CheckingRepository.post({
          'shorted_plate_number': plateNumber,
          'image': frameData,
        }, 'parking-area');
        if (data.status == 200) {
          const dataResponse = data.data;
          const checkType = dataResponse.check_type
          if (checkType == "DONT_EXIST") {
            this.$toast.show(dataResponse.message, {
              type: 'error',
              position: 'bottom',
              dismissible: true
            });
            return;
          }
          if (checkType == 'CHECK_IN') {
            this.addOccupation()
            this.$toast.show(dataResponse.message, {
              type: 'success',
              position: 'bottom',
              dismissible: true
            });
          } else if (checkType == 'CHECK_OUT' || checkType == 'WAITING') {
            this.subOccupation()
            this.$toast.show(dataResponse.message, {
              type: 'error',
              position: 'bottom',
              dismissible: true
            });
          }
          this.plateNumber = dataResponse.plate_number
          this.checkInDate = dataResponse.check_in_date
          this.checkOutDate = dataResponse.check_out_date
          this.prices = dataResponse.prices
          this.paymentId = dataResponse.payment_id
          if (this.paymentId) {
            this.isPayment = true;
          }
        }
      }
      catch(err) {
        console.log(err)
      }
      finally {
        this.isLoading = false;
      }
    },

    async getQRCode() {
      const { data } = await QRCodeRepository.get('generate?isViewAll=true');
      if (data.status == 200) {
        const dataResponse = data.data;
        this.qrCode = dataResponse.qr_code;
        this.userId = dataResponse.user_id;
        this.getMessage();
      }
    },

    subOccupation() {
      if (this.occupation > 0) {
        this.occupation--;
      }
    },

    addOccupation() {
      this.occupation++;
    },

    getMessage() {
      onValue(ref(database, `checking-${this.userId}`),
        datas => {
          this.messages = []
          datas.forEach(data => {
            this.messages.push(data.val())
          });
          if (this.messages.length > 0 && !this.isStreamRunning) {
            const message = this.messages[this.messages.length - 1];
            this.plateNumber = message.plateNumber
            this.checkInDate = message.checkInDate
            this.checkOutDate = message.checkOutDate
            this.prices = message.prices
            this.paymentId = message.paymentId
            console.log(message);
            if (message.checkType == 'CHECK_IN') {
              this.addOccupation()
              this.$toast.show(message.message, {
                type: 'success',
                position: 'bottom',
                dismissible: true
              });
            } else if (message.checkType == 'CHECK_OUT' || message.checkType == 'WAITING') {
              this.subOccupation()
              this.$toast.show(message.message, {
                type: 'error',
                position: 'bottom',
                dismissible: true
              });
            }
          }
        }
      )
    }
  },

  beforeMount() {
    this.$store.state.layout = "vr";
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.add("virtual-reality");
    this.$store.state.isTransparent = "bg-white";
  },

  beforeUnmount() {
    this.$store.state.layout = "default";
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.remove("virtual-reality");

    if (this.$store.state.isPinned === false) {
      const sidenav_show = document.querySelector(".g-sidenav-show");
      sidenav_show.classList.remove("g-sidenav-hidden");
      sidenav_show.classList.add("g-sidenav-pinned");
      this.$store.state.isPinned = true;
    }
    this.$store.state.isTransparent = "bg-transparent";
  },

  computed: {
    isTransparent() {
      return this.$store.state.isTransparent;
    },
  },
};
</script>
<style lang="scss" scoped>
.infor-lable {
  h1 {
    width: 800px;
    border-radius: 12px;
    background-color: white;
  }
  flex-direction: column;

  .form-control {
    font-size: larger;
  }

  .form-control-label {
    font-size: larger;
    text-align: start;
  }

  button {
    font-size: larger;
  }
}

.row {
  justify-content: center;

  .mr-1 {
    margin-right: 6px;
  }
}
</style>
