<template>
  <Popup v-if="openModal">
    <div class="input-group modal-heade">
      <span class="input-group-text text-body">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
      <input type="text" class="form-control text-border" v-model="keyword" placeholder="Type here..."
        v-on:keyup.enter="search()" style="border-right: 1px solid #e9ecef !important;" />
      <parking-button color="success" size="sm" class="ms-auto" @click="search()">Search</parking-button>
    </div>
    <p class="modal-result">Result of search:</p>
    <div class="modal-body">
      <div class="modal-item d-flex">
        abc
        <a @click="search()"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>
      </div>
      <div class="modal-item d-flex border-butto">
        abc
        <a @click="search()"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>
      </div>
      <div class="modal-item d-flex">
        abc
        <a @click="search()"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>
      </div>
    </div>
    <p class="modal-result">Accepted vehicle:</p>
    <div class="modal-body">
      <div class="modal-item d-flex">
        abc
        <a @click="search()"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>
      </div>
      <div class="modal-item d-flex border-butto">
        abc
        <a @click="search()"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>
      </div>
      <div class="modal-item d-flex">
        abc
        <a @click="search()"><i class="fa fa-minus-circle" aria-hidden="true"></i></a>
      </div>
    </div>
    <div class="modal-footer d-flex">
      <parking-button color="danger" size="sm" @click="openModal = !openModal">Accept</parking-button>
      <parking-button color="primary" size="sm" @click="openModal = !openModal">Close</parking-button>
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
            <parking-button color="primary" size="sm" class="ms-auto" @click="openModal = !openModal">Vehicle
              register</parking-button>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Vehicle</th>
                    <th>
                      <p class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 mb-0">Branch
                      </p>
                      <p class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 mb-0">Model</p>
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Register date</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Accepted date</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status
                    </th>
                    <th class="text-secondary opacity-7"></th>
                  </tr>
                </thead>
                <tbody v-if="data_list">
                  <template v-for="(item, index) in data_list" :key="index">
                    <tr>
                      <td class="first-col">
                        <h6 class="mb-0 text-sm">{{ item.plate_number }}</h6>
                        <p class="text-xs text-secondary mb-0">{{ item.username_owner }}</p>
                      </td>
                      <td>
                        <p class="text-sm font-weight-bold mb-0">{{ item.vehicle_brand }}</p>
                        <p class="text-xs font-weight-bold text-secondary mb-0">{{ item.vehicle_Model }}</p>
                      </td>
                      <td>
                        <p class="text-xs font-weight-bold mb-0">{{ item.register_parking_date }}</p>
                      </td>
                      <td>
                        <p class="text-xs font-weight-bold mb-0">{{ pipeString(item.accepted_parking_date) }}</p>
                      </td>
                      <!-- <td>
                        <h6 class="mb-0 text-sm">Free</h6>
                      </td> -->
                      <td class="align-middle text-center text-sm" v-if="item.status == 1">
                        <span class="badge badge-sm bg-gradient-primary">Register</span>
                      </td>
                      <td class="align-middle text-center text-sm" v-if="item.status == 2">
                        <span class="badge badge-sm bg-gradient-success">Accepted</span>
                      </td>
                      <td class="align-middle text-center text-sm" v-if="item.status == 3">
                        <span class="badge badge-sm bg-gradient-danger">Rejected</span>
                      </td>
                      <td class="align-middle">
                        <a href="javascript:;" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip"
                          data-original-title="Edit user">More</a>
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
import RepositoryFactory from '@/repository/RepositoryFactory';
const ParkingRepository = RepositoryFactory.get('parking')
export default {
  name: "tables",
  components: {
    ParkingButton,
    Popup
  },

  data() {
    return {
      openModal: false,
      keyword: '',
      type: 0,
      data_list: null,
    };
  },

  created() {
    this.getData()
  },

  methods: {
    search() {
      this.getData();
    },

    async getData() {
      const { data } = await ParkingRepository.post({
        'page': 0,
        'page_size': 100,
        'keyword': this.keyword,
        'type': this.type,
      }, 'vehicle-management');
      if (data.status == 200) {
        this.data_list = data.data.data_list
      }
    },

    pipeString(str) {
      return str && str.trim() !== '' ? str : ' - '
    },

    isCheckout(checkOutDate) {
      return checkOutDate && checkOutDate.trim() !== ''
    }
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
