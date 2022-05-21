<template>
    <div class="divStyle" ref="chart"></div>
</template>

<script>
import theme from "@/assets/theme";

export default {
    name: "StuRadar",
    data(){
        return{
            data: [],
            x_data: [],
            stu_data: [],
            y_data: []
        }
    },
    created() {
        if(JSON.parse(sessionStorage.getItem("stu_subjects")) != null && JSON.parse(sessionStorage.getItem("stu_data")) != null){
            this.x_data = JSON.parse(sessionStorage.getItem("stu_subjects"))
            this.stu_data = JSON.parse(sessionStorage.getItem("stu_data")).subjects
        }
    },
    mounted() {
        if(this.x_data.length != 0){
            this.getData()
            this.setCharts()
        }
    },
    methods:{
        getData(){
            // console.log(this.stu_data)
            if(this.x_data.length != 0){
                for (let i = 0; i < this.x_data.length; i++) {
                    const d = {};
                    d.name = this.x_data[i]
                    d.max = 100
                    this.data.push(d)
                    this.y_data.push(this.stu_data[i].score)
                }
            }
            // console.log(this.y_data)
        },
        setCharts(){
            const chart = this.$echarts.init(this.$refs.chart, theme);
            const option = {
                title: {
                    text: '学生成绩雷达图',
                    left: 'center'
                },
                toolbox: {
                    show: true,
                    left: '0',
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                radar: {
                    // shape: 'circle',
                    indicator: this.data
                },
                tooltip: {
                    trigger: 'item',
                },
                series: [
                    {
                        name: '学生成绩雷达图',
                        type: 'radar',
                        data: [
                            {
                                value: this.y_data,
                            }
                        ],
                    }
                ]
            };
            chart.setOption(option)
        }
    }
}
</script>

<style scoped>
.divStyle{
    width: 100%;
    height: 100%;
    border:1px solid;
    border-radius: 5px;
}
</style>