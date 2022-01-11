//indexes for array
var CharacterLevel=0
var BaseAttack=1;
var TotalAttack=2;
var EnergyRecharge=3;
var EM=4;
var CritRate=5;
var CritDamage=6;
var SkillElement=7;
var DmgBonus=8;
var SkillScaling=9;
var BurstScaling=10;
var reaction=11;
var CharOther=12;
var CharSkill=13;
var CharBurst=14;

var SkillNoCrit=15;
var SkillCritHit=16;
var SkillAverage=17;
var BurstNoCrit=18;
var BurstCritHit=19;
var BurstAverage=20;

let stat1={};
let stat2={};
let stats=[stat1,stat2];
stats[0][0]=100;

let DamageOutput={};

let ChongyunNormalATK=[70,75.7,81.4,89.54,95.24,101.75,110.7,119.66,128.61,138.38,148.15,157.92,167.68,177.45,187.22];
let ChongyunSkill=[172.04,184.94,197.85,215.05,227.95,240.86,258.06,275.26,292.47,309.67,326.88,344.08,365.59,387.09,408.6];
let ChongyunBurst=[142.4,153.08,163.76,178,188.68,199.36,213.6,227.84,242.08,256.32,270.56,284.8,302.6,320.4,338.2];
function calculate(ID,num){//num is div id
    // alert("Character level is: "+document.getElementById("BATK").value);
    // all variables needed for calculation
//front stats
// alert(document.querySelector(`.${ID} > #lv`).value); 
var build=num-1;
    stats[build][CharacterLevel]= parseFloat(document.querySelector(`.${ID} > #lv`).value);//character level
    stats[build][BaseAttack]= parseInt(document.querySelector(`.${ID} > #BATK`).value);//base attack for bonuses
    stats[build][TotalAttack]= parseFloat(document.querySelector(`.${ID} > #FATK`).value);//total attack
    stats[build][EnergyRecharge]=parseInt(document.querySelector(`.${ID} > #ER`).value);//energy recharge
    
//crit
    stats[build][CritRate]=parseFloat(document.querySelector(`.${ID} > #CR`).value)*.01;
    stats[build][CritDamage]=parseFloat(document.querySelector(`.${ID} > #CD`).value)*.01+1;


//dmg bonuses
    stats[build][DmgBonus]=parseFloat(document.querySelector(`.${ID} > #DMGBonus`).value)*.01;//damage bonus
    stats[build][SkillScaling]=parseFloat(document.querySelector(`.${ID} > #SkillScaling`).value)/100;//skill scaling
    stats[build][BurstScaling]=parseFloat(document.querySelector(`.${ID} > #BurstScaling`).value)/100;//burst scaling



//---<FIXED>---identified problem: melt undercalculates dmg, needs boost
//reaction
    stats[build][reaction]= "";
    
//enemy stats
    var EnemyLevel=parseFloat(document.getElementById("eLv").value);
    var EnemyDefense=5*EnemyLevel+500;
    var Resistance= parseFloat(document.getElementById("resist").value)*.01;
    var DefReduce=parseFloat(document.getElementById('DefShred').value)*.01;
    
    var DMGReduction=(stats[build][CharacterLevel]+100)/(stats[build][CharacterLevel]+EnemyLevel+200);
    var DefMultiplier=DMGReduction;
    if(DefReduce>0){
        EnemyDefense-=DefReduce*EnemyDefense;
        DMGReduction=EnemyDefense/(EnemyDefense+5*stats[build][CharacterLevel]+500);
        DefMultiplier=1-DMGReduction;
    }
    
    var OtherBonus=parseFloat(document.getElementById("other").value)*.01;//adding other boosts ex: from constellations
    var SkillBonus=parseFloat(document.getElementById("otherSkill").value)*.01;
    var BurstBonus=parseFloat(document.getElementById("otherBurst").value)*.01;
    
    stats[build][CharOther]=parseFloat(document.querySelector(`.${ID}> #otherx`).value)*.01;
    stats[build][CharSkill]=parseFloat(document.querySelector(`.${ID}> #otherxS`).value)*.01;
    stats[build][CharBurst]=parseFloat(document.querySelector(`.${ID}> #otherxB`).value)*.01;
    var AtkBonus=parseFloat(document.querySelector(`#otherAtk`).value)*.01;
    var EMBonus=parseFloat(document.querySelector(`#otherEM`).value);
        //elemental reaction 

    //var DefMultiplier=1-DMGReduction;  not sure if this is right

    //enemy Defense
    var ResShred=parseFloat(document.getElementById("resShred").value)*.01;//count resistance shred like 4pc VV
    
    if(document.getElementById('4VV').checked){
        if(stats[build][SkillElement]==='Anemo'||stats[build][SkillElement]==='Geo'||stats[build][SkillElement]==='Physical'){
        }
        else{
            ResShred+=.4;
        }
    }
    

    //change background
    //change class name to div id somehow

    //done
    //changeBG(stats[build][SkillElement],document.querySelector(`.${ID}`).id);

    //element of skill and target
    stats[build][SkillElement]=document.querySelector(`.${ID}> #DmgELE`).value;//element of the skill
    
    var ElementTarget=document.getElementById("AELE").value;//element on target

    stats[build][EM]= parseFloat(document.querySelector(`.${ID} > #EM`).value)+EMBonus;//Elemental Mastery
    var VapMelt=0;
    if(document.getElementById("4witch").checked){
        VapMelt+=.15;
    }
    //sucrose em buff
    if(document.getElementById('Sucrose').checked){
        if(document.getElementById('MollisFavonius').checked){
            stats[build][EM]+=.2*parseFloat(document.getElementById('SucroseEM').value);
        }
        if(document.getElementById('CatalystConversion').checked){
            stats[build][EM]+=50;
        }
        if(document.getElementById('SucroseC6').checked){
            if(stats[build][SkillElement]==='Anemo'||stats[build][SkillElement]==='Geo'||stats[build][SkillElement]==='Physical'){
            }
            else{
                OtherBonus+=.2; 
            }
        }
    }
    var KazuEM=parseFloat(document.getElementById('KazEM').value);

    if(document.getElementById('Kazuha').checked){
        if(document.getElementById('C2').checked){
            KazuEM+=200;
            stats[build][EM]+=200;
        }
        if(document.getElementById('PoF').checked){
            if(stats[build][SkillElement]==='Anemo'||stats[build][SkillElement]==='Geo'||stats[build][SkillElement]==='Physical'){
            }
            else{
                stats[build][DmgBonus]+=KazuEM*.0004;
            }
        }
        
    }
    //character buffs
    var bennetBase=parseFloat(document.getElementById('bennettBase').value);
    var bennetBonus=parseFloat(document.getElementById('%bonus').value)*.01;
    if(document.getElementById('bennett').checked){
        stats[build][TotalAttack]+=bennetBase*bennetBonus;
        if(document.getElementById('BennettC6').checked){
            if(stats[build][SkillElement]=='Pyro'){
                stats[build][DmgBonus]+=.15;
            }
        }
    }
    if(document.getElementById('noblesse').checked){
        BurstBonus+=.2;
    }
    if(document.getElementById('4noblesse').checked){
        stats[build][TotalAttack]+=.2*stats[build][BaseAttack];
    }

    if(document.getElementById('Totm').checked){
        stats[build][TotalAttack]+=.2*stats[build][BaseAttack];
    }

    if(document.getElementById('emblem').checked){
        if(stats[build][EnergyRecharge]>=300){
            BurstBonus+=.75;
        }
        else{
            BurstBonus+=.25*stats[build][EnergyRecharge]*.01;
        }
    }
    if(document.getElementById('archaic').checked){
        stats[build][DmgBonus]+=.35;
    }
    if(document.getElementById('Lavawalk').checked){
        if(ElementTarget=='Pyro'){ 
            stats[build][DmgBonus]+=.35;
        }
    }
    if(document.getElementById('thunderSooth').checked){
        if(ElementTarget=='Electro'){ 
            stats[build][DmgBonus]+=.35;
        }
    }
    if(document.getElementById('4instructor').checked){
        stats[build][EM]+=120;
    }

    if(document.getElementById('adeptus').checked){
        stats[build][TotalAttack]+=371;
        stats[build][CritRate]+=.12;
    }
        
    if(document.getElementById('potion').checked){
        stats[build][DmgBonus]+=.25;
    }
    if(document.getElementById('NoTomorrow').checked){
        stats[build][CritRate]+=.2;
        stats[build][CritDamage]+=.2;
    }

    if(document.getElementById('thrillingTales').checked){
        stats[build][TotalAttack]+=.48*stats[build][BaseAttack];
    }

    //something might be wrong with geoResonance, test it.
    if(document.getElementById('geoRes').checked){
        stats[build][DmgBonus]+=.15;
        if(stats[build][SkillElement]=="Geo"){
            ResShred+=.2;
        }
    }
    if(document.getElementById('supcon').checked){
        if(stats[build][SkillElement]=='Physical'){
            ResShred+=.4;
        }
    }

    
    
    
    //final em calculation
    VapMelt+= parseFloat((2.78*stats[build][EM])/(stats[build][EM]+1400));//Melt/ Vaporize bonus
    var ReactionBonus=ElementalReaction(build,stats[build][SkillElement],ElementTarget,VapMelt);

    if(document.getElementById('Mona').checked){
        stats[build][DmgBonus]+=parseFloat(document.getElementById('omen%').value)*.01;
        if(document.getElementById('MonaC1').checked){
            if(stats[build][reaction]==="Vaporize"){
                VapMelt+=.15;
            }
        }
    }
    if(document.getElementById('Sara').checked){
        stats[build][TotalAttack]+=parseFloat(document.getElementById('SaraBase').value)*
        parseFloat(document.getElementById('sara%bonus').value)*.01;
        if(document.getElementById('SaraC6').checked){
            if(stats[build][SkillElement]=='Electro'){
                stats[build][CritDamage]+=.6;
            }
        }
    }

//final calculation
    
stats[build][DmgBonus]+=OtherBonus+stats[build][CharOther];
//bug w/ other dmg bonuses, hutao w/ 0 is good
// diluc w/ 15% is .18% off
//chongyun w/ 60% is 9.6%
//found out why: noblesse is meant to be in dmg bonus, not dmg scaling
stats[build][TotalAttack]+=AtkBonus*stats[build][BaseAttack];
    
    
//bonus scaling
    var BonusScale=0;
    BonusScale+=parseFloat(document.getElementById('bonusFlatScaling').value);

    var SkillTotal=stats[build][TotalAttack]*stats[build][SkillScaling]+BonusScale;
    var BurstTotal=stats[build][TotalAttack]*stats[build][BurstScaling]+BonusScale;
    if(document.getElementById('ShenHe').checked){
        if(stats[build][SkillElement]==='Cryo'){
            var ShenHeATK=parseFloat(document.getElementById('ShenHeATK').value);
            var ShenHeScale=parseFloat(document.getElementById('ShenHe%Bonus').value)*.01;
            SkillTotal+=ShenHeATK*ShenHeScale;
            BurstTotal+=ShenHeATK*ShenHeScale;
        }
        if(document.getElementById('ShenHeBurst').checked){
            ResShred+=parseFloat(document.getElementById('ShenHeResShred').value*.01);
        }
        if(document.getElementById("ShenHeA1").checked&&stats[build][SkillElement]==='Cryo'){
            stats[build][DmgBonus]+=.15;
        }
        if(document.getElementById("ShenHeA4").checked){
            stats[build][DmgBonus]+=.15;
        }

    }
    

    var ResPercent=Resistance-ResShred;//final resistance
    var ResMultiplier= ResistanceCalc(ResPercent);//get actual multiplier
    var DMGreduced=DefMultiplier*ResMultiplier*ReactionBonus;//excluding dmg scaling

    var SkillOut=SkillTotal*DMGreduced*(1+stats[build][DmgBonus]+SkillBonus+stats[build][CharSkill]);
    stats[build][SkillNoCrit]=SkillOut;
    var SkillCrit=SkillOut*(stats[build][CritDamage]);
    stats[build][SkillCritHit]=SkillCrit;
    var Skillavg=SkillOut*(1-stats[build][CritRate])+SkillCrit*stats[build][CritRate];
    stats[build][SkillAverage]=Skillavg;

    var BurstOut=BurstTotal*DMGreduced*(1+stats[build][DmgBonus]+BurstBonus+stats[build][CharBurst]);
    stats[build][BurstNoCrit]=BurstOut;
    var BurstCrit=BurstOut*(stats[build][CritDamage]);
    stats[build][BurstCritHit]=BurstCrit;
    var Burstavg=BurstOut*(1-stats[build][CritRate])+BurstCrit*stats[build][CritRate];
    stats[build][BurstAverage]=Burstavg;
    


    // document.getElementById("output").textContent='non-crit hit:\t'
    // + IncomingDmg.toFixed(0)
    // +'\nCrit Hit:\t'+IncomingCrit.toFixed(0);


    // //detailed console calculation
    document.querySelector(`#console${num}`).innerHTML=
    'Level:\t\t'+stats[build][CharacterLevel]+
    '\nAttack:\t\t'+(stats[build][TotalAttack].toFixed(1)||0)+
    //'\nAdditive Damage:\t\t'+AddBonus*AddPercent+
    '\nEle Mastery:\t'+stats[build][EM]
    +'\nMelt/ Vap:\t'+((VapMelt*100).toFixed(1)||0)+'%'
    +'\nCrit Rate:\t'+(stats[build][CritRate]*100).toFixed(1)+'%\nCrit Damage:\t'+((stats[build][CritDamage]-1)*100).toFixed(1)+'%'
    +'\nTarget ELE: \t'+ElementTarget+'\nDMG ELE: '+stats[build][SkillElement]
    +'\nER%:\t\t'+(stats[build][EnergyRecharge]).toFixed(1)+'%\nDMG Bonus:\t'+(stats[build][DmgBonus]*100).toFixed(1)+'%'
    +'\nReaction:\t'+ReactionBonus.toFixed(2)
    +'\nEnemy Level:\t'+EnemyLevel+'\nEnemy DEF:\t'+EnemyDefense.toFixed(2)+'\nResistance:'+ResMultiplier.toFixed(2)
    +'\nBonus Flat\t'+BonusScale
    +'\nSkill Out:\t'+SkillOut.toFixed(1)+"\nDMG Reduce:"+DMGReduction.toFixed(3)
    +'\nDEF Multi:\t'+DefMultiplier.toFixed(3);

    document.querySelector(`#skill${num}`).innerHTML=
    'SKILL DAMAGE\nNon-Crit:\t'+ SkillOut.toFixed(0)
    +'\nCrit Hit:\t\t'+SkillCrit.toFixed(0)
    +'\nAverage:\t\t'+Skillavg.toFixed(0);

    document.querySelector(`#burst${num}`).innerHTML=
    'BURST DAMAGE\nNon-Crit:  \t'+ BurstOut.toFixed(0)
    +'\nCrit Hit:  \t'+BurstCrit.toFixed(0)
    +'\nAverage:  \t'+Burstavg.toFixed(0);

    //DIFFERENCE DISPLAY
    document.querySelector(`#diffS`).innerHTML=
    'Skill DIFF\nNon-Crit:  \t'+ (stats[1][SkillNoCrit]-stats[0][SkillNoCrit]).toFixed(0)
    +'\nCrit DIFF:  \t'+(stats[1][SkillCritHit]-stats[0][SkillCritHit]).toFixed(0)
    +'\nAVG DIFF :  \t'+(stats[1][SkillAverage]-stats[0][SkillAverage]).toFixed(0);
    document.querySelector(`#diffB`).innerHTML=
    'BURST DIFF\nNon-Crit:  \t'+ (stats[1][BurstNoCrit]-stats[0][BurstNoCrit]).toFixed(0)
    +'\nCrit DIFF:  \t'+(stats[1][BurstCritHit]-stats[0][BurstCritHit]).toFixed(0)
    +'\nAVG DIFF :  \t'+(stats[1][BurstAverage]-stats[0][BurstAverage]).toFixed(0);

    // stats[build][SkillNoCrit]=SkillOut;
    // stats[build][SkillCritHit]=SkillCrit;
    // stats[build][SkillAverage]=Skillavg;
    // document.getElementById('console2').style.display='inline-block';
    // document.getElementById('skill2').style.display='inline-block';
    // document.getElementById('burst2').style.display='inline-block';
    
    
    // var elements=document.getElementById("Characters").elements;

    // for (var i = 0, element; element = elements[i++];) {
    //     if (element.type === "text" && element.value === "")
    //         alert("some inputs are empty");
    // }

    //fix it so that each box updates ONLY its corresponding console box

}

function unCheck(checkbox){
    document.getElementById(checkbox).checked=false;
}

function ElementalReaction(build,skill, target, VapMelt){
    if (skill==='Pyro'&&target==='Cryo'){
        stats[build][reaction]="Melt";
        return 2*(1+VapMelt);
    }
    else if(skill==='Cryo'&&target==='Pyro'){
        stats[build][reaction]="Melt";
        return 1.5*(1+VapMelt);
    }
    else if(skill==='Pyro'&&target==='Hydro'){
        stats[build][reaction]="Vaporize";
        return 1.5*(1+VapMelt);
    }
    else if(skill==='Hydro'&&target==='Pyro'){
        stats[build][reaction]="Vaporize";
        return 2*(1+VapMelt);
    }
    else{
        return 1;
    }
    
}

function ResistanceCalc(res){
    if(res>=.75){
        return 1/(4*res+1);
    }
    else if(res>=0){
        return 1-res;
    }
    return 1-(res/2);
}
function ChangeFontColor(Element,cons){
    var fontColor=document.querySelector(`#char${cons}DMG`);
    var ElementText=document.querySelector(`.character${cons}> #DmgELE`);
    if(Element=='Pyro'){
        fontColor.style.color='#fd9a00';
        ElementText.style.color='#fd9a00';
    }
    else if(Element=='Cryo'){
        fontColor.style.color='#9bfdfe';
        ElementText.style.color='#9bfdfe';
    }
    else if(Element=='Hydro'){
        fontColor.style.color='#36cdff';
        ElementText.style.color='#36cdff';
    }
    else if(Element=='Electro'){
        fontColor.style.color='#dd9dfd';
        ElementText.style.color='#dd9dfd';
    }
    else if(Element=='Anemo'){
        fontColor.style.color='#5dffd9';
        ElementText.style.color='#5dffd9';
    }
    else if(Element=='Geo'){
        fontColor.style.color='#ffca64';
        ElementText.style.color='#ffca64';
    }
    else if(Element=='Physical'){
        fontColor.style.color='#ffffff';
        ElementText.style.color='#ffffff';
    }

}

function ChangeEnemyFontColor(Element,cons){
    var ElementText=document.getElementById(cons);
    if(Element=='Pyro'){
        ElementText.style.color='#fd9a00';
    }
    else if(Element=='Cryo'){
        ElementText.style.color='#9bfdfe';
    }
    else if(Element=='Hydro'){
        ElementText.style.color='#36cdff';
    }
    else if(Element=='Electro'){
        ElementText.style.color='#dd9dfd';
    }
    else if(Element=='Anemo'){
        ElementText.style.color='#5dffd9';
    }
    else if(Element=='Geo'){
        ElementText.style.color='#ffca64';
    }
    else if(Element=='None'){
        ElementText.style.color='#ffffff';
    }

}


//big brain stuff here
//sets div image based on what element is selected

function changeBG(ElementName,divId){
    var url=`images/Element_${ElementName}.png`;
    var div= document.getElementById(divId);
    div.style.backgroundImage=`url(${url})`;
    
}
function show(id,divId){
    var div= document.getElementById(divId);
    if(document.getElementById(id).checked){
        div.style.display="contents";
    }
    if(!document.getElementById(id).checked){
        div.style.display="none";
    }
}

function copyOver(from,to){//think it works?
    document.querySelector(`.character${to} > #lv`).value=document.querySelector(`.character${from} > #lv`).value;
    document.querySelector(`.character${to} > #BATK`).value=document.querySelector(`.character${from} > #BATK`).value;
    document.querySelector(`.character${to} > #FATK`).value=document.querySelector(`.character${from} > #FATK`).value;
    document.querySelector(`.character${to} > #EM`).value=document.querySelector(`.character${from} > #EM`).value;
    document.querySelector(`.character${to} > #ER`).value=document.querySelector(`.character${from} > #ER`).value;
    document.querySelector(`.character${to} > #CR`).value=document.querySelector(`.character${from} > #CR`).value;
    document.querySelector(`.character${to} > #CD`).value=document.querySelector(`.character${from} > #CD`).value;
    document.querySelector(`.character${to} > #DMGBonus`).value=document.querySelector(`.character${from} > #DMGBonus`).value;
    var element=document.querySelector(`.character${from} > #DmgELE`).value
    document.querySelector(`.character${to} >#DmgELE`).value=document.querySelector(`.character${from} > #DmgELE`).value;
    changeBG(element,document.querySelector(`#charac${to}`).id);
    ChangeFontColor(element,to);
    document.querySelector(`.character${to} > #SkillScaling`).value=document.querySelector(`.character${from} > #SkillScaling`).value;
    document.querySelector(`.character${to} > #BurstScaling`).value=document.querySelector(`.character${from} > #BurstScaling`).value;
    document.querySelector(`.character${to} > #otherx`).value=document.querySelector(`.character${from} > #otherx`).value;
    document.querySelector(`.character${to} > #otherxS`).value=document.querySelector(`.character${from} > #otherxS`).value;
    document.querySelector(`.character${to} > #otherxB`).value=document.querySelector(`.character${from} > #otherxB`).value;
}

function loadBody() {
    //If detects a change, runs the process file function
    document
      .getElementById("imported")
      .addEventListener("change", processFile, false);
  }
  
  function processFile() {
    try {
      const uploadedFile = document.getElementById("imported").files[0];
      //console.log(uploadedFile);
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(uploadedFile); //Read as string
      fileReader.onloadend = () => {
        //When done reading
        const configArr = fileReader.result.split(",").map((e) => parseFloat(e));
        //console.log(configArr);
        updateHtmlImport(configArr);
      };
    } catch (err) {
      console.log("No file selected!");
    }
  }
  
  function uploadConfig() {
    document.getElementById("imported").click();
  }
  
  function updateHtmlImport(configArr) {
      //update this for 
    CharacterLevel = configArr[0];
    BaseAttack = configArr[1];
    TotalAttack = configArr[2];
    EM = configArr[3];
    EnergyRecharge = configArr[4];
    CritRate = configArr[5];
    CritDamage = configArr[6];
    DmgBonus = configArr[7];
    SkillScaling = configArr[8];
    BurstScaling = configArr[9];
    
    document.getElementById("lv").value = CharacterLevel;
    document.getElementById("BATK").value = BaseAttack;
    document.getElementById("FATK").value = TotalAttack;
    document.getElementById("EM").value = EM;
    document.getElementById("ER").value = EnergyRecharge;
    document.getElementById("CR").value = CritRate;
    document.getElementById("CD").value = CritDamage;
    document.getElementById("DMGBonus").value = DmgBonus;
    document.getElementById("SkillScaling").value = SkillScaling;
    document.getElementById("BurstScaling").value = BurstScaling;
    calculate("character1", 1);
    //console.log("File uploaded!");
  }
