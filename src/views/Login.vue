<template>
    <div>
        <vue-particles
            id="particles-js"
            color="#dedede"
            :particleOpacity="0.7"
            :particlesNumber="80"
            shapeType="circle"
            :particleSize="4"
            linesColor="#dedede"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
        >
        </vue-particles>
        <div id="login-js">
            <input
                autocomplete="off"
                type="text"
                id="input1"
                v-model="userName"
                placeholder="请输入用户名"
            />
            <input
                autocomplete="off"
                type="password"
                id="input2"
                v-model="userPwd"
                maxlength="20"
                placeholder="请输入密码"
            />
            <el-button
                type="primary"
                round
                id="loginBtn"
                @click="login">
                立即登录
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            userName: 'admin',
            userPwd: '123456',
        }
    },
    methods: {
        login() {
            if(this.userName == 'admin' && this.userPwd == '123456'){
                alert("登陆成功！")
                this.$router.push('/home')
            }
            else {
                alert("账号或密码错误")
            }
        }
    }
}
</script>

<style scoped>
#particles-js {
    width: 99%;
    height: calc(98%);
    position: absolute;
    background-color: rgba(242,234,191,0.15);
    /*background: url("../assets/background.jpg");*/
    background-size: cover;
}

#login-js {
    border: 1px solid;
    border-radius: 10px;
    position: absolute;
    left: 30%;
    top: 20%;
    width: 600px;
    height: 400px;
    background: url("../assets/login.png");
    background-size: cover;
}

#input1 {
    width: 150px;
    height: 20px;
    position: absolute;
    left: 67%;
    top: 40%;
    border: none;
    font-size: 20px;
}

#input2 {
    width: 150px;
    height: 20px;
    position: absolute;
    left: 67%;
    top: 51%;
    border: none;
    font-size: 20px;
}

#loginBtn {
    position: absolute;
    left: 60%;
    top: 70%;
    width: 210px;
    height: 35px;
}
</style>