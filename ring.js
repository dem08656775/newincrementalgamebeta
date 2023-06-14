function Ringdata(){

  this.statusdatatype = [
    [17,10,10,5,1,1,12],
    [9,15,9,2,6,2,12],
    [8,8,13,3,3,7,12]
  ]

  this.statustable = function(fst){
    let ret = [fst]

    for(let i=1;i<98;i++){
      ret[i] = ret[i-1]*1.05+fst*0.1
    }
    for(let i=0;i<99;i++){
      ret[i] = Math.floor(ret[i]*fst*0.1)
    }
    return ret

  }

  this.getstatus = function(ringid,statusid,level){
    return this.statustable(this.statusdatatype[ringid][statusid])[level-1]
  }

  this.shortgetstatus = function(rings,statusid){
    state = rings.missionstate
    ringid = rings.setrings[state.activering]
    level = this.getlevel(rings,ringid)
    return this.getstatus(ringid,statusid,level)
  }

  this.leveltable = [ 0, 14, 67, 189, 417, 796, 1385, 2256, 3495, 5194, 7449, 10367, 14064, 18673, 24338, 31213, 39456, 49232, 60719, 74105, 89597, 107407, 127757, 150872, 176987, 206352, 239230, 275897, 316633, 361726, 411470, 466173, 526159, 591762, 663324, 741194, 825727, 917289, 1016263, 1123042, 1238030, 1361637, 1494279, 1636380, 1788381, 1950737, 2123911, 2308375, 2504604, 2713085, 2934314, 3168807, 3417087, 3679688, 3957145, 4250004, 4558822, 4884172, 5226639, 5586815, 5965299, 6362697, 6779625, 7216713, 7674605, 8153958, 8655429, 9179685, 9727401, 10299267, 10895987, 11518275, 12166853, 12842447, 13545792, 14277637, 15038744, 15829888, 16651852, 17505424, 18391398, 19310581, 20263796, 21251876, 22275666, 23336015, 24433777, 25569820, 26745022, 27960279, 29216495, 30514581, 31855451, 33240033, 34669264, 36144098, 37665500, 39234441, 40851900, Infinity],
  /*:generation
  new Array(99).fill(null).map((n,i) => Math.sin(i)*5 + i*10)
  .map((sum = 0, n => sum += n))
  .map((sum = 0, n => sum += n))
  .map((sum = 0, n => sum += n))
  .map((v) => Math.floor(v))
  */

  this.levelcap = function(rings){
    return 10
  }

  this.getlevel = function(rings,id){
    let exp = rings.ringsexp[id]
    let lv = 0
    for(let i=0;i<this.leveltable.length;i++){
      if(exp>=this.leveltable[i]){
        lv = i
      }
    }
    lv += 1
    return Math.min(lv,this.levelcap(rings))
  },

  this.levelskills = [
    {
      1:0,
      5:1,
      10:4
    },
    {
      1:0,
      5:2,
      10:5
    },
    {
      1:0,
      5:3,
      10:6
    }
  ]

  this.missioninfo = [
    {
      turn:5,
      goal:500,
      exp:12,
      setsizemin:1,
      setsizemax:3
    },
    {
      turn:10,
      goal:1500,
      exp:30,
      setsizemin:1,
      setsizemax:3
    },
    {
      turn:15,
      goal:3000,
      exp:48,
      setsizemin:1,
      setsizemax:3
    },
    {
      turn:20,
      goal:6000,
      exp:90,
      setsizemin:1,
      setsizemax:3
    },
    {
      turn:20,
      goal:12000,
      exp:120,
      setsizemin:1,
      setsizemax:3
    }
  ]

  this.availableskills = function(rings,r){
    let ret = []
    let level = this.getlevel(rings,r)
    for(let i in this.levelskills[r]){
      if(i<=level){
        ret.push(this.levelskills[r][i])
      }
    }
    return ret
  }

  this.skills =[
    {
      name:"通常",
      tp:0,
      effect:(rings) => {
        state = rings.missionstate
        ringid = rings.setrings[state.activering]
        level = this.getlevel(rings,ringid)
        state.flowerpoint += Math.floor(state.flowermultiplier * this.getstatus(ringid,0,level))
        state.snowpoint += Math.floor(state.snowmultiplier * this.getstatus(ringid,1,level))
        state.moonpoint += Math.floor(state.moonmultiplier * this.getstatus(ringid,2,level))
      },
    },
    {
      name:"花増幅",
      tp:8,
      effect:(rings) => {
        state = rings.missionstate
        ringid = rings.setrings[state.activering]
        level = this.getlevel(rings,ringid)
        state.flowermultiplier +=  this.getstatus(ringid,3,level) * 0.01
      }
    },
    {
      name:"雪増幅",
      tp:8,
      effect:(rings) => {
        state = rings.missionstate
        ringid = rings.setrings[state.activering]
        level = this.getlevel(rings,ringid)
        state.snowmultiplier += this.getstatus(ringid,4,level) * 0.01
      }
    },
    {
      name:"月増幅",
      tp:8,
      effect:(rings) => {
        state = rings.missionstate
        ringid = rings.setrings[state.activering]
        level = this.getlevel(rings,ringid)
        state.moonmultiplier += this.getstatus(ringid,5,level) * 0.01
      }
    },
    //id:4
    {
      name:"花昇華",
      tp:15,
      effect:(rings) => {
        state = rings.missionstate
        ringid = rings.setrings[state.activering]
        level = this.getlevel(rings,ringid)
        state.flowerpoint += Math.floor(state.flowermultiplier * this.getstatus(ringid,0,level) * 5)
      }
    },
    {
      name:"雪昇華",
      tp:15,
      effect:(rings) => {
        state = rings.missionstate
        ringid = rings.setrings[state.activering]
        level = this.getlevel(rings,ringid)
        state.snowpoint += Math.floor(state.snowmultiplier * this.getstatus(ringid,1,level) * 5)
      }
    },
    {
      name:"月昇華",
      tp:15,
      effect:(rings) => {
        state = rings.missionstate
        ringid = rings.setrings[state.activering]
        level = this.getlevel(rings,ringid)
        state.moonpoint += Math.floor(state.moonmultiplier * this.getstatus(ringid,2,level) * 5)
      }
    },
    //id:7
    {

    }
  ]

}
