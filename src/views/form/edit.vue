<template>
  <div class="app-container">
    <div class="dashboard-text">Edit Data </div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Value">
        <el-input v-model="form.value" type="textarea" />
      </el-form-item>

      <el-form-item label="File">
        <input type="file" @change="onFileChanged($event)"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">update</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>



    </el-form>
  </div>
</template>

<script>

import { addDataAerospike } from '@/api/table'
import { getDataAero, getDataAerospikeByKey, getDataWithUrl } from '@/api/table'

export default {
  data() {
    return {
      form: {
        value: '',
        key: '',
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    onFileChanged(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
        this.readFile(files[0]);
    },

    async getData(){
      let namespace = this.$route.params.namespace;
      let setname = this.$route.params.setname;
      let bin = this.$route.params.bin;
      let key = this.$route.params.key;
      let url = `${process.env.VUE_APP_AEROSPIKE}/${key}?namespace=${namespace}&setname=${setname}&key_bin=${bin}`

      let result = await getDataWithUrl(url);
      this.form.value = result.data.data;
    },

    async onSubmit() {
      let namespace = this.$route.params.namespace;
      let setname = this.$route.params.setname;
      let bin = this.$route.params.bin;
      let key = this.$route.params.key;
      let result = await addDataAerospike(namespace, setname, bin, key, this.form.value);

      if(result.data.code == "200") {
          this.$message('Success Update!')
          this.$router.push('/');

      } else {
        this.$message({
          message: 'Failed add Data',
          type: 'danger'
        })
      }


    },

    readFile(file) {
      let reader = new FileReader();
      reader.onload = e => {
        this.form.value = e.target.result;
      };
      reader.readAsText(file);
    },

    onCancel() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

