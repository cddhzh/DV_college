<template>
    <div>
        <el-header style=" background-color: #C23531; border-radius: 5px">
            <div style="position: relative; top: 10%">
<!--                <el-button type="danger">筛选</el-button>&nbsp;-->
                <el-select style="" v-model="academy" placeholder="请选择学院" @change="getMajor">
                    <el-option
                        v-for="academy in academys"
                        :key="academy"
                        :label="academy"
                        :value="academy">
                    </el-option>
                </el-select>&nbsp;
                <el-select style="" v-model="major" placeholder="请选择专业">
                    <el-option
                        v-for="major in majors"
                        :key="major"
                        :label="major"
                        :value="major">
                    </el-option>
                </el-select>&nbsp;
                <el-button @click="updateData" style="; background-color: #f15555" round>
                    <font color="#f0f8ff">确认</font>
                </el-button>&nbsp;
                <el-button @click="Back" style="; background-color: #f15555" round>
                    <font color="#f0f8ff">上一页</font>
                </el-button>
                <el-button @click="toPage" style="; background-color: #f15555" round>
                    <font color="#f0f8ff">下一页</font>
                </el-button>
            </div>
        </el-header>
        <div style="height: 640px">
            <Bar1 v-if="fresh" style="width: 30%; height: 55%; display: inline-block"></Bar1>
            <Map v-if="fresh" style="width: 40%; height: 55%; display: inline-block"></Map>
            <WordCloud v-if="fresh" ref="" style="width: 29%; height: 55%; display: inline-block"></WordCloud>
            <Line1 v-if="fresh" style="width: 50%; height: 45%; display: inline-block"></Line1>
            <Bar2 v-if="fresh" style="width: 49%; height: 45%; display: inline-block"></Bar2>
        </div>
    </div>
</template>

<script>
import Map from "@/components/Map";
import Bar1 from "@/components/Bar1";
import Wordcloud from "@/components/Word-cloud";
import WordCloud from "@/components/Word-cloud";
import Line1 from "@/components/Line1";
import Bar2 from "@/components/Bar2";
export default {
    name: "FirstPage",
    components: {Bar2, Line1, WordCloud, Bar1, Map},
    data(){
        return {
            fresh: true,
            academys: JSON.parse(sessionStorage.getItem('academys')),
            majors: null,
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
        Back(){
            window.history.go(-1);
        },
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
                avgs.push((sum/length).toFixed(2))
            }
            this.province_avg = avgs
            sessionStorage.setItem('avgs', JSON.stringify(avgs))
            this.fresh = false
            this.$nextTick(() => {
                this.fresh = true
            })
        },
        toPage(){
            this.$router.push('/secondPage?academy='+this.academy+'&major='+this.major)
        }
    },
    created() {
        this.getMajor()
        const _this = this
        this.now_Data = this.tableData.filter(function (e) {
            return e.专业 == _this.major
        })
        const province = JSON.parse(sessionStorage.getItem('provinces'))
        const avgs = []
        for (const provinceKey in province) {
            let sum = 0, length = 0
            this.now_Data.forEach(function (e) {
                if(e.省份 == province[provinceKey]){
                    sum += e.加权平均分
                    length += 1
                }
            })
            avgs.push((sum/length).toFixed(2))
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