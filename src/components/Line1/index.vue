<template>
    <div class="divStyle" ref="chart"></div>
</template>

<script>
import theme from "@/assets/theme";

export default {
    name: "Line1",
    data(){
        return {
            x_data: JSON.parse(sessionStorage.getItem('provinces')),
            y_data: JSON.parse(sessionStorage.getItem('avgs'))
        }
    },
    methods: {
        setCharts(){
            const chart = this.$echarts.init(this.$refs.chart, theme);
            const option = {
                // Make gradient line here
                visualMap: [
                    {
                        show: false,
                        type: 'continuous',
                        seriesIndex: 0,
                        min: 60,
                        max: 100
                    }
                ],
                title: [
                    {
                        left: 'center',
                        text: '各省加权平均分情况'
                    }
                ],
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: [
                    {
                        data: this.x_data
                    }
                ],
                yAxis: [
                    {}
                ],
                dataZoom: [
                    {
                        type: 'inside'
                    },
                    {
                        type: 'inside'
                    },
                    {
                        show: true,
                        yAxisIndex: 0,
                        filterMode: 'none',
                        width: 30,
                        showDataShadow: false,
                        left: '93%'
                    }
                ],
                series: [
                    {
                        name: '加权平均成绩',
                        type: 'line',
                        showSymbol: false,
                        data: this.y_data
                    }
                ]
            };
            chart.setOption(option)
        }
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