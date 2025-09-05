<script setup>
import { ref } from "vue";
import { useData } from "vitepress";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from "element-plus";
import { defaultPassword } from "../constants/passwords.ts";

// 通过 props 接收密码和信息
const props = defineProps({
  correctPassword: {
    type: String,
    required: true,
    default: defaultPassword
  },
  hint: {
    type: String,
    default: "输入密码以查看隐藏内容",
  },
});

const { frontmatter } = useData();

const correctPassword = props.correctPassword; // 正确的密码

const userPassword = ref(""); // 用户输入的密码
const showMessage = ref(false); // 控制是否显示信息

const checkPassword = () => {
  if (userPassword.value === correctPassword) {
    showMessage.value = true;
    ElMessage.success("密码正确！");
  } else {
    showMessage.value = false;
    ElMessage.error("密码错误，请重试！");
  }
};
</script>

<template>
  <el-form @submit.prevent="checkPassword">
    <el-form-item label="请输入密码">
      <el-input v-model="userPassword" type="password" placeholder="输入密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="checkPassword">提交</el-button>
    </el-form-item>
  </el-form>

  <div v-if="!showMessage" class="hint-box">
    {{ props.hint }}
  </div>

  <div v-if="showMessage">
    <slot></slot>
  </div>
</template>

<style scoped>
.hint-box {
  margin-top: 20px;
  padding: 10px;
  background: #fffbe6;
  border: 1px solid #ffcc00;
  border-radius: 5px;
  color: #b36b00;
  font-weight: bold;
  text-align: center;
}
</style>