<template>
    <div class="divStyle" ref="bar"></div>
</template>

<script>
import theme from "@/assets/theme";

export default {
    name: "Bar1",
    data(){
        return{
            x_data: JSON.parse(sessionStorage.getItem('provinces')),
            y_data: JSON.parse(sessionStorage.getItem('avgs'))
        }
    },
    methods:{
        setCharts(){
            const bar = this.$echarts.init(this.$refs.bar, theme);
            const option = {
                title: {
                    text: '柱状图'
                },
                legend: {
                    data : ['加权平均成绩']
                },
                tooltip: {
                    trigger: 'axis',
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.x_data
                },
                yAxis: {
                    type: 'value'
                },
                dataZoom: [
                    {
                        type: 'inside'
                    },
                    {
                        type: 'inside'
                    },
                    {
                    },
                    {
                        show: true,
                        yAxisIndex: 0,
                        filterMode: 'none',
                        width: 30,
                        showDataShadow: true,
                        left: '91%'
                    }
                ],
                series: [
                    {
                        name: '加权平均成绩',
                        data: this.y_data,
                        type: 'bar'
                    }
                ]
            };
            bar.setOption(option)
        }
    },
    created() {

    },
    mounted() {
        this.setCharts()
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