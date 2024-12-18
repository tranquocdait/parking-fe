<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row" v-if="stats">
          <div class="col-lg-4 col-md-6 col-12">
            <card
              :title="stats.totalParkingMonthly.title"
              :value="stats.totalParkingMonthly.value" 
              :percentage="stats.totalParkingMonthly.percentage"
              :iconClass="stats.totalParkingMonthly.iconClass" 
              :iconBackground="stats.totalParkingMonthly.iconBackground"
              :detail="stats.totalParkingMonthly.detail" directionReverse
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <card
              :title="stats.income.title"
              :value="stats.income.value"
              :percentage="stats.income.percentage"
              :iconClass="stats.income.iconClass"
              :iconBackground="stats.income.iconBackground"
              :detail="stats.income.detail"
              directionReverse
            />
          </div>

        </div>
        <div class="row">
          <div class="col-lg-12 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2">
              <gradient-line-chart 
              :id="'parking-overview'"
              :chartLabels="labels" 
              :datas="datas" 
              :label="'Parking'" 
              :title="'Parking Overview'"/>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-lg-12 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2">
              <gradient-line-chart 
              :id="'imcome'"
              :chartLabels="incomeLabels" 
              :datas="incomeDatas" 
              :label="'Income'" 
              :title="'Income Overview'"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "@/examples/Cards/Card.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import RepositoryFactory from '@/repository/RepositoryFactory';
const ParkingRepository = RepositoryFactory.get('parking')

export default {
  name: "dashboard",
  data() {
    return {
      labels: [],
      datas: [],
      total: 0,
      incomeLabels: [],
      incomeDatas: [],
      incomeTotal: 0,
      stats: null,
    };
  },
  components: {
    Card,
    GradientLineChart,
  },

  created() {
    this.getData();
    this.getIncomeData();
    this.setCard()
  },

  methods: {
    async getData() {
      const { data } = await ParkingRepository.post({
        'type': 1,
      }, 'checking-statistics');
      if (data.status == 200) {
        this.labels = data.data.label;
        this.datas = data.data.data;
        this.total = data.data.total;
      }
    },

    async getIncomeData() {
      const { data } = await ParkingRepository.post({
        'type': 1,
      }, 'income-statistics');
      if (data.status == 200) {
        this.incomeLabels = data.data.label;
        this.incomeDatas = data.data.data;
        this.incomeTotal = data.data.total;
        this.setCard()
      }
    },

    setCard() {
      this.stats = {
        totalParkingMonthly: {
          title: "Total parking",
          value: this.total,
          percentage: "+55%",
          iconClass: "ni ni-delivery-fast",
          detail: "since last month",
          iconBackground: "bg-gradient-primary",
        },
        totalParkingDaily: {
          title: "Today's Vehicle",
          value: "2,300",
          percentage: "+3%",
          iconClass: "ni ni-align-left-2",
          iconBackground: "bg-gradient-danger",
          detail: "since last month",
        },
        income: {
          title: "Total Income",
          value: this.incomeTotal + "₫",
          percentage: "-2%",
          iconClass: "ni ni-money-coins",
          percentageColor: "text-danger",
          iconBackground: "bg-gradient-success",
          detail: "since last month",
        },
      }
    }
  },

  watch: {
    total: function () {
      this.setCard();
    },
    
    incomeTotal: function () {
      this.setCard();
    }
  }
};
</script>
