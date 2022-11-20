<template>
  <div class="py-4 container-fluid">
    <div class=" row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6>Parking management</h6>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Vehicel</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Model</th>
                    <th>
                      <p class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 mb-0">Check in</p>
                      <p class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 mb-0">Check out</p>
                    </th>
                    <!-- <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Payment type</th> -->
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                    <th class="text-secondary opacity-7"></th>
                  </tr>
                </thead>
                <tbody v-if="data_list">
                  <template v-for="(item, index) in data_list" :key="index">
                    <tr>
                      <td class="first-col">
                        <h6 class="mb-0 text-sm">{{item.plate_number}}</h6>
                        <p class="text-xs text-secondary mb-0">{{item.vehicle_owner}}</p>
                      </td>
                      <td>
                        <p class="text-sm font-weight-bold mb-0">{{item.vehicle_brand}}</p>
                        <p class="text-xs font-weight-bold text-secondary mb-0">{{item.vehicle_Model}}</p>
                      </td>
                      <td>
                        <p class="text-xs font-weight-bold mb-0 text-success">{{item.check_in_date}}</p>
                        <p class="text-xs font-weight-bold text-danger mb-0">{{pipeString(item.check_out_date)}}</p>
                      </td>
                      <!-- <td>
                        <h6 class="mb-0 text-sm">Free</h6>
                      </td> -->
                      <td class="align-middle text-center text-sm" v-if="isCheckout(item.check_out_date)">
                        <span class="badge badge-sm bg-gradient-danger">Check out</span>
                      </td>
                      <td class="align-middle text-center text-sm" v-else>
                        <span class="badge badge-sm bg-gradient-success">Check in</span>
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
import RepositoryFactory from '@/repository/RepositoryFactory';
const ParkingRepository = RepositoryFactory.get('parking')
export default {
  name: "tables",
  components: {
  },

  data() {
    return {
      data_list: null,
    };
  },

  created() {
    this.getData()
  },

  methods: {
    async getData() {
      const { data } = await ParkingRepository.post({
        'keyword': '',
        'page': 0,
        'page_size': 100
      }, 'tracking-management');
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
  padding-left: 12px;
}
</style>
