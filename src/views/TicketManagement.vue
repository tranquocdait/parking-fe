<template>
  <div class="py-4 container-fluid">
    <div class=" row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex pb-0">
            <h6>Ticket management</h6>
            <div class="input-group">
              <span class="input-group-text text-body">
                <i class="fas fa-search" aria-hidden="true"></i>
              </span>
              <input
                type="text"
                class="form-control text-border"
                v-model="keyword"
                placeholder="Type here..."
                v-on:keyup.enter="search()"
                style="border-right: 1px solid #e9ecef !important;"
              />
              <span class="space-span"></span>
              <select class="form-select" aria-label="Default select example" v-model="type">
                <option value="0" selected>---Status---</option>
                <option value="1">Check in</option>
                <option value="2">Check out</option>
              </select>
              <parking-button color="success" size="sm" class="ms-auto"  @click="search()">Search</parking-button>
            </div>
          </div>
          <div class="card-header d-flex pb-0">
            <parking-button color="primary" size="sm" class="ms-auto" @click="openRigisterModal()">Create ticket</parking-button>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ticket Name</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Created Date</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Fare Ticket</th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                    <th class="text-secondary opacity-7"></th>
                  </tr>
                </thead>
                <tbody v-if="data_list">
                  <template v-for="(item, index) in data_list" :key="index">
                    <tr>
                      <td class="first-col">
                        <h6 class="mb-0 text-sm">{{item.name}}</h6>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <p class="text-xs font-weight-bold mb-0">{{item.created_date}}</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <p class="text-xs font-weight-bold mb-0">{{item.fare}}</p>
                      </td>
                      <td class="align-middle text-center text-sm">
                        <span class="badge badge-sm bg-gradient-success" v-if="item.is_active">Active</span>
                        <span class="badge badge-sm bg-gradient-danger" v-else>Inactive</span>
                      </td>
                      <td class="align-middle">
                        <a href="javascript:;" class="text-info font-weight-bold text-xs" data-toggle="tooltip"
                          data-original-title="Edit user">Update</a>
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
import ParkingButton from "@/components/ParkingButton.vue";
import RepositoryFactory from '@/repository/RepositoryFactory';
const TicketManagement = RepositoryFactory.get('ticket')
export default {
  name: "tables",
  components: {
    ParkingButton
  },

  data() {
    return {
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
      const { data } = await TicketManagement.post({
        'page': 0,
        'page_size': 100,
        'keyword': this.keyword,
        'type': this.type,
      }, 'list');
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
</style>
