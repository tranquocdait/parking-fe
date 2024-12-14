<template>
  <Popup v-if="openModal">
    <div class="row"  @click.self="onParentClick">
      <div class="col-12">
        <label for="vehicel">Vehicel</label>
        <select v-model="selectedVehicle" class="form-select" aria-label="Default select example">
          <option value="0">Choose...</option>
          <option v-for="vehicle in vehicles" :key="vehicle.vehicle_id" :value="vehicle.vehicle_id">
            {{ vehicle.plate_number }} ({{ vehicle.username_owner }})
          </option>
        </select>
      </div>
      <div class="col-12">
        <label for="ticket">Ticket</label>
        <select v-model="selectedTicket" class="form-select" aria-label="Default select example" @change="changeTickets(selectedTicket)">
          <option value="0">Choose...</option>
          <option v-for="ticket in tickets" :key="ticket.id" :value="ticket.id">
            {{ ticket.name }}
          </option>
        </select>
      </div>
      <parking-input 
        type="date" 
        placeholder="dd-mm-yyyy" 
        v-model="registerDatePicker"
        label="Start date"
        @change="changeRegisterDate()"
        :message="registerDateMessage"
        :valid="isValidRegisterDate" 
        col="12"
        size="lg" />
      <parking-input 
        type="text" 
        placeholder="0" 
        v-model="fare"
        name="fare" 
        label="Start date"
        @change="changeRegisterDate()"
        :message="registerDateMessage"
        :valid="isValidRegisterDate" 
        col="12"
        size="lg" 
        disabled/>
    </div>
    
    <div class="modal-footer d-flex">
      <parking-button color="danger" size="sm" :disabled="selectedVehicle == 0" @click="register()">Accept</parking-button>
      <parking-button color="primary" size="sm" @click="openModal = !openModal">Cancel</parking-button>
    </div>
  </Popup>
  <div class="py-4 container-fluid">
    <div class=" row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex pb-0">
            <h6>Vehicle management</h6>
            <div class="input-group">
              <span class="input-group-text text-body">
                <i class="fas fa-search" aria-hidden="true"></i>
              </span>
              <input type="text" class="form-control text-border" v-model="keyword" placeholder="Type here..."
                v-on:keyup.enter="search()" style="border-right: 1px solid #e9ecef !important;" />
              <span class="space-span"></span>
              <select class="form-select" aria-label="Default select example" v-model="type">
                <option value="0" selected>---Status---</option>
                <option value="1">Register</option>
                <option value="1">Accepted</option>
                <option value="2">Rejected</option>
              </select>
              <parking-button color="success" size="sm" class="ms-auto" @click="search()">Search</parking-button>
            </div>
          </div>
          <div class="card-header d-flex pb-0">
            <parking-button color="primary" size="sm" class="ms-auto" @click="openRigisterModal()">Payment register</parking-button>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th>
                      <p class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 mb-0">User</p>
                      <p class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 mb-0">Plate Number</p>
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ticket Name</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ticket Fare</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Prices</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Start Date</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">End Ticket</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                    <th class="text-secondary opacity-7"></th>
                  </tr>
                </thead>
                <tbody v-if="data_list">
                  <template v-for="(item, index) in data_list" :key="index">
                    <tr>
                      <td class="first-col">
                        <h6 class="mb-0 text-sm">{{item.vehicle_user}}</h6>
                        <p class="text-xs text-secondary mb-0">{{item.plate_number}}</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <p class="text-xs font-weight-bold mb-0">{{item.name}}</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <p class="text-xs font-weight-bold mb-0">{{item.fare}}</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <p class="text-xs font-weight-bold mb-0">{{item.prices}}</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <p class="text-xs font-weight-bold mb-0">{{item.start_date}}</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <p class="text-xs font-weight-bold mb-0">{{item.end_date}}</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="badge badge-sm bg-gradient-success" v-if="item.is_active">Active</span>
                        <span class="badge badge-sm bg-gradient-danger" v-else>Inactive</span>
                      </td>
                      <td class="align-middle">
                        <a href="javascript:;" class="text-primary font-weight-bold text-xs" data-toggle="tooltip"
                          data-original-title="Edit user" @click="getMoreInfor(item)">Update</a>
                        <ul
                          class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
                          :class="item.more ? 'show' : ''"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li class="nav-item d-flex align-items-center">
                            <a class="dropdown-item border-radius-md" href="./profile">
                              <div class="py-1 d-flex">
                                <div class="my-auto text-success">
                                  <i class="fa fa-check-circle-o fa-lg pe-2"></i>
                                </div>
                                <div class="d-flex flex-column justify-content-center">
                                  <h6 class="mb-1 text-sm font-weight-normal">
                                    Accept
                                  </h6>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li class="border-bottom-nav">
                          </li>
                          <li class="nav-item d-flex align-items-centerr">
                            <a class="dropdown-item border-radius-md" href="./signin">
                              <div class="py-1 d-flex">
                                <div class="my-auto  text-danger">
                                  <i class="fa fa-ban fa-lg pe-2"></i>
                                </div>
                                <div class="d-flex flex-column justify-content-center">
                                  <h6 class="mb-1 text-sm font-weight-normal">
                                    Reject
                                  </h6>
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <tbody v-else>
                  <td></td>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Popup from '@/components/Popup.vue';
import ParkingButton from "@/components/ParkingButton.vue";
import ParkingInput from "@/components/ParkingInput.vue";
import RepositoryFactory from '@/repository/RepositoryFactory';
const PaymentManagement = RepositoryFactory.get('payment')
const TicketManagement = RepositoryFactory.get('ticket')
const ParkingRepository = RepositoryFactory.get('parking')
import moment from 'moment';

export default {
  name: "payment-management",
  components: {
    ParkingButton,
    ParkingInput,
    Popup,
  },

  data() {
    return {
      openModal: false,
      keyword: '',
      type: 0,
      data_list: null,

      // Register Form
      selectedTicket: 0,
      tickets: [],
      selectedVehicle: 0,
      vehicles: [],
      registerDatePicker: moment().format("YYYY-MM-DD"),
      isValidRegisterDate: null,
      fare: 0,
    };
  },

  created() {
    this.getData()
  },

  methods: {
    search() {
      this.getData();
    },

    mounted() {
      this.changeRegisterDate();
    },

    changeTickets(ticketId) {
      if (ticketId !== "0") {
        const selectedTicket = this.tickets.find(ticket => ticket.id === ticketId);
        console.log("Selected Ticket:", selectedTicket);
        this.fare = selectedTicket.fare;
      } else {
        this.fare = 0;
        console.log("No ticket selected.");
      }
    },

    changeRegisterDate() {
      let dArr
      if (this.registerDatePicker) {
        dArr = this.registerDatePicker.split("-");  // ex input: "2010-01-18"
      } else {
        dArr = moment().format("YYYY-MM-DD").split("-");  // ex input: "2010-01-18"
      }
      this.registerDate = dArr[2]+ "/" +dArr[1]+ "/" +dArr[0];
    },

    async getTicketData() {
      const { data } = await TicketManagement.post({
        'page': 0,
        'page_size': 100,
        'keyword': this.keyword,
        'type': this.type,
      }, 'list');
      if (data.status == 200) {
        this.tickets = [];
        for (const ticket of data.data.data_list) {
          if (ticket.type != 4) {
            this.tickets.push(ticket);
          }
        }
      }
    },

    async getVehicelData() {
      const { data } = await ParkingRepository.post({
        'page': 0,
        'page_size': 100,
      }, 'vehicle-management');
      if (data.status == 200) {
        this.vehicles = data.data.data_list
      }
    },

    async getData() {
      const { data } = await PaymentManagement.post({
        'page': 0,
        'page_size': 100,
        'keyword': this.keyword,
        'type': this.type,
      }, 'list');
      if (data.status == 200) {
        this.data_list = data.data.data_list
        for (let data in this.data_list) {
          data = {...data, ...{more:false}};
        }
      }
    },

    async register() {
      const { data } = await PaymentManagement.post({
        'vehicle_id': this.selectedVehicle,
        'ticket_id': this.selectedTicket,
        'start_date': this.registerDatePicker,
      }, '');
      if (data.status == 200) {
        this.openModal = !this.openModal
        this.getData()
      }
    },

    openRigisterModal() {
      this.tickets = [];
      this.vehicles = [];
      this.fare = 0;
      this.selectedTicket = '';
      this.selectedVehicle = '';
      this.getTicketData();
      this.getVehicelData();
      this.openModal = !this.openModal;
    },

    isCheckout(checkOutDate) {
      return checkOutDate && checkOutDate.trim() !== ''
    },

    getMoreInfor(item) {
      const more = item.more
      for (let data of this.data_list) {
        data.more = false
      }
      item.more = !more
    },
  }
};
</script>
<style lang='scss' scoped>
.first-col {
  padding-left: 24px;
}

.card-header {
  &.d-flex {
    justify-content: space-between;
  }

  .input-group {
    width: 50%;

    .space-span {
      width: 2px;
    }
  }
}

.modal-footer {
  &.d-flex {
    justify-content: end;
  }

  padding-right: 0px;
  margin-top: 12px;
}

.modal-body {
  margin-top: 12px;
  padding: 0px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;

  .modal-item {
    justify-content: space-between;
    padding-left: 12px;
    padding-right: 12px;

    a {
      cursor: pointer;
    }

    &:hover {
      border-radius: 0.5rem;
      background-color: #8392ab;
      color: white;
    }

    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
}

.modal-result {
  padding-top: 12px;
  margin-bottom: 12px;
}

</style>
