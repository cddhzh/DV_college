<template>
    <div>
        <el-header>
            <el-select style="" v-model="academy" placeholder="请选择学院" @change="getMajor">
                <el-option
                    v-for="academy in academys"
                    :key="academy"
                    :label="academy"
                    :value="academy">
                </el-option>
            </el-select>
            <el-select style="" v-model="major" placeholder="请选择专业" @change="getSubject">
                <el-option
                    v-for="major in majors"
                    :key="major"
                    :label="major"
                    :value="major">
                </el-option>
            </el-select>
            <el-button @click="updateData" style="; background-color: #C23531">
                <font color="#f0f8ff">确认</font>
            </el-button>
        </el-header>
        <div style="height: 640px">
            <Bar1 v-if="fresh" style="width: 29%; height: 55%; display: inline-block"></Bar1>
            &nbsp;
            <div ref="" style="width: 40%; height: 55%; background-color: #42b983; display: inline-block"></div>
            &nbsp;
            <div ref="" style="width: 29%; height: 55%; background-color: #42b983; display: inline-block"></div>
            <div ref="" style="width: 49%; height: 45%; background-color: #42b983; display: inline-block"></div>
            &nbsp;
            <div ref="" style="width: 49%; height: 45%; background-color: #42b983; display: inline-block"></div>
        </div>
    </div>
</template>

<script>
import Map from "@/components/Map";
import Bar1 from "@/components/Bar1";
export default {
    name: "FirstPage",
    components: {Bar1, Map},
    data(){
        return {
            fresh: true,
            academys: JSON.parse(sessionStorage.getItem('academys')),
            majors: JSON.parse(sessionStorage.getItem('majors')),
            subjects: null,
            tableData : JSON.parse(sessionStorage.getItem("data")),
            academy: this.$route.query.academy,
            major: this.$route.query.major,
            now_Data: null,
            province_avg: null,
            provinces: JSON.parse(sessionStorage.getItem("provinces"))
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
        },
        updateData() {
            const _this = this
            //筛选出某个专业的所有成绩
            this.now_Data = this.tableData.filter(function (e) {
                return e.专业 == _this.major
            })
            //按省份分类计算平均值
            const avgs = []
            for (const provinceKey in this.provinces) {
                let sum = 0, length = 0
                this.now_Data.forEach(function (e) {
                    if(e.省份 == _this.provinces[provinceKey]){
                        sum += e.加权平均分
                        length += 1
                    }
                })
                avgs.push(sum/length)
            }
            this.province_avg = avgs
            sessionStorage.setItem('avgs', JSON.stringify(avgs))
            this.fresh = false
            this.$nextTick(() => {
                this.fresh = true
            })
        }
    },
    created() {
        const _this = this
        this.now_Data = this.tableData.filter(function (e) {
            return e.专业 == _this.major
        })
        const province = JSON.parse(sessionStorage.getItem('provinces'))
        const avgs = []
        for (const provinceKey in province) {
            let sum = 0, length = 0
            this.tableData.forEach(function (e) {
                if(e.省份 == province[provinceKey]){
                    sum += e.加权平均分
                    length += 1
                }
            })
            avgs.push(sum/length)
        }
        this.province_avg = avgs
        sessionStorage.setItem('avgs', JSON.stringify(avgs))
    },
    mounted() {

    }
}
</script>

<style scoped>

</style>