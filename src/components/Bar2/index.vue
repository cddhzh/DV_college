<template>
    <div class="divStyle" ref="chart"></div>
</template>

<script>
import theme from "@/assets/theme";

export default {
    name: "Bar2",
    data(){
        return {
            x_data: JSON.parse(sessionStorage.getItem('provinces')),
            y_data: JSON.parse(sessionStorage.getItem('avgs'))
        }
    },
    mounted() {
        this.setCharts()
    },
    methods: {
        setCharts(){
            const chart = this.$echarts.init(this.$refs.chart, theme);
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
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: this.x_data
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