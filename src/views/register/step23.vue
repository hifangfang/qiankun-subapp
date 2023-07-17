<template>
    <div class="step23">
       <div class="one">
         <img src="../../assets/images/loginPage/personal.png">
         <div class="mt10">个人用户注册</div>
       </div>
          <div class="two">
             <el-form @submit.native.prevent  :model="personregisterForm" :rules="personregisterFormrules"  ref="personregisterForm" label-width="100px" class="demo-ruleForm">
               <h4 class="subtit">用户信息</h4>
               <el-form-item label="用户名"  prop="username">
                 <div class="inputbig">
                   <el-input class="name-input"  v-model="personregisterForm.username" maxlength="50" show-word-limit ></el-input>
                   <span class="tips">只能包含汉字，小写字母和数字</span>
                 </div>
               </el-form-item>
               <el-form-item label="密码"  prop="password1">
                 <div class="inputbig">
                  <el-input type="password" class="name-input" v-model="personregisterForm.password1" ></el-input>
                   <span class="tips" >{{passWordCheckKey}}</span>
                 </div>
               </el-form-item>
               <el-form-item label="确认密码"  prop="password2">
                 <div class="inputbig">
                  <el-input type="password" class="name-input" v-model="personregisterForm.password2" placeholder="请再次输入密码"  ></el-input>
                 </div>
               </el-form-item>
            <h4 class="subtitmt30">个人信息</h4>
              <el-form-item label="姓名"  prop="staffName">
                <div class="inputbig">
                  <el-input class="name-input" v-model="personregisterForm.staffName" placeholder="请输入姓名" ></el-input>
                </div>
               </el-form-item>
              <el-form-item label="证件类型" prop="certificatetype">
                <div class="selectsmall">
                 <el-select class="qiye-select" v-model="personregisterForm.certificatetype">
                   <el-option
                   v-for="(item,index) in documenttype"
                   :key="index"
                   :label="item.name"
                   :value="item.enumValue"
                   ></el-option>
                 </el-select>
                </div>
              </el-form-item>
               <el-form-item label="证件号码"  prop="certificatecode">
                 <div class="inputbig">
                  <el-input class="name-input" v-model="personregisterForm.certificatecode" placeholder="请输入证件号码" ></el-input>
                 </div>
               </el-form-item>
               <el-form-item label="所属区域" prop="area" >
                <div class="selectmore">
                  <el-select
                  class="quyu-input"
                  v-model="personregisterForm.province"
                  placeholder="省"
                  @change="getcitydata"
                  >
                   <el-option
                   v-for="(item,index) in provinces"
                   :key="index"
                   :label="item.name"
                   :value="item.value"
                   ></el-option>

                 </el-select>
                 <el-select
                 class="quyu-input"
                 v-model="personregisterForm.city"
                 placeholder="市"
                 @change="getcountrydata"
                 >
                   <el-option
                    v-for="(item,index) in city"
                   :key="index"
                   :label="item.name"
                   :value="item.value"
                   ></el-option>

                 </el-select>
                 <el-select class="quyu-input" v-model="personregisterForm.county" placeholder="区县">
                   <el-option
                    v-for="(item,index) in country"
                   :key="index"
                   :label="item.name"
                   :value="item.value"
                   ></el-option>
                 </el-select>
                </div>
              </el-form-item>
              <el-form-item label="手机号码"  prop="telephone">
                <div class="inputbig">
                  <el-input class="name-input" v-model="personregisterForm.telephone" placeholder="请输入手机号码" ></el-input>
                </div>
               </el-form-item>
               <el-form-item >
                 <div class="inputbig clause">
                   <el-checkbox v-model="checked"></el-checkbox>
                   <a href="javascript:void(0);" @click="agreeChecked">{{hadRead?'我已阅读并同意相关服务条款和隐私政策':'请阅读并同意相关服务条款和隐私政策'}}</a>
                 </div>
               </el-form-item>
              <div class="backbtn">
                <button class="stepbtn"  @click="send"  >上一步</button>
                <button class="stepbtn"   @click="registerbtn('personregisterForm')" >立即注册</button>
              </div>
            </el-form>
          </div>

      <el-dialog v-if="agreeDialogVisible" :visible.sync="agreeDialogVisible" width="70%" center>
        <serviceTerms></serviceTerms>
        <span slot="footer" class="dialog-footer">
<!--          <el-button @click="centerDialogVisible = false">取 消</el-button>-->
          <el-button size="mini" type="primary" @click="agreeDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch, Prop} from 'vue-property-decorator';
import {RegisterApi} from "@/api/base/module/register-api";
import {PersonRegisterForm,CipherRequest}  from "@/api/base/model/register-model"
import bus from '@/utils/js/bus';
import { setMaxDigits,biFromHex } from "../../utils/js/BigInt.js"
import { RSAKeyPair, encryptedString } from "../../utils/js/RSA.js"
import {IdentityApi} from "@/api/identity/module/identity-api";
import serviceTerms from "@/views/register/serviceTerms.vue";
import {DictionaryApi} from "@/api/base/module/Dictionary-api";
 @Component({
    'name':'step23',
   components: {
     serviceTerms
   },
  })

export default class step23 extends Vue{
  documenttype:any =[]
  provinces:any =[]
  city:any =[]
  country:any =[]
  flag:any =false
  personregisterForm: PersonRegisterForm = {} as PersonRegisterForm;
  cipherRequest: CipherRequest = {} as CipherRequest;
  passWordCheckKey='';
   agreeDialogVisible=false;
   hadRead=false;
  //身份证
  CheckIdentityCode = function(code) {
			// code = $.trim(code);
      let cityArr = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆" }//, 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
			if (code.length == 0 || code == null || code == undefined) {
				return false;
			}
			var info = "",
			reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i;
			if (!reg.test(code)) {
				return false;
			}
			code = code.replace(/x$/i, "a");
			if (cityArr[parseInt(code.substr(0, 2))] == null) {
				return false;
			}
			const birthDay = code.substr(6, 4) + "-" + Number(code.substr(10, 2)) + "-" + Number(code.substr(12, 2));
			var d = new Date(birthDay.replace(/-/g, "/"));
			if (birthDay != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
				return false;
			}
			return true;
		}
  personregisterFormrules={
    username:[
      {validator:(rule, value, callback) => {
        if (this.personregisterForm.username === ''||this.personregisterForm.username === undefined) {
         return callback(new Error('请输入用户名'));
        } else {
          this.getpersonusernameExist(this.personregisterForm.username).then(res=>{
           const result=res
            if (result) {
               callback(new Error('用户名已存在'));
             }else{
                callback()
             }
           }).catch((err)=>{
             callback()
           })
        }
      },required: true, trigger: 'blur' },
      {validator:(rule, value, callback) => {
          if (value.length==50) {
            callback(new Error('用户名最大长度为50位'));
          }else{
            callback()
          }
        },required: true, trigger: 'change'  }
    ],
    password1:[
      {validator:async(rule, value, callback) => {
        if (value === ''||value === undefined) {
          callback(new Error('请输入密码'));
        } else {
          const res=await IdentityApi.pwdCheck()
          let ff = value.match(res.rev);
          if(ff==null){
            callback(new Error(res.key));
          }
          if (this.personregisterForm.password2 !== '') {
            (this.$refs.personregisterForm as any).validateField('password2');
          }
          callback();
        }
      } ,trigger: 'blur',required: true}
    ],
    password2:[
      {validator:(rule, value, callback) => {
        if (value === ''||value === undefined) {
          callback(new Error('请输入密码'));
        } else if (value !== this.personregisterForm.password1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },trigger: 'blur',required: true}
    ],
    staffName:[
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    certificatecode:[
      {validator:(rule, value, callback) => {
        if (value === ''||value === undefined) {
          callback(new Error('请输入证件号码!'));
        } else {
          if(this.personregisterForm.certificatetype == '1'){
           if(!this.CheckIdentityCode(value)){
            callback(new Error('请正确填写您的身份证'));
          }else {
          this.getDepartmentIdNumExist(this.personregisterForm.certificatetype,this.personregisterForm.certificatecode).then(res=>{
           const result=res
             if (result) {
               callback(new Error('证件号码已存在'));
             }else{
                callback()
             }
           }).catch((err)=>{
                callback()
           }
           )
          }
        }else if(this.personregisterForm.certificatetype == '2') {
          let iscar=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/;
           if (iscar.test(value)) {
            this.getDepartmentIdNumExist(this.personregisterForm.certificatetype,this.personregisterForm.certificatecode).then(res=>{
           const result=res
             if (result) {
               callback(new Error('证件号码已存在'));
             }else{
                callback()
             }
           }).catch((err)=>{
                callback()
           }
           )
          }else {
             callback(new Error('请正确填写您的驾驶证'))
          }
        }else {
           let isTrue=/^(P\d{7}|G\d{7,8}|TH\d{7,8}|S\d{7,8}|A\d{7,8}|L\d{7,8}|\d{9}|D\d+|1[4,5]\d{7})$/;
           if (isTrue.test(value)) {
             this.getDepartmentIdNumExist(this.personregisterForm.certificatetype,this.personregisterForm.certificatecode).then(res=>{
           const result=res
             if (result) {
               callback(new Error('证件号码已存在'));
             }else{
                callback()
             }
           }).catch((err)=>{
                callback()
           }
           )
          }else {
             callback(new Error('请正确填写您的护照'))
          }
        }
        }
      }, required: true,trigger: 'blur' },
    ],
    area:[
        {
        validator:(rule, value, callback) => {
        if (this.personregisterForm.province === ''||this.personregisterForm.city === ''||
        this.personregisterForm.county === ''||this.personregisterForm.province == undefined||
        this.personregisterForm.city == undefined||this.personregisterForm.county == undefined) {
          callback(new Error('请选择所属区域'));
        } else {
          callback();
        }
      },
      required: true,trigger: 'change' }
    ],
    telephone:[
      { validator:(rule, value, callback) => {
        let mobile=/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        if(value == '' || value == undefined){
            callback(new Error('请输入手机号码'))
        }else {
          if (mobile.test(value)) {
             return callback()
          }else {
             callback(new Error('手机号码格式不正确'))
          }
        }
         },required: true, trigger: 'blur' },
    ]
  }
checked=false
  @Prop({
	        type: Number,
	        required: false,
          default: 1
	    }) active: any;
  dishitime = 5
  send() {
    this.$emit("back",this.active)
  }

   async created(){
     await this.getAll()
     // await this.getdiqu()
     await this.getyhzx()
     const response = await RegisterApi.getpersondiqu(this.zjlxid,this.zjlxtype)
     this.documenttype = response
     this.$set(this.personregisterForm,'certificatetype','1')
     await this.getprovice()
     this.getPwdCheck()
   }

   async getPwdCheck(){
     const res=await IdentityApi.pwdCheck()
     this.passWordCheckKey=res.key;
   }

  all:any = []
  diquid:any =''
  diqutype:any =''
  yhzxid:any =''
  yhzxtype:any =''
  async getAll() {
   const response = await RegisterApi.getAll()
   this.all = response
   this.all.forEach(element => {
      if(element.name == '地区'){
         this.diquid  = element.id
         this.diqutype  = element.type
      }else if(element.name == '用户中心'){
         this.yhzxid  = element.id
         this.yhzxtype  = element.type
      }
   });
  }
  //
  // ssq:any =[]
  // ssqid:any =''
  // ssqtype:any =''
  // async getdiqu() {
  // const response = await RegisterApi.getpersonProvinciascity(this.diquid,this.diqutype)
  // this.ssq = response
  // this.ssq.forEach(element => {
  //  this.ssqid = element.id
  //  this.ssqtype = element.type
  // });
  // }

  yhzx:any = []
  qylxid:any = ''
  qylxtype:any = ''
  qyzjlxid:any = ''
  qyzjlxtype:any = ''
  zjlxid:any = ''
  zjlxtype:any = ''
  async getyhzx() {
   const response = await RegisterApi.getyhzx(this.yhzxid,this.yhzxtype)
   this.yhzx = response
   this.yhzx.forEach(element => {
     if(element.name == '企业类型'){
       this.qylxid  = element.id
       this.qylxtype = element.type
     }else if(element.name == '企业证件类型'){
       this.qyzjlxid = element.id
       this.qyzjlxtype = element.type
     }else if(element.name == '证件类型'){
      this.zjlxid = element.id
      this.zjlxtype = element.type
     }
   });
  }

   async getpersonusernameExist(value) {
    const response = await RegisterApi.getpresonUserNameExist(value)
    return response
   }

   async getprovice() {
     const response = await DictionaryApi.getFieldEnumsByLetterName('DistrictCode', '0',{})
     this.provinces = response?response:[]
   }

   async getcitydata(value){
     this.$set(this.personregisterForm,'city','')
     this.$set(this.personregisterForm,'county','')
     let obj = this.provinces.find( item=> item.value === value);
     let param = {
       parentEnumValue: obj.id,
     }
     const response = await DictionaryApi.getFieldEnumsByLetterName('DistrictCode', '0', param)
     this.city = response?response:[]
   }

   async getcountrydata(value){
     this.$set(this.personregisterForm,'county','')
     let obj = this.city.find( item=> item.value === value);
     let param = {
       parentEnumValue: obj.id,
     }
     const response = await DictionaryApi.getFieldEnumsByLetterName('DistrictCode', '0', param)
     this.country = response?response:[]
   }

   async getDepartmentIdNumExist(type,num) {
    const response = await RegisterApi.getDepartmentIdNumExist(type,num)
    return response
  }

  dptform:any ={}

   async getsra() {
    this.dptform = JSON.parse(JSON.stringify(this.personregisterForm))
    this.provinces.forEach(element => {
      if(this.dptform.province==element.id){
          this.dptform.province=element.districtCode
      }
    });
    this.city.forEach(element => {
      if(this.dptform.city==element.id){
          this.dptform.city=element.districtCode
      }
    });
    this.country.forEach(element => {
      if(this.dptform.county==element.id){
          this.dptform.county=element.districtCode
      }
    });
    let Base64 = require('js-base64').Base64;
    this.cipherRequest.cipher = await this.encryptString(Base64.encode(JSON.stringify(this.dptform)))
    const response = await RegisterApi.getuserRegister(this.cipherRequest)
    this.$emit("down",this.active);
    bus.$emit('gotime',this.dishitime);
  }

 async encryptString(strText) {
    let modulus = window.localStorage.getItem('modulus') as string;
    let exponent = window.localStorage.getItem('exponent') as string;
		setMaxDigits(129);
    let key = new RSAKeyPair(exponent, "", modulus);
    let cipher = encryptedString(key, strText);
    return cipher;
  }

  registerbtn(personregisterForm){
    (this.$refs[personregisterForm] as any).validate((valid) => {
      if (valid) {
        if(!this.checked){
          this.$message.warning('请勾选相关服务条款')
        }else{
          this.getsra()
        }
      } else {
        return false;
      }
    });
  }

   async agreeChecked(){
    this.hadRead=true;
    this.agreeDialogVisible=true;
   }
}
</script>

<style lang="scss">
  .step23 {
   display:flex;
   width: 100%;
   background-color: #fff;
   border-top: none;
    border-radius:0 0 8px 8px;
   padding: 25px 40px;
   * {
     box-sizing: border-box;
   }
   .one {
     text-align: center;
     width: 20%;
     img {
       width: 120px;
       height: 75px;
     }
     .mt10 {
       color: #212B42;
       font-size: 16px;
       font-weight: bold;
       padding: 10px 0 0;
     }
   }
   .two {
     width: 80%;
     height: 100%;
     .subtit{
       margin: 0 0 20px;
     }
     .subtitmt30 {
       margin: 30px 0 20px;
     }
     el-input {
       width: 320px;
     }
     .region {
       width: 33%;
       padding:0 15px 0 0 ;
     }
     .backbtn {
      margin: 20px 0 0 18%;
       .stepbtn {
         cursor: pointer;
         padding: 0 20px;
         height: 30px;
         line-height: 30px;
         margin-right: 10px;
         border: none;
         background-color: #3f8aff;
         color: #fff;
         border-radius: 4px;
          }
     }
     .clause {
       margin:0;
       a {
         margin-left: 10px;
         height: 19px;
         color: #737686;
         font-size: 14px;
         font-family: Microsoft Yahei,arial,verdana;
         text-decoration: underline;
         color:  #467CF3;
       }
     }
    }
    .inputbig {
      display:flex;
      .name-input{
        width: 326px;
        height: 30px;
      .el-input__inner {
           width: 326px;
           height: 30px;
        }
      }

     .tips {
       word-break: break-all;
       word-wrap: break-word;
       line-height: 36px;
       margin-left: 10px;
       color: #C2C3C9;
     }
    }

    .selectsmall{
      width: 326px;
      height: 30px;
      .qiye-select {
        .el-input--suffix {
        width: 326px;
        height: 30px;
        line-height: 30px;
        .el-input__icon {
          line-height: 30px;
        }
      }
      .el-input__inner {
           width: 326px;
           height: 30px;
           line-height: 30px;
        }
      }
    }

      .selectmore {
        margin: 5px 0 0 0;
      display: flex;
      .quyu-input {
        width: 104px;
        height: 32px;
        margin-right: 7px;
        .el-input--suffix {
        width: 104px;
        height: 32px;
        line-height: 32px;

        .el-input__icon {
          line-height: 32px;
        }
      }
      }
      .el-input__inner {
           width: 104px;
           height: 32px;
           line-height: 32px;
        }
    }

    .el-select-dropdown {
      width: 104px;
      .el-scrollbar{
        width: 104px;
      }
    }
    .el-dialog__header{
      display: none;
    }
    .el-dialog__footer{
      text-align: center !important;
    }
 }
</style>
