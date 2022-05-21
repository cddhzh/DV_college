<template>
    <div>
        <el-header style=" background-color: #C23531; border-radius: 5px">
            <font color="#f0f8ff" style="position: relative; top: 30%;">专业分流建议</font>
        </el-header>
        <div style="height: 640px">
            <el-aside width="20%" style="display: inline-block; height: 100%; border-radius: 5px; background-color: rgba(242,234,191,0.15)">
                <div style="width: 99%" v-if="!uploaded">
                    <br>
                    <p style="text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;请导入文件：</p>
                    <el-upload
                        ref="upload"
                        action="/"
                        drag
                        :show-file-list="false"
                        :on-change="importExcel"
                        :auto-upload="false"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                    <br>
                    <el-button @click="Back" style="width: 100px; display: inline-block; background-color: #C23531">
                        <font color="#f0f8ff">上一页</font>
                    </el-button>
                </div>

                <div v-if="uploaded">
                    <br>
                    <el-card class="stuCard">
                        <!--                    <hr>-->
                        <p>个人信息</p>
<!--                        <hr>-->
                        <div style="width: 100%; height: 30%">
                            <div style="width: 50%; height: 100%; display: inline-block">
                                <img src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png">
                            </div>
                            <div style="width: 50%; height: 100%; display: inline-block">
                                <p style="position: relative; text-align: left; left: 5%;">姓&nbsp;名：{{ stu.name }}</p>
                                <div style="position: relative; text-align: left; left: 5%">学院名：</div>
                                <div style="position: relative; text-align: left; left: 5%">{{ stu.academy }}</div>
                                <br>
                            </div>
                        </div>
                        <div style="width: 100%; height: 70%">
                            <!--                        <hr>-->
                            <p>成绩单</p>
<!--                            <hr>-->
                            <div v-for="subject in this.stu.subjects">
                                <!--                            <el-tag>{{subject.name}}：{{subject.score}}</el-tag>-->
                                {{ subject.name }}：{{ subject.score }}
                            </div>
                        </div>
                    </el-card>
                    <br>
                    <el-upload
                        style="display: inline-block"
                        ref="upload"
                        action="/"
                        :show-file-list="false"
                        :on-change="importExcel"
                        :auto-upload="false">
                        <el-button style="width: 100px; background-color: #C23531">
                            <font color="#f0f8ff">重新导入</font>
                        </el-button>
                    </el-upload>
                    &nbsp;
                    <el-button @click="Back" style="width: 100px; display: inline-block; background-color: #C23531">
                        <font color="#f0f8ff">上一页</font>
                    </el-button>
                    <br><br>
                    <el-button style="width: 30%; background-color: #f15555">
                        <font color="#f0f8ff">期望排名</font>
                    </el-button>
                    &nbsp;
                    <el-input v-model="rate" style="width: 55%; height: 20px" placeholder="请输入你期望的排名（单位为百分比）">
                    </el-input>
                    <br><br>
                    <el-button @click="getRates" style="width: 100px; background-color: #C23531">
                        <font color="#f0f8ff">确认</font>
                    </el-button>
                </div>
            </el-aside>
            <StuRadar v-if="fresh" style="width: 39%; height: 100%; display: inline-block"></StuRadar>
            <StuPolarBar v-if="fresh" style="width: 40%; height: 100%; display: inline-block"></StuPolarBar>
        </div>
    </div>
</template>

<script>
import XLSX from "xlsx";
import StuRadar from "@/components/StuRadar";
import RingGauge from "@/components/RingGauge";
import StuPolarBar from "@/components/StuPolarBar";

export default {
    name: "FourthPage",
    components: {StuPolarBar, RingGauge, StuRadar},
    data() {
        return {
            fresh: true,
            uploaded: false,
            stu: {
                name: null,
                subjects: [],
                academy: null
            },
            subjects: [],
            tableData: [],
            majors: [],
            now_Data: [],
            rates: [],
            all_data: JSON.parse(sessionStorage.getItem("data")),
            rate: 10
        }
    },
    created() {
        if (JSON.parse(sessionStorage.getItem("stu_data")) != null) {
            this.stu = JSON.parse(sessionStorage.getItem("stu_data"));
            this.uploaded = true
            this.getMajor()
            this.getRates()
        }
    },
    methods: {
        Back() {
            window.history.go(-1);
        },
        importExcel(file) {
            const _this = this
            // let file = file.files[0] // 使用传统的input方法需要加上这一步
            const types = file.name.split('.')[1]
            const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
            if (!fileType) {
                this.$message('格式错误！请重新选择')
                return
            }
            this.file2Xce(file).then(tabJson => {
                if (tabJson && tabJson.length > 0) {
                    this.xlsxJson = tabJson
                    // console.log(this.xlsxJson)
                    _this.tableData = this.xlsxJson[0].sheet
                    // console.log(_this.tableData[0])
                    _this.stu.name = _this.tableData[0].姓名
                    _this.stu.academy = _this.tableData[0].学院
                    _this.stu.subjects = []
                    _this.subjects = []
                    for (const Key in _this.tableData[0]) {
                        const subject = {}
                        if (Key != '姓名' && Key != '学院') {
                            _this.subjects.push(Key)
                            subject.name = Key
                            subject.score = _this.tableData[0][Key]
                            // console.log(subject)
                            _this.stu.subjects.push(subject)
                        }
                    }
                    this.getMajor()
                    this.getRates()
                    // console.log(_this.stu)
                    // console.log(_this.subjects)
                    sessionStorage.setItem("stu_data", JSON.stringify(_this.stu))
                    sessionStorage.setItem("stu_subjects", JSON.stringify(_this.subjects))
                    _this.uploaded = true
                    this.fresh = false
                    this.$nextTick(() => {
                        this.fresh = true
                    })
                }
            })
        },
        file2Xce(file) {
            return new Promise(function (resolve, reject) {
                const reader = new FileReader()
                reader.onload = function (e) {
                    const data = e.target.result
                    this.wb = XLSX.read(data, {
                        type: 'binary'
                    })
                    const result = []
                    this.wb.SheetNames.forEach((sheetName) => {
                        result.push({
                            sheetName: sheetName,
                            sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
                        })
                    })
                    resolve(result)
                }
                reader.readAsBinaryString(file.raw)
                // reader.readAsBinaryString(file) // 传统input方法
            })
        },
        getMajor(){
            this.majors = []
            const _this = this
            const new_Data = _this.all_data.filter(function (e) {
                return e.学院 == _this.stu.academy
            });
            for (const Key in new_Data) {
                let flag = true
                for (let i = 0; i < _this.majors.length; i++){
                    if(new_Data[Key].专业 == _this.majors[i]) flag = false
                }
                if(flag) _this.majors.push(new_Data[Key].专业)
            }
            sessionStorage.setItem('stu_majors', JSON.stringify(this.majors))
        },
        getRates(){
            this.rates = []
            const _this = this
            this.now_Data = this.all_data.filter(function (e) {
                return e.学院 == _this.stu.academy
            })
            this.now_Data.sort(function (a, b) {
                return b.加权平均分 - a.加权平均分
            })
            const subjects_rates = []
            for (const index in this.stu.subjects) {
                const subject = this.stu.subjects[index]
                const score = subject.score - subject.score % 10;
                const subject_rates = []
                for (let i = 0; i < this.majors.length; i++) {
                    //筛选出所选学科成绩在所选分数段内的某个专业的学生
                    const a = this.now_Data.filter(function (e) {
                        return e.专业 == _this.majors[i] && e[subject.name] >= score && e[subject.name] < score + 10
                    })
                    let x = a.length //分母
                    //筛选出该专业前百分之rate的中所选学科成绩符合分数段的人
                    //所以需要先取出该专业的所有学生
                    const b = this.now_Data.filter(function (e) {
                        return e.专业 == _this.majors[i]
                    })
                    //筛选该专业学生排名前百分之rate中单科成绩符合要求的学生
                    const c = b.slice(0, b.length * this.rate /100).filter(function (e) {
                        return e[subject.name] >= score && e[subject.name] < score + 10
                    })
                    let y = c.length
                    subject_rates.push((y/x).toFixed(2))
                }
                subjects_rates.push(subject_rates)
            }
            for (let i = 0; i < this.majors.length; i++) {
                let subject_rate = 0
                for (let j = 0; j < subjects_rates.length; j++) {
                    subject_rate += parseFloat(subjects_rates[j][i])
                }
                this.rates.push((subject_rate/subjects_rates.length).toFixed(4))
            }
            // console.log(this.rates)
            sessionStorage.setItem('stu_rates', JSON.stringify(this.rates))
            this.fresh = false
            this.$nextTick(() => {
                this.fresh = true
            })
        },
    }
}
</script>

<style scoped>
/deep/ .el-upload-dragger {
    right: 23%;
    position: relative;
    width: 150%;
}

.stuCard {
    position: relative;
    width: 90%;
    left: 5%;
    top: 10%;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.4);
}
</style>