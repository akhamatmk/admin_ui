<template>
  <div class="app-container">
    <div class="dashboard-text">Add Data </div>
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item label="Namespace">
        <el-select v-model="form.namespace" placeholder="Select Set Namespace" @change="onNamespaceChange()">
          <el-option v-for="value in namespaces" :value="value" v-bind:key="value"  />
        </el-select>
      </el-form-item>

      <el-form-item label="Set Name">
        <el-select v-model="form.setname" placeholder="Select SetName">
          <el-option v-for="value in setnames" :value="value" v-bind:key="value"  />
        </el-select>

        <br>
        <b>Or Make New Setname</b><br/>

        <el-input v-model="form.new_setname" />
      </el-form-item>

      <el-form-item label="Bin">
        <el-input v-model="form.bin" />
      </el-form-item>

      <el-form-item label="Value">
        <el-input v-model="form.value" type="textarea" />
      </el-form-item>

      <el-form-item label="File">
        <input type="file" @change="onFileChanged($event)"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { addDataAerospike, getSetNameAerospike, deleteDataAerospike, getDataWithUrl } from '@/api/table'

export default {
  data() {
    return {
      namespaces: null,
      setnames: null,
      bins: null,
      form: {
        value: '',
        key: '',
        bin: '',
        setname: '',
        namespace: '',
        new_setname: '',
      }
    }
  },
  created() {
    this.getNamespace()
  },
  methods: {
    async getNamespace() {
        let url = `${process.env.VUE_APP_AEROSPIKE}/nameSpace`;
        let data  = await getDataWithUrl(url);
        this.namespaces = data.data.data;
    },

    getSetName() {
      getSetNameAerospike().then(response => {
        this.setNames = response.data.data;
      })
    },

    onFileChanged(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
        this.readFile(files[0]);
    },


    async onNamespaceChange(){
      let nameSpace = this.form.namespace;
      let Baseurl = `${process.env.VUE_APP_AEROSPIKE}/setname/${nameSpace}`
      let data  = await getDataWithUrl(Baseurl);
      this.setnames = data.data.data;
    },

    async onSubmit() {
      let namespace = this.form.namespace;
      let setname = this.form.setname;
      let bin = this.form.bin;
      let new_setname = this.form.new_setname;

      if(new_setname != "") {
        setname = new_setname;
      }

      let result = await addDataAerospike(namespace, setname, "key1", bin, this.form.value);
      if(result.data.code == "200") {
          this.$message('submit!')
          this.$router.push('/');
      } else {
        this.$message({
          message: 'Failed add Data',
          type: 'danger'
        })
      }
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },

    readFile(file) {
      let reader = new FileReader();
      reader.onload = e => {
        this.form.value = e.target.result;
      };
      reader.readAsText(file);
    }

  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

