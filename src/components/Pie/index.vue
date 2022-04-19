<template>
    <div ref="chart" class="divStyle"></div>
</template>

<script>
import theme from "@/assets/theme";

export default {
    name: "Pie",
    data(){
        return{
            provinces: JSON.parse(sessionStorage.getItem("provinces")),
            proportion: JSON.parse(sessionStorage.getItem('proportion')),
            data: [],
        }
    },
    mounted() {
        this.getData()
        this.setCharts()
    },
    methods:{
        getData(){
            for (let i = 0; i < this.provinces.length; i++) {
                const p = {}
                p.name = this.provinces[i]
                p.value = this.proportion[i]
                this.data.push(p)
            }
        },
        setCharts(){
            const chart = this.$echarts.init(this.$refs.chart, theme);
            const option = {
                title: {
                    text: '各省份在该分数段下占比',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
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
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: this.provinces
                },
                series: [
                    {
                        name: '该分数段各省份人数',
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: this.data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            chart.setOption(option)
        }
    },
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