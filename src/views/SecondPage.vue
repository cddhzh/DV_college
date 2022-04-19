<template>
    <div>
        <el-header style=" background-color: #C23531; border-radius: 5px">
            <font color="#f0f8ff" style="position: relative; top: 30%;">某分数段学生在各省份分布情况</font>
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
                <el-select style="width: 90%; height: 20px" v-model="major" placeholder="请选择专业">
                    <el-option
                        v-for="major in majors"
                        :key="major"
                        :label="major"
                        :value="major">
                    </el-option>
                </el-select>
                <br><br>
                <el-select style="width: 90%; height: 20px" v-model="score" placeholder="请选择分数段">
                    <el-option
                        v-for="level in levels"
                        :key="level.key"
                        :label="level.value"
                        :value="level.key">
                    </el-option>
                </el-select>
                <br><br>
                <el-button @click="updateData" style="width: 100px; background-color: #C23531">
                    <font color="#f0f8ff">确认</font>
                </el-button>
                <br><br>
                <el-button @click="toPage" style="width: 100px; background-color: #C23531">
                    <font color="#f0f8ff">下一页</font>
                </el-button>
            </el-aside>
            <Pie v-if="fresh" style="width: 79%; height: 100%; display: inline-block"></Pie>
        </div>
    </div>
</template>

<script>
import Pie from "@/components/Pie";
export default {
    name: "SecondPage",
    components: {Pie},
    data(){
        return{
            fresh: true,
            academys: JSON.parse(sessionStorage.getItem('academys')),
            majors: JSON.parse(sessionStorage.getItem('majors')),
            subjects: null,
            tableData : JSON.parse(sessionStorage.getItem("data")),
            academy: this.$route.query.academy,
            major: this.$route.query.major,
            now_Data: null,
            province_avg: null,
            provinces: JSON.parse(sessionStorage.getItem("provinces")),
            levels: [
                {key: 60, value: '60-69'},{key: 70, value: '70-79'},{key: 80, value: '80-89'},{key: 90, value: '90-100'}
            ],
            score: 60,
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
            this.major = this.majors[0]
            //this.getSubject()
        },
        updateData(){
            const _this = this
            //筛选出某个专业在所选分数段的所有成绩
            this.now_Data = this.tableData.filter(function (e) {
                return e.专业 == _this.major && e.加权平均分 >= _this.score && e.加权平均分 < _this.score + 10
            })
            //统计每个省份在选择分数段内的占比
            const cnts = []
            for (const provinceKey in this.provinces) {
                let cnt = 0
                this.now_Data.forEach(function (e) {
                    if(e.省份 == _this.provinces[provinceKey]){
                        cnt += 1
                    }
                })
                cnts.push(cnt)
            }
            sessionStorage.setItem('proportion',JSON.stringify(cnts))
            this.fresh = false
            this.$nextTick(() => {
                this.fresh = true
            })
        },
        toPage(){
            this.$router.push('/thirdPage?academy='+this.academy+'&major='+this.major)
        }
    },
    created() {
        this.getMajor()
        this.updateData()
    }
}
</script>

<style scoped>

</style>