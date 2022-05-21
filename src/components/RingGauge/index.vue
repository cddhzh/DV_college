<template>
    <div class="divStyle" ref="chart"></div>
</template>

<script>
import theme from "@/assets/theme";

export default {
    name: "RingGauge",
    data(){
        return {
            majors: JSON.parse(sessionStorage.getItem('stu_majors')),
            rates: JSON.parse(sessionStorage.getItem('stu_rates')),
            gaugeData: []
        }
    },
    mounted() {
        this.getData()
        this.setCharts()
    },
    methods: {
        getData(){
            this.gaugeData = []
            for (let i = 0; i < this.majors.length; i++) {
                const item = {}
                item.name = this.majors[i]
                item.value = (this.rates[i] * 100).toFixed(2)
                this.gaugeData.push(item)
            }
            console.log(this.gaugeData)
        },
        setCharts() {
            const chart = this.$echarts.init(this.$refs.chart, theme);
            const option = {
                series: [
                    {
                        type: 'gauge',
                        startAngle: 90,
                        endAngle: -270,
                        radius: '90%',
                        pointer: {
                            show: false
                        },
                        progress: {
                            show: true,
                            overlap: false,
                            roundCap: true,
                            clip: false,
                            itemStyle: {
                                borderWidth: 1,
                                borderColor: '#464646'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                width: 100
                            }
                        },
                        splitLine: {
                            show: false,
                            distance: 0,
                            length: 20
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            distance: 50
                        },
                        data: this.gaugeData,
                        title: {
                            fontSize: 14
                        },
                        detail: {
                            width: 50,
                            height: 14,
                            fontSize: 14,
                            color: 'auto',
                            borderColor: 'auto',
                            borderRadius: 20,
                            borderWidth: 1,
                            formatter: '{value}%'
                        }
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