<template>
    <div ref="bar" style="width: 100%; height: 100%"></div>
</template>

<script>
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
            const bar = this.$echarts.init(this.$refs.bar);
            const option = {
                title: {
                    text: '折线图'
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
                        show: true,
                        yAxisIndex: 0,
                        filterMode: 'none',
                        width: 30,
                        height: '80%',
                        showDataShadow: false,
                        left: '93%'
                    }
                ],
                series: [
                    {
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

</style>