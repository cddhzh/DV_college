<template>
    <div class="divStyle" ref="chart"></div>
</template>

<script>
import theme from "@/assets/theme";

export default {
    name: "PolarBar",
    data(){
        return {
            x_data: JSON.parse(sessionStorage.getItem('majors')),
            y_data: JSON.parse(sessionStorage.getItem('rates'))
        }
    },
    mounted() {
        this.setCharts()
    },
    methods:{
        setCharts(){
            const chart = this.$echarts.init(this.$refs.chart, theme);
            const option = {
                title: [
                    {
                        text: '单科成绩与专业发展关系',
                        left: 'center'
                    }
                ],
                polar: {
                    radius: [30, '80%']
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
                angleAxis: {
                    max: 1,
                    startAngle: 90
                },
                radiusAxis: {
                    type: 'category',
                    data: this.x_data
                },
                tooltip: {},
                series: {
                    type: 'bar',
                    data: this.y_data,
                    coordinateSystem: 'polar',
                    label: {
                        show: true,
                        position: 'middle',
                        formatter: '{b}: {c}'
                    }
                }
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