<template>
    <el-container>
        <el-aside width="20%">
            <el-header style="background-color: #C23531;">
                <font color="#f0f8ff" style="position: relative; top: 30%;">数据筛选</font>
            </el-header>
            <div style="width: 99%">
                <br>
                <el-upload
                    ref="upload"
                    action="/"
                    drag
                    :show-file-list="false"
                    :on-change="importExcel"
                    :auto-upload="false"
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
<!--                    <el-button-->
<!--                        slot="trigger"-->
<!--                        icon="el-icon-upload"-->
<!--                        size="small"-->
<!--                        type="primary">-->
<!--                        上传文件-->
<!--                    </el-button>-->
                </el-upload>
                <br>
                <el-tag v-if="this.upSuccess">文件名：{{this.filename}}</el-tag>
                <br>
                <el-select style="width: 90%;" v-model="academy" placeholder="请选择学院" @change="getMajor">
                    <el-option
                        v-for="academy in academys"
                        :key="academy"
                        :label="academy"
                        :value="academy">
                    </el-option>
                </el-select>
                <br><br>
                <el-select style="width: 90%; height: 20px" v-model="major" placeholder="请选择专业" @change="getSubject">
                    <el-option
                        v-for="major in majors"
                        :key="major"
                        :label="major"
                        :value="major">
                    </el-option>
                </el-select>
                <br><br>
                <el-button @click="toPage" style="width: 100px; background-color: #C23531">
                    <font color="#f0f8ff">确认</font>
                </el-button>
            </div>
        </el-aside>
        &nbsp;
        <div style="width: 80%">
            <el-header style="background-color: #C23531;">
                <font color="#f0f8ff" style="position: relative; top: 30%;">请选择学院与专业进行实验</font>
            </el-header>
            <div>
                <el-table
                    :data="tableData.slice((currentPage-1)*pagesize, currentPage*pagesize)"
                    height="590px"
                    :cell-style="cellStyle"
                    :header-cell-style="headercellStyle"
                    border
                    stripe
                    class="table"
                    style="width: 100%; font-size: 10px;">
                    <el-table-column
                        :fixed="index==0"
                        min-width="180px"
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
                    :page-sizes="[15, 20, 30, 40]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </el-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

import XLSX from "xlsx";

export default {
    name: "Home",
    data(){
        return {
            tableData: [],
            currentPage: 1,
            pagesize: 15,
            cellStyle: {
                'border-bottom': '1px solid',
                'border-right': '1px solid',
            },
            headercellStyle: {
                'border-bottom': '1px solid',
                'border-right': '1px solid',
            },
            total: null,
            academys: null,
            academy: null,
            majors: null,
            major: null,
            subjects: null,
            upSuccess: false,
            filename: null,
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
                    const academy_set = new Set([])
                    const province_set = new Set([])
                    const major_set = new Set()
                    for (const Key in _this.tableData) {
                        academy_set.add(_this.tableData[Key].学院)
                        province_set.add(_this.tableData[Key].省份)
                    }
                    _this.academys = academy_set
                    sessionStorage.setItem("academys", JSON.stringify(Array.from(academy_set)))
                    sessionStorage.setItem("provinces", JSON.stringify(Array.from(province_set)))
                    _this.upSuccess = true
                    _this.filename = file.name
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
            for (const Key in new_Data) {
                let flag = true
                for (let i = 0; i < _this.majors.length; i++){
                    if(new_Data[Key].专业 == _this.majors[i]) flag = false
                }
                if(flag) _this.majors.push(new_Data[Key].专业)
            }
            sessionStorage.setItem('majors', JSON.stringify(this.majors))
            this.major = this.majors[0]
            this.getSubject()
        },
        getSubject(){
            this.subjects = []
            const _this = this
            var new_Data = _this.tableData.filter(function (e) {
                return e.专业 == _this.major
            })
            let i = 0
            for (const newDataKey in new_Data[0]) {
                if(i >= 4 && newDataKey != '加权平均分') {
                    _this.subjects.push(newDataKey)
                }
                i = i + 1
            }
        },
        toPage(){
            if(this.academy == null){
                alert("请选择学院")
            }
            else{
                this.$router.push('/firstPage?major='+this.major+'&academy='+this.academy)
            }
        }
    },
    created() {
        if(JSON.parse(sessionStorage.getItem("data")) != null){
            this.tableData = JSON.parse(sessionStorage.getItem("data"))
            this.total = this.tableData.length
        }
        if(JSON.parse(sessionStorage.getItem("academys")) != null){
            this.academys = JSON.parse(sessionStorage.getItem("academys"))
        }
    }
}
</script>

<style scoped>
/deep/.el-upload-dragger{
    width: 250px;
}
</style>
