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
          <img :style="{ width: '600px' }" :src="`data:image/png;base64, ${qrCode}`" />
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
              <parking-button color="danger" size="sm" class="ms-auto">Payment</parking-button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <app-footer class="py-3 bg-white border-radius-lg" />
</template>

<script>
import AppFooter from "@/examples/Footer.vue";
import RepositoryFactory from '@/repository/RepositoryFactory';
import { database, ref, onValue } from '@/firebase/firebase';
import ParkingButton from "@/components/ParkingButton.vue";
// import SockJS from "sockjs-client";
// import Stomp from "webstomp-client";
const QRCodeRepository = RepositoryFactory.get('qr_code');
const ParkingRepository = RepositoryFactory.get('parking');

const body = document.getElementsByTagName("body")[0];

export default {
  name: "qr-code",
  components: {
    AppFooter,
    ParkingButton,
  },
  data() {
    return {
      qrCode: '',
      userId: '',
      capacity: 0,
      occupation: 0,
      messages: [],
      plateNumber: '',
      checkInDate: '',
      checkOutDate: '',
      prices: 0,
    }
  },

  created() {
    this.getData();
  },

  methods: {
    async getData() {
      await this.getQRCode();
      await this.getInfo();
    },

    async getInfo() {
      const { data } = await ParkingRepository.get('capacity-information');
      if (data.status == 200) {
        const dataResponse = data.data;
        this.occupation = dataResponse.occupation;
        this.capacity = dataResponse.capacity;
      }
    },

    async getQRCode() {
      const { data } = await QRCodeRepository.get('generate?isViewAll=true');
      if (data.status == 200) {
        const dataResponse = data.data;
        this.qrCode = dataResponse.qr_code;
        this.userId = dataResponse.user_id;
        console.log("vo day")
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
            console.log('vo day')
            this.messages.push(data.val())
            console.log(datas.val())
          });
          console.log('message', this.messages)
          if (this.messages.length > 0) {
            const message = this.messages[this.messages.length - 1];
            console.log(message)
            this.plateNumber = message.plateNumber
            this.checkInDate = message.checkInDate
            this.checkOutDate = message.checkOutDate
            this.prices = message.prices
            if (message.checkType == 'CHECK_IN') {
              this.addOccupation()
              this.$toast.show(message.data, {
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
