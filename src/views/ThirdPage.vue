<template>
    <div>
        <el-header style=" background-color: #C23531; border-radius: 5px">
            <font color="#f0f8ff" style="position: relative; top: 30%;">专业分流建议</font>
        </el-header>
        <div style="height: 640px">
            <el-aside width="20%" style="display: inline-block; height: 100%; border: 1px solid; border-radius: 5px; background-color: rgba(242,234,191,0.15)">
                <br>
                <el-select style="width: 90%;" v-model="academy" placeholder="请选择学院" @change="getMajor">
                    <el-option
                        v-for="academy in academys"
                        :key="academy"
                        :label="academy"
                        :value="academy">
                    </el-option>
                </el-select>
                <br><br>
<!--                <el-select style="width: 90%; height: 20px" v-model="major" placeholder="请选择专业" @change="getSubject">-->
<!--                    <el-option-->
<!--                        v-for="major in majors"-->
<!--                        :key="major"-->
<!--                        :label="major"-->
<!--                        :value="major">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--                <br><br>-->
                <el-select style="width: 90%; height: 20px" v-model="subject" placeholder="请选择学科">
                    <el-option
                        v-for="subject in subjects"
                        :key="subject"
                        :label="subject"
                        :value="subject">
                    </el-option>
                </el-select>
                <br><br>
                <el-button style="width: 30%; background-color: #f15555">
                    <font color="#f0f8ff">分数范围</font>
                </el-button>
                &nbsp;
                <el-select style="width: 55%; height: 20px" v-model="score" placeholder="请选择分数段">
                    <el-option
                        v-for="level in levels"
                        :key="level.key"
                        :label="level.value"
                        :value="level.key">
                    </el-option>
                </el-select>
                <br>
                <el-button style="width: 30%; background-color: #f15555">
                    <font color="#f0f8ff">期望排名</font>
                </el-button>
                &nbsp;
                <el-input v-model="rate" style="width: 55%; height: 20px" placeholder="请输入你期望的排名（单位为百分比）">
                </el-input>
                <br><br><br>
                <el-button @click="updateData" style="width: 100px; background-color: #C23531">
                    <font color="#f0f8ff">确认</font>
                </el-button>
            </el-aside>
            <PolarBar v-if="fresh" style="width: 40%; height: 100%; display: inline-block"></PolarBar>
            <Radar v-if="fresh" style="width: 39%; height: 100%; display: inline-block"></Radar>
        </div>
    </div>
</template>

<script>
import PolarBar from "@/components/PolarBar";
import Radar from "@/components/Radar";
export default {
    name: "ThirdPage",
    components: {Radar, PolarBar},
    data(){
        return{
            fresh: true,
            academys: JSON.parse(sessionStorage.getItem('academys')),
            majors: JSON.parse(sessionStorage.getItem('majors')),
            subjects: null,
            tableData : JSON.parse(sessionStorage.getItem("data")),
            academy: this.$route.query.academy,
            major: this.$route.query.major,
            subject: null,
            now_Data: null,
            rate: 10,
            levels: [
                {key: 60, value: '60-69'},{key: 70, value: '70-79'},{key: 80, value: '80-89'},{key: 90, value: '90-100'}
            ],
            score: 80,
            rates: []
        }
    },
    methods: {
        getMajor(){
            this.majors = []
            const _this = this
            var new_Data = _this.tableData.filter(function (e) {
                return e.学院 == _this.academy
            })
            for (const Key in new_Data) {
                let flag = true
                for (let i = 0; i < _this.majors.length; i++){
                    if(new_Data[Key].专业 == _this.majors[i]) flag = false
                }
                if(flag) _this.majors.push(new_Data[Key].专业)
            }
            sessionStorage.setItem('majors', JSON.stringify(this.majors))
            this.major = this.majors[0]
            this.getSubject()
        },
        getSubject(){
            this.subjects = []
            const _this = this
            var new_Data = _this.tableData.filter(function (e) {
                return e.专业 == _this.major
            })
            let i = 0
            for (const newDataKey in new_Data[0]) {
                if(i >= 4 && newDataKey != '加权平均分') {
                    _this.subjects.push(newDataKey)
                }
                i = i + 1
            }
            this.subject = this.subjects[0]
            sessionStorage.setItem('subjects', JSON.stringify(_this.subjects))
        },
        updateData(){
            this.rates = []
            const _this = this
            this.now_Data = this.tableData.filter(function (e) {
                return e.学院 == _this.academy
            })
            this.now_Data.sort(function (a, b) {
                return b.加权平均分 - a.加权平均分
            })
            for (let i = 0; i < this.majors.length; i++) {
                //筛选出所选学科成绩在所选分数段内的某个专业的学生
                const a = this.now_Data.filter(function (e) {
                    return e.专业 == _this.majors[i] && e[_this.subject] >= _this.score && e[_this.subject] < _this.score + 10
                })
                let x = a.length //分母
                //筛选出该专业前百分之rate的中所选学科成绩符合分数段的人
                //所以需要先取出该专业的所有学生
                const b = this.now_Data.filter(function (e) {
                    return e.专业 == _this.majors[i]
                })
                //筛选该专业学生排名前百分之rate中单科成绩符合要求的学生
                const c = b.slice(0, b.length * this.rate /100).filter(function (e) {
                    return e[_this.subject] >= _this.score && e[_this.subject] < _this.score + 10
                })
                let y = c.length
                this.rates.push((y/x).toFixed(2))
            }
            sessionStorage.setItem('rates', JSON.stringify(this.rates))
            this.fresh = false
            this.$nextTick(() => {
                this.fresh = true
            })
        }
    },
    created() {
        this.getMajor()
        this.getSubject()
        this.updateData()
    }
}
</script>

<style scoped>

</style>