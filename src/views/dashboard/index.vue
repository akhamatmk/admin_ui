<template>
  <div class="dashboard-container">


    <br/> <el-button type="primary" @click="addData">Add Data</el-button><br/><br/>
    <div class="dashboard-text">List Data </div>
    <el-select v-model="form.namespaces" placeholder="Select NAMESPACE" @change="onChangeNamespace()">
      <el-option v-for="value in namespaces" :value="value" v-bind:key="value"  />
    </el-select>

    <el-select style="margin-left: 10px;"  v-model="form.setnames" placeholder="Select Setname" @change="onChangeData()">
      <el-option v-for="value in setnames" :value="value" v-bind:key="value"  />
    </el-select>

    <input class="input" style="margin-left: 10px;" v-model="form.filter" v-on:keyup="onChangeData()" placeholder="Filter Bin" />

    <export-excel
        class   = "primary"
        :data   = "json_data"
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "report_data.xls">

        Download Excel

    </export-excel> <br/><br/>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >


    <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
    </el-table-column>

    <el-table-column label="Bin" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Key }}</span>
        </template>
      </el-table-column>

    <el-table-column label="Value" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Value }}</span>
        </template>
    </el-table-column>

    <el-table-column label="Action" align="center">
      <template slot-scope="scope">
        <el-button type="primary" @click="onEdit(scope.row.SetName, scope.row.Key)">Edit</el-button>
        <el-button type="danger" @click="onDelete(scope.row.SetName, scope.row.Key)">Hapus</el-button>
      </template>
    </el-table-column>

    </el-table>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { getDataAero, getSetNameAerospike, deleteDataAerospike, getDataWithUrl } from '@/api/table'
import excel from 'vue-excel-export'
Vue.use(excel)

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      form: {
        name: "",
        filter:""
      },
      list: null,
      namespaces: null,
      setnames: null,
      bins: null,
      listLoading: true,
      json_fields: {
              'Bin': 'Key',
              'Value': 'Value'
          },
      json_data: null,
      json_meta: [
          [
              {
                  'key': 'charset',
                  'value': 'utf-8'
              }
          ]
      ],
    }
  },
  created() {
    this.listLoading = false;
    this.getNamespaces()
  },
  methods: {
    async getNamespaces() {
      let url = `${process.env.VUE_APP_AEROSPIKE}/nameSpace`;
      let data  = await getDataWithUrl(url);
      this.namespaces = data.data.data;
    },

    async onChangeNamespace(){
      await this.getSetnames();
      await this.onChangeData()
    },

    async onChangeData(){
      let nameSpace = this.form.namespaces;
      let filter = this.form.filter;
      let setName = this.form.setnames;
      let key = "key1";
      let Baseurl = `${process.env.VUE_APP_AEROSPIKE}?namespace=${nameSpace}&setname=${setName}&key_bin=${key}&filter=${filter}`;
      let data  = await getDataWithUrl(Baseurl);
      this.bins = data.data.data;
      this.list = data.data.data;
      this.json_data = data.data.data;
    },
    fetchData() {
      this.listLoading = true
      getDataAero().then(response => {
        this.list = response.data;
        this.json_data = this.list;
        this.listLoading = false;
      })
    },

    addData(){
      this.$router.push({path: '/form/add'})
    },

    async getSetnames(){
      let nameSpace = this.form.namespaces;
      let Baseurl = `${process.env.VUE_APP_AEROSPIKE}/setname/${nameSpace}`
      let data  = await getDataWithUrl(Baseurl);
      this.setnames = data.data.data;
    },

    onEdit(setname, bin){
      let nameSpace = this.form.namespaces;
      let setName = setname;
      let key = "key1";

      this.$router.push(`/form/edit/${nameSpace}/${setName}/${key}/${bin}`);
    },

    async onDelete(setname, key){
      let nameSpace = this.form.namespaces;
      let binKey = "key1";
      let setName = setname;

      let url = `${nameSpace}/${setName}/${binKey}/${key}`
      await deleteDataAerospike(url);
      this.$message('success Delete!')
      this.listLoading = true

      let Baseurl = `${process.env.VUE_APP_AEROSPIKE}?namespace=${nameSpace}&setname=${setName}&key_bin=${binKey}`;
      let data  = await getDataWithUrl(Baseurl);

      this.listLoading = false;
      this.list = data.data.data;
      this.json_data = data.data.data;
    }
  }
}
</script>
<style lang="css" scoped>
  .primary {
    float: right;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    background: greenyellow;
  }

  .input {
    margin-left: 10px;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
</style>


<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
