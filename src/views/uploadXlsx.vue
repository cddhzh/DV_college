<template>
    <div>
        <el-container>
            <el-aside width="20%">
                <el-upload
                    ref="upload"
                    action="/"
                    :show-file-list="false"
                    :on-change="importExcel"
                    :auto-upload="false">
                    <el-button
                        slot="trigger"
                        icon="el-icon-upload"
                        size="small"
                        type="primary">
                        上传文件
                    </el-button>
                </el-upload>
                <el-select v-model="academy" placeholder="请选择学院" @change="getMajor">
                    <el-option
                        v-for="academy in academys"
                        :key="academy"
                        :label="academy"
                        :value="academy">
                    </el-option>
                </el-select>
                <el-select v-model="major" placeholder="请选择专业">
                    <el-option
                        v-for="major in majors"
                        :key="major"
                        :label="major"
                        :value="major">
                    </el-option>
                </el-select>
            </el-aside>
            <el-main style="width: 80%">
                <el-table
                    :data="tableData.slice((currentPage-1)*pagesize, currentPage*pagesize)"
                    height="770px"
                    :cell-style="cellStyle"
                    border
                    style="width: 100%">
                    <el-table-column
                        v-for="(key, item, index) in tableData[0]"
                        :key="index"
                        :prop="item"
                        :label="item">
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-main>
        </el-container>
    </div>
</template>

<script>

import XLSX from "xlsx";

export default {
    name: "uploadXlsx",
    data(){
        return {
            tableData: [],
            currentPage: 1,
            pagesize: 10,
            cellStyle: {
                height: '70px'
            },
            total: null,
            academys: [],
            academy: null,
            majors: [],
            major: null,
        }
    },
    methods:{
        handleSizeChange(val) {
            this.pagesize = val
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val
            console.log(`当前页: ${val}`);
        },
        importExcel(file) {
            const _this = this
            // let file = file.files[0] // 使用传统的input方法需要加上这一步
            const types = file.name.split('.')[1]
            const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
            if (!fileType) {
                this.$message('格式错误！请重新选择')
                return
            }
            this.file2Xce(file).then(tabJson => {
                if (tabJson && tabJson.length > 0) {
                    this.xlsxJson = tabJson
                    // console.log(this.xlsxJson)
                    _this.tableData = this.xlsxJson[0].sheet
                    sessionStorage.setItem("data", JSON.stringify(_this.tableData))
                    _this.total = _this.tableData.length
                    // for (const tabJsonKey in _this.tableData[0]) {
                    //     console.log(tabJsonKey)
                    //     console.log(_this.tableData[0][tabJsonKey])
                    // }
                    // xlsxJson就是解析出来的json数据,数据格式如下
                    // [
                    //   {
                    //     sheetName: sheet1
                    //     sheet: sheetData
                    //   }
                    // ]
                    // var new_Data = _this.tableData.filter(function (e) {
                    //     return e.专业 == '通信工程' && e.省份 == '福建'
                    // })
                    // console.log(new_Data)
                    var academys = new Set()
                    for (const Key in _this.tableData) {
                        let flag = true
                        for (let i = 0; i < _this.academys.length; i++){
                            if(_this.tableData[Key].学院 == _this.academys[i]) flag = false
                        }
                        if(flag) _this.academys.push(_this.tableData[Key].学院)
                    }
                }
            })
        },
        file2Xce(file) {
            return new Promise(function(resolve, reject) {
                const reader = new FileReader()
                reader.onload = function(e) {
                    const data = e.target.result
                    this.wb = XLSX.read(data, {
                        type: 'binary'
                    })
                    const result = []
                    this.wb.SheetNames.forEach((sheetName) => {
                        result.push({
                            sheetName: sheetName,
                            sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
                        })
                    })
                    resolve(result)
                }
                reader.readAsBinaryString(file.raw)
                // reader.readAsBinaryString(file) // 传统input方法
            })
        },
        getMajor(){
            this.majors = []
            const _this = this
            var new_Data = _this.tableData.filter(function (e) {
                return e.学院 == _this.academy
            })
            var data = JSON.parse(sessionStorage.getItem("data"))
            console.log(data)
            for (const Key in new_Data) {
                let flag = true
                for (let i = 0; i < _this.majors.length; i++){
                    if(new_Data[Key].专业 == _this.majors[i]) flag = false
                }
                if(flag) _this.majors.push(new_Data[Key].专业)
            }
            this.major = this.majors[0]
        }
    },
    created() {
        if(JSON.parse(sessionStorage.getItem("data")) != null){
            this.tableData = JSON.parse(sessionStorage.getItem("data"))
            this.total = this.tableData.length
        }
    }
}
</script>

<style scoped>

</style>