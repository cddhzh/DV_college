<template>
    <div class="divStyle" ref="chart"></div>
</template>

<script>
import theme from "@/assets/theme";

export default {
    name: "Radar",
    data(){
        return {
            x_data: JSON.parse(sessionStorage.getItem('majors')),
            y_data: JSON.parse(sessionStorage.getItem('rates')),
            data: []
        }
    },
    mounted() {
        this.getData()
        this.setCharts()
    },
    methods:{
        getData(){
            for (let i = 0; i < this.x_data.length; i++) {
                const d = {};
                d.name = this.x_data[i]
                d.max = 1
                this.data.push(d)
            }
        },
        setCharts(){
            const chart = this.$echarts.init(this.$refs.chart, theme);
            const option = {
                title: {
                    text: '单科成绩与专业发展关系雷达图',
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
                        name: '单科成绩与专业发展关系雷达图',
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