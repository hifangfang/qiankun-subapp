<template>
    <div class="step21">
          <div class="one">
              <img src="../../assets/images/loginPage/company.png">
            <div class="mt10">企业注册</div>
          </div>
          <div class="two">
             <el-form @submit.native.prevent  :model="departmentregisterForm" :rules="departmentregisterFormrules"  ref="departmentregisterForm" label-width="100px" class="demo-ruleForm">
               <h4 class="subtit">用户信息</h4>
               <el-form-item label="用户名"  prop="username">
                 <div class="inputbig">
                   <el-input class="name-input" v-model="departmentregisterForm.username"  maxlength="50" show-word-limit></el-input>
                   <span class="tips">只能包含汉字，小写字母和数字</span>
                 </div>
               </el-form-item>
               <el-form-item label="密码"  prop="password1">
                 <div class="inputbig">
                  <el-input type="password" class="name-input" v-model="departmentregisterForm.password1"  placeholder="请设置登录密码" ></el-input>
                  <span class="tips" >{{passWordCheckKey}}</span>
                 </div>
               </el-form-item>
               <el-form-item label="确认密码"  prop="password2">
                 <div class="inputbig">
                  <el-input type="password" class="name-input"  v-model="departmentregisterForm.password2" placeholder="请再次输入密码"  ></el-input>
                 </div>
               </el-form-item>
            <h4 class="subtitmt30">企业信息</h4>
              <el-form-item label="企业类型" prop="departmentTypeId" >
                <div class="selectsmall">
                 <el-select
                 class="qiye-select"
                 v-model="departmentregisterForm.departmentTypeId "
                 @change="getdepartmenttype"
                  >
                   <el-option
                   v-for="(item,index) in qytype"
                   :key="index"
                   :label="item.name"
                   :value="item.id"
                   ></el-option>
                 </el-select>
                </div>
              </el-form-item>
              <el-form-item label="企业名称"  prop="departname">
                 <div class="inputbig">
                  <el-input class="name-input"  v-model="departmentregisterForm.departname" placeholder="请输入企业名称"  ></el-input>
                 </div>
               </el-form-item>
               <el-form-item label="证件类型"  prop="idType">
                 <div class="selectsmall">
                 <el-select
                 class="qiye-select"
                 v-model="departmentregisterForm.idType"
                 >
                   <el-option
                   v-for="(item,index) in departmentdocumenetType"
                   :key="index"
                   :label="item.name"
                   :value="item.enumValue"
                   ></el-option>
                 </el-select>
                 </div>
              </el-form-item>
               <el-form-item label="证件号码"  prop="idNumber">
                 <div class="inputbig">
                  <el-input ref="idNumber" class="name-input" v-model="departmentregisterForm.idNumber" placeholder="请输入证件号码" ></el-input>
                 </div>
               </el-form-item>
               <el-form-item label="所属区域" prop="area">
               <div class="selectmore">
                 <el-select
                 class="quyu-input"
                 v-model="departmentregisterForm.province"
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
                 v-model="departmentregisterForm.city"
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
                 <el-select class="quyu-input" v-model="departmentregisterForm.county" placeholder="区县">
                   <el-option
                    v-for="(item,index) in country"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                   ></el-option>
                 </el-select>
               </div>
              </el-form-item>
                <el-form-item label="联系人">
                  <div class="inputbig">
                  <el-input class="name-input"  v-model="departmentregisterForm.contactName" placeholder="请输入联系人" ></el-input>
                  </div>
               </el-form-item>
                <el-form-item label="手机号码"  prop="phone">
                  <div class="inputbig">
                  <el-input class="name-input" v-model="departmentregisterForm.phone" placeholder="请输入手机号码" ></el-input>
                  </div>
               </el-form-item>
               <el-form-item>
                 <div class="inputbig clause">
                   <el-checkbox v-model="checked" ></el-checkbox>
                   <a href="javascript:void(0);" @click="agreeChecked">{{hadRead?'我已阅读并同意相关服务条款和隐私政策':'请阅读并同意相关服务条款和隐私政策'}}</a>
                 </div>
               </el-form-item>
               <div class="backbtn">
                <button class="stepbtn"  @click="send">上一步</button>
                <button class="stepbtn"  @click="registerbtn('departmentregisterForm')" >立即注册</button>
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
import {Component, Vue, Watch, Prop,Emit} from 'vue-property-decorator';
import {RegisterApi} from "@/api/base/module/register-api";
import {DepartmentRegisterForm,CipherRequest}  from "@/api/base/model/register-model"
import {DictionaryApi} from "@/api/base/module/Dictionary-api"
import {IdentityApi} from "@/api/identity/module/identity-api"
import bus from '@/utils/js/bus';
import { setMaxDigits,biFromHex } from "../../utils/js/BigInt.js"
import { RSAKeyPair, encryptedString } from "../../utils/js/RSA.js"
import serviceTerms from "./serviceTerms.vue"
 @Component({
   'name':'step21',
   components: {
     serviceTerms
   },
  })


export default class step21 extends Vue{
  all:any
  diquid:any
  diqutype:any
  yhzxid:any
  yhzxtype:any


  qytype:any = []
  qyname:any = []
  departmentdocumenetType:any = []
  provinces:any = []
  city:any = []
  country:any = []
  departmentregisterForm: DepartmentRegisterForm = {} as DepartmentRegisterForm;
  cipherRequest: CipherRequest = {} as CipherRequest;
  passWordCheckKey='';
   agreeDialogVisible=false;
   hadRead=false;
  //统一信用代码
  uniformCreditCode = function(Code) {
	    // Code = (this.$refs.idNumber as any).trim(Code);
			if (Code.length == 0 || Code == null || Code == undefined) {
				return false;
			}
	        const patrn = /^[0-9A-Z]+$/;
	        // 18位校验及大写校验
	        if ((Code.length !== 18) || !patrn.test(Code)) {
	            return false;;
	        }
            let Ancode; // 统一社会信用代码的每一个值
            let Ancodevalue; // 统一社会信用代码每一个值的权重
            let total = 0;
            const weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]; // 加权因子
            const str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
            // 不用I、O、S、V、Z
            for (let i = 0; i < Code.length - 1; i++) {
                Ancode = Code.substring(i, i + 1);
                Ancodevalue = str.indexOf(Ancode);
                total = total + Ancodevalue * weightedfactors[i];
                // 权重与加权因子相乘之和
            }
            let logiccheckcode = 31 - total % 31;
            if (logiccheckcode === 31) {
                logiccheckcode = 0;
            }
            const Str = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y';
            const Array_Str = Str.split(',');
            const log = Array_Str[logiccheckcode];
            const checkcode = Code.substring(17, 18);
            if (log !== checkcode) {
                return false;
            }else{
            	return true;
            }
	    }
  //营业执照号验证
  businessLicenseNumber = function(ints) {
	    // ints = (this.$refs.idNumber as any).trim(ints);
			if (ints.length != 15 || ints == null || ints == undefined) {
				return false;
			}
	        let ti = 0;
	        let si = 0; // pi|11+ti
	        let cj = 0; // （si||10==0？10：si||10）*2
	        let pj = 10; // pj=cj|11==0?10:cj|11
	        let lastNum;
	        for (let i = 0; i < ints.length; i++) {
	            ti = parseInt(ints[i], 10);
	            si = pj + ti;
	            cj = (0 === si % 10 ? 10 : si % 10) * 2;
	            pj = cj % 11;

	            if (i === ints.length - 1) {
	                // lastNum =(1 - pj < 0 ? 11 - pj : 1 - pj) % 10;
	                lastNum = si % 10;
	            }
	        }

	        if (lastNum !== 1) {
	            return false;
	        }else{
	        	return true;
	        }
	    }
  //组织机构代码验证
  organizingInstitutionBarCode = function(CODE) {
	    // CODE = (this.$refs.idNumber as any).trim(CODE);
			if (CODE.length == 0 || CODE == null || CODE == undefined) {
				return false;
			}
            const patrn = /^[0-9A-Z]+$/;
            if ((CODE.length !== 9) || !patrn.test(CODE)) {
            	return false;
            }
            const lastpatrn = /^[0-9X]+$/;
            const checkcode = CODE.substring(8, 9);
            if (!lastpatrn.test(checkcode)) {
                return false;
            }
            let ancode;
            let ancodevalue;
            let total = 0;
            const weightedfactors = [3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
            const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let i = 0; i < CODE.length - 1; i++) {
                ancode = CODE.substring(i, i + 1);
                ancodevalue = str.indexOf(ancode);
                total = total + ancodevalue * weightedfactors[i];
            }
            const logiccheckcode = 11 - total % 11;
            let lastCode;
            if (logiccheckcode === 10) {
                lastCode = 'X';
            } else if (logiccheckcode === 11) {
                lastCode = '0';
            } else {
                lastCode = logiccheckcode;
            }
            if (checkcode.toString() !== lastCode.toString()) {
                return false;
            }else{
            	return true;
            }
	    }


  departmentregisterFormrules={
    username:[
      {
        validator:(rule, value, callback) => {
        if (value === ''||value === undefined) {
          callback(new Error('请输入用户名'));
        } else {
         this.getusernameExist(this.departmentregisterForm.username).then(res=>{
           const result=res
             if (result) {
               callback(new Error('用户名已存在'));
             }else{
                callback()
             }
           }).catch((e)=>{
              callback()
           })
        }
      },required: true, trigger: 'blur'  },
      {validator:(rule, value, callback) => {
        if (value.length==50) {
          callback(new Error('用户名最大长度为50位'));
        }else{
          callback()
        }
      },required: true, trigger: 'change' }
    ],
    password1:[
      {validator:async (rule, value, callback) => {
        if (value === ''||value === undefined) {
          callback(new Error('请设置登录密码'));
        } else {
          const res=await IdentityApi.pwdCheck()
          let ff = value.match(res.rev);
          if(ff==null){
            callback(new Error(res.key));
          }
          if (this.departmentregisterForm.password2 !== '') {
            (this.$refs.departmentregisterForm as any).validateField('password2');
          }
          callback();
        }
      } ,trigger: 'blur',required: true},
    ],
    password2:[
      {validator:(rule, value, callback) => {
        if (value === ''||value === undefined) {
          callback(new Error('请输入密码'));
        } else if (value !== this.departmentregisterForm.password1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },trigger: 'blur',required: true}
    ],
    departmentTypeId:[
        { required: true, message: '请选择企业类型', trigger: 'change' }
    ],
    departname:[
      { validator:(rule, value, callback) => {
        if ( this.departmentregisterForm.departname === ''|| this.departmentregisterForm.departname === undefined) {
          callback(new Error('请输入企业名称'));
        } else {
         this.getdepartmentnameExist(this.departmentregisterForm.departname).then(res=>{
           const result=res
             if (result) {
               callback(new Error('企业名称已存在'));
             }else{
                callback()
             }
           }).catch((e)=>{
              callback()
           })
        }
      }, required: true,trigger: 'blur' }
    ],
    idNumber:[
      {validator:(rule, value, callback) => {
        if (value === ''||value === undefined) {
          callback(new Error('请输入证件号码!'));
        } else {
          if(this.departmentregisterForm.idType == '1'){
          if(!this.uniformCreditCode(value)){
            callback(new Error('请正确填写统一社会信用机构代码'));
          }else {
          this.getDepartmentIdNumExist(this.departmentregisterForm.idType,this.departmentregisterForm.idNumber).then(res=>{
           const result=res
             if (result) {
               callback(new Error('代码已存在'));
             }else{
                callback()
             }
           }).catch((err)=>{
                callback()
           }
           )
          }
        }else if(this.departmentregisterForm.idType == '2') {
           if(!this.businessLicenseNumber(value)){
            callback(new Error('请正确填写营业执照号码'));
          }else {
             this.getDepartmentIdNumExist(this.departmentregisterForm.idType,this.departmentregisterForm.idNumber).then(res=>{
           const result=res
             if (result) {
               callback(new Error('号码已存在'));
             }else{
                callback()
             }
           }).catch((err)=>{
                callback()
           }
           )
          }
        }else {
           if(!this.organizingInstitutionBarCode(value)){
            callback(new Error('请正确填写组织机构号码'));
          }else {
            this.getDepartmentIdNumExist(this.departmentregisterForm.idType,this.departmentregisterForm.idNumber).then(res=>{
           const result=res
             if (result) {
               callback(new Error('号码已存在'));
             }else{
                callback()
             }
           }).catch((err)=>{
                callback()
           }
           )
          }
        }

        }

      }, required: true, trigger: 'blur' }
    ],
    area:[
       {
         validator:(rule, value, callback) => {
        if (this.departmentregisterForm.province === ''||this.departmentregisterForm.city === ''||
        this.departmentregisterForm.county === ''||this.departmentregisterForm.province == undefined||
        this.departmentregisterForm.city == undefined||this.departmentregisterForm.county == undefined) {
          callback(new Error('请选择所属区域'));
        } else {
          callback();
        }
      },
       required: true,trigger: ['blue','change'] }
    ],
    phone:[
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
         },required: true,  trigger: 'blur' }
    ]
  }
  @Prop({
	        type: Number,
	        required: false,
          default: 1
	    }) active: any;
  dishitime = 5
  send() {
    this.$emit("back",this.active)
  }

  //调用所有的方法
  async created() {
   await this.getAll()
   await this.getyhzx()
   await this.getProvincias()
   await this.getdepartmentTypeId()
   this.getdepartmentdocumenetType()
   this.getPwdCheck()
  }

  async getPwdCheck(){
    const res=await IdentityApi.pwdCheck()
    this.passWordCheckKey=res.key;
  }

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

  async getdepartmentTypeId() {
    //获取企业类型
    const response = await RegisterApi.getdepartmentType()
    this.qytype = response
  }


  async getusernameExist(value) {
    const response = await RegisterApi.getUserNameExist(value)
    return response
  }
  async getdepartmentnameExist(value) {
    const response = await RegisterApi.getisDeptIdNumberExistIn(value)
    return response
  }


  getdepartmenttype(value){
    this.getdepname(value)
  }

  async getdepname(value) {
    const response = await RegisterApi.getdepartmentname(value)
    this.qyname = response
  }

  async getdepartmentdocumenetType() {
    const response = await RegisterApi.getdepartmentdocumenetType(this.qyzjlxid,this.qyzjlxtype)
    this.departmentdocumenetType = response
    this.$set(this.departmentregisterForm,'idType','1')
  }

  async getProvincias() {
    const response = await DictionaryApi.getFieldEnumsByLetterName('DistrictCode', '0',{})
    this.provinces = response?response:[]
  }

  async getcitydata(value){
    this.$set(this.departmentregisterForm,'city','')
    this.$set(this.departmentregisterForm,'county','')
    let obj = this.provinces.find( item=> item.value === value);
    let param = {
      parentEnumValue: obj.id,
    }
    const response = await DictionaryApi.getFieldEnumsByLetterName('DistrictCode', '0', param)
    this.city = response?response:[]
  }

  async getcountrydata(value){
    this.$set(this.departmentregisterForm,'county','')
    let obj = this.city.find( item=> item.value === value);
    let param = {
      parentEnumValue: obj.id,
    }
    const response = await DictionaryApi.getFieldEnumsByLetterName('DistrictCode', '0', param)
    this.country = response?response:[]
  }

  async getDepartmentIdNumExist(type,num) {
    const response = await RegisterApi.getDepartmentIdNumExists(type,num)
    return response
  }

  dptform:any ={}

  async getsra() {
    this.dptform = JSON.parse(JSON.stringify(this.departmentregisterForm))
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
    const response = await RegisterApi.getdepartmentRegister(this.cipherRequest)
    this.$emit("down",this.active)
    bus.$emit('gotime',this.dishitime)
    return response
  }

 async encryptString(strText) {
    let modulus = window.localStorage.getItem('modulus') as string;
    let exponent = window.localStorage.getItem('exponent') as string;
		setMaxDigits(129);
    let key = new RSAKeyPair(exponent, "", modulus);
    let cipher = encryptedString(key, strText);
    return cipher;
  }

   checked=false

   registerbtn(departmentregisterForm){
    (this.$refs[departmentregisterForm] as any).validate((valid) => {
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
    this.hadRead=true
    this.agreeDialogVisible=true
   }

}
</script>

<style lang="scss">
 .step21 {
   display:flex;
   width: 100%;
   background-color: #fff;
   border-top: none;
   border-radius:0 0 8px 8px;
   padding: 25px 40px;
   * {
     box-sizing: border-box;
   }
   /*height: 811px;*/
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
      .el-select-dropdown__item {
        font-size: 12px;
        padding: 0 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
      }
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
