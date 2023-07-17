<template>
  <div class="registerbody">
    <div class="zsyy_top">
      <div class="zsyy_logo">
        <img
          class="logoimg"
          :src="logoUrl"
          alt=""
        />
        <span>{{platformTitle}}</span>
      </div>
    </div>
    <div class="zsyy_nav">
      <div class="registertit">
        <div class="title">
          <h2>注册</h2>
          <span>立即获取帐户并使用</span>
        </div>
        <div class="loading">
          <span class="yy">已有注册账号?</span>
          <a @click="ljdl">立即登录</a>
        </div>
      </div>

      <div class="content">
        <div class="step">
          <div class="steps">
            <div class="outsteps">
              <div
                ref="step"
                :class="
                  'active ' +
                  (active >= index + 1 ? 'pass' : '') +
                  ' ' +
                  classArr[selectindex - 1].className
                "
                v-for="(item, index) in steps"
                :key="index"
              >
                <div class="title">{{ item.title }}</div>
                <div class="circle">
                  <span>{{ item.id }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="step1" v-if="active == 1">
            <h3 class="steptit">注册类型</h3>
            <div class="regsty">
              <div class="regstybox" @click="first" ref="registerone">
                <img
                  class="img"
                  ref="img1"
                  src="../../assets/images/loginPage/company.png"
                />
                <p>企业注册</p>
                <i
                  ref="right1"
                  class="iconfont zwpt_success"
                  style="display: none"
                ></i>
              </div>
              <div class="regstybox" @click="second" ref="registertwo">
                <img
                  class="img"
                  ref="img2"
                  src="../../assets/images/loginPage/employee.png"
                />
                <p>企业员工注册</p>
                <i
                  ref="right2"
                  class="iconfont zwpt_success"
                  style="display: none"
                ></i>
              </div>
              <div class="regstybox" @click="third" ref="registerthree">
                <img
                  class="img"
                  ref="img3"
                  src="../../assets/images/loginPage/personal.png"
                />
                <p>个人用户注册</p>
                <i
                  ref="right3"
                  class="iconfont zwpt_success"
                  style="display: none"
                ></i>
              </div>
            </div>
            <div class="nextbtn">
              <button class="stepbtn" @click="next">下一步</button>
            </div>
          </div>
          <div v-if="active == 2">
            <step-21
              v-if="selectindex == 1"
              :active="active"
              @back="back"
              @down="down"
            ></step-21>
            <step-22
              v-else-if="selectindex == 2"
              :active="active"
              @back="back"
              @down="down"
            ></step-22>
            <step-23
              v-else
              :active="active"
              @back="back"
              @down="down"
            ></step-23>
          </div>
          <div v-if="active == 3">
            <div class="registersucess">
              <h4 class="success">恭喜您，注册成功！</h4>
              <img src="http://192.168.11.42:8082/GisqPlatformDesigner/static/images/success.png"/>
              <p>
                将在<span class="shijian">{{ dishitime }}s</span>后，返回登录页
              </p>
              <div>
                <button class="shoubtn" type="primary" @click="shouback">
                  手动返回
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch, Prop} from 'vue-property-decorator';
import Step21 from '@/views/register/step21.vue'
import Step22 from '@/views/register/step22.vue'
import Step23 from '@/views/register/step23.vue'
import bus from '@/utils/js/bus';
import {RegisterApi} from "@/api/base/module/register-api";
import {BaseApi} from "@/api/base/module/base-api";
 @Component({
    'name':'registerBody',
    components:{
      Step21,
      Step22,
      Step23
    }
  })
export default class RegisterBody extends Vue {
    selectindex=1
    active: any = 1
    dishitime = 0
    steps=[
        {
          title: '选择注册类型',
          id:1
        },
        {
          title: '用户注册',
          id:2
        },
        {
          title: '注册结果',
          id:3
        }
      ]
      classArr=[
        {
          className:"class1"
        },
          {
          className:"class2"
        },
          {
          className:"class3"
        }
      ]

    timer:any
    logoUrl=require("../../assets/images/loginPage/ztgx_logo.svg")
    platformTitle=this.MICRO_CONFIG.title
    async created(){
      const response = await RegisterApi.getRsadata()
      window.localStorage.setItem('exponent',(response as any).exponent);
      window.localStorage.setItem('modulus',(response as any).modulus);
      this.getTitleAndLogo()
    }
    mounted(){
      (this.$refs.registerone as any).click();
      bus.$on('gotime',data=>{
       if (!this.timer) {
        this.dishitime = data
        this.timer = setInterval(() => {
          if (this.dishitime >0 && this.dishitime <= data ) {
            this.dishitime--
          } else {
            clearInterval(this.timer)
            this.dishitime = 0
            this.timer = null
            this.$router.push({path:'/login'})
          }
        }, 1000)
      }
      })
    }
   @Watch("active")
  onChildChanged(val: Number) {
    let value = this.selectindex;
    if (val === 1) {
    this.$nextTick(() => {
      if (value === 1) {
        this.first();
      } else if (value === 2) {
        this.second();
      } else if (value === 3) {
        this.third();
      }
    });
    }
  }

    ljdl() {
      this.$router.push({path:'/login'})
    }
    next() {
      if (this.active++ > 3) this.active = 1;
    }
    down(){
      if (this.active++ > 3) this.active = 1;
    }

    back(active) {
      this.active=(active-1);
    }

    shouback(){
      clearInterval(this.timer)
      this.dishitime = 0
      this.$router.push({path:'/login'})
    }

    first() {
      this.selectindex=1;
      (this.$refs.registerone as any).style.border='1px solid #3C78FF';
      (this.$refs.registertwo as any).style.border='1px solid #EBEBEB';
      (this.$refs.registerthree as any).style.border='1px solid #EBEBEB';
      (this.$refs.img1 as any).style.opacity='1';
      (this.$refs.img2 as any).style.opacity='0.3';
      (this.$refs.img3 as any).style.opacity='0.3';
      (this.$refs.right1 as any).style.display='block';
      (this.$refs.right1 as any).style.background='#3C78FF';
      (this.$refs.right2 as any).style.display='none';
      (this.$refs.right3 as any).style.display='none';
    }
    second() {
      this.selectindex=2;
      (this.$refs.registertwo as any).style.border='1px solid #22D5BF';
      (this.$refs.registerone as any).style.border='1px solid #EBEBEB';
      (this.$refs.registerthree as any).style.border='1px solid #EBEBEB';
      (this.$refs.img2 as any).style.opacity='1';
      (this.$refs.img1 as any).style.opacity='0.3';
      (this.$refs.img3 as any).style.opacity='0.3';
      (this.$refs.right2 as any).style.display='block';
      (this.$refs.right2 as any).style.background='#22D5BF';
      (this.$refs.right1 as any).style.display='none';
      (this.$refs.right3 as any).style.display='none';
    }
    third() {
      this.selectindex=3;
      (this.$refs.registerthree as any).style.border='1px solid #FFB95F';
      (this.$refs.registerone as any).style.border='1px solid #EBEBEB';
      (this.$refs.registertwo as any).style.border='1px solid #EBEBEB';
      (this.$refs.img3 as any).style.opacity='1';
      (this.$refs.img1 as any).style.opacity='0.3';
      (this.$refs.img2 as any).style.opacity='0.3';
      (this.$refs.right3 as any).style.display='block';
      (this.$refs.right3 as any).style.background='#FFB95F';
      (this.$refs.right1 as any).style.display='none';
      (this.$refs.right2 as any).style.display='none';
    }
   async getTitleAndLogo(){
     let propertyKeys=['platformDesignerTitle',"platformDesignerLogo"]
     let params={
       subGuid:'',
       propertyKeys:propertyKeys
     }
     const data:any = await BaseApi.getCodeValuePropertysByKeys(params)
     if(data.length>0){
       //获取变量配置的系统名称
       const titleData=data.filter(item=>item.key=="platformDesignerTitle")
       this.platformTitle=titleData.length>0?titleData[0].value:this.MICRO_CONFIG.title
       //获取变量配置的系统logo
       const logoData=data.filter(item=>item.key=="platformDesignerLogo")
       this.logoUrl=logoData.length>0&&logoData[0].value!= 'image'?logoData[0].value:this.logoUrl
     }
   }
}
</script>

<style lang="scss">
.registerbody {
  background-color: #fff;
  width: 100vw;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  * {
    box-sizing: border-box;
  }

  .zsyy_top {
    width: 100%;
    height: 50px;
    background: #3f8aff;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    .zsyy_logo {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      line-height: 50px;
      img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      span {
        font-size: 18px;
        color: #fff;
      }
    }
  }

  .zsyy_nav {
    width: 74%;
    margin-left: 13%;
    background: #fff;
    .registertit {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .title {
        h2 {
          color: #3f8aff;
          font-size: 24px;
          line-height: 1.8;
        }
        span {
          font-size: 14px;
          color: #c2c3c9;
          line-height: 1.2;
        }
      }
      .loading {
        margin-top: 40px;
        .yy {
          font-size: 14px;
          font-family: Microsoft Yahei, arial, verdana;
          color: #737686;
          line-height: 1.2;
        }
        a {
          cursor: pointer;
          margin-left: 10px;
          font-size: 14px;
          color: #3f8aff;
          line-height: 1.2;
        }
      }
    }

    .content {
      width: 100%;
      padding: 0px;
      border-radius: 8px;
      background-color: #fff;

      box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.1);
      .step {
        .steps {
          width: 100%;
          height: 92px;
          padding: 30px;
          border-bottom: 1px solid #dfe1e6;
          .outsteps {
            width: 100%;
            height: 32px;
            display: flex;
            justify-content: space-between;
            .active {
              position: relative;
              width: 28%;
              height: 32px;
              line-height: 32px;
              color: #c2c3c9;
              text-align: center;
              font-size: 14px;
              clip-path: polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%);
              .title {
                margin-left: 10px;
                background: #eaecf0;
              }
              .circle {
                position: absolute;
                top: -4%;
                left: 0;
                width: 35px;
                height: 35px;
                display: inline-block;
                border-radius: 50%;
                border: 2px solid #fff;
                line-height: 32px;
                text-align: center;
                background: #eaecf0;
              }
            }
            .active:last-child {
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            }
            .pass {
              color: #fff;
            }
            .class1.pass {
              color: #fff;
              .title {
                background: #3f8aff;
              }
              .circle {
                background: #3f8aff;
              }
            }

            .class2.pass {
              color: #fff;
              .title {
                background: #22d5bf;
              }
              .circle {
                background: #22d5bf;
              }
            }

            .class3.pass {
              color: #fff;
              .title {
                background: #ffb95f;
              }
              .circle {
                background: #ffb95f;
              }
            }
          }
        }

        .zsyystep {
          padding: 23px 0;
          border-bottom: 1px solid #dfe1e6;
          .el-step__title {
            font-size: 14px;
          }
        }

        .step1 {
          font-size: 14px;
          font-family: Microsoft Yahei, arial, verdana;
          padding: 25px 40px;
          box-sizing: border-box;
          .steptit {
            width: 100%;
            padding: 10px 200px 25px;
            box-sizing: border-box;
          }
          .regsty {
            display: flex;
            justify-content: center;
            align-items: center;
            .regstybox {
              position: relative;
              margin: 0 10px;
              padding: 30px 0;
              width: 162px;
              height: 176px;
              border: 1px solid #ebebeb;
              text-align: center;
              cursor: pointer;
              .img {
                width: 120px;
                height: 75px;
                opacity: 0.3;
              }
              .img:hover {
                opacity: 1 !important;
              }
              i {
                position: absolute;
                bottom: -16px;
                left: 64px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                color: #fff;
                line-height: 33px;
                text-align: center;
                filter: alpha(opacity=0);
                transition: all 0.3s;
                -webkit-transition: all 0.3s;
              }
              p {
                margin: 20px 0 0;
              }
            }
          }
          .nextbtn {
            margin: 70px 0 0;
            text-align: center;
            .stepbtn {
              cursor: pointer;
              padding: 0 20px;
              height: 30px;
              line-height: 30px;
              border: none;
              background-color: #3f8aff;
              color: #fff;
              font-size: 14px;
              font-family: Microsoft Yahei, arial, verdana;
              border-radius: 4px;
            }
          }
        }

        .registersucess {
          padding: 25px 40px;
          text-align: center;
          .success {
            font-weight: 800;
            font-size: 24px;
            color: #3f8aff;
          }
          img {
            width: 116px;
            height: 113px;
            margin: 20px 0;
          }
          p {
            font-size: 14px;
            color: rgb(175, 172, 172);
            margin-bottom: 10px;
            .shijian {
              color: skyblue;
            }
          }
          .shoubtn {
            cursor: pointer;
            width: 96px;
            padding: 0 20px;
            height: 30px;
            line-height: 30px;
            border: none;
            background-color: #3f8aff;
            color: #fff;
            border-radius: 4px;
            transition: all 0.3s;
            -webkit-transition: all 0.3s;
          }
        }
      }
    }
  }
}
</style>
