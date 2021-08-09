function calculate(){
    // alert("Character level is: "+document.getElementById("BATK").value);
    // all variables needed for calculation
//front stats
    var CharacterLevel= parseFloat(document.getElementById("lv").value);//character level
    var BaseAttack= parseInt(document.getElementById("BATK").value);//base attack for bonuses
    var TotalAttack= parseFloat(document.getElementById("FATK").value);//total attack

    
//crit
    var CritRate=parseFloat(document.getElementById("CR").value)*.01;
    var CritDamage=parseFloat(document.getElementById("CD").value)*.01+1;


//dmg bonuses
var DmgBonus=parseFloat(document.getElementById("DMGBonus").value)*.01;//damage bonus
var DmgScaling=parseFloat(document.getElementById("Scaling").value)/100;//damage scaling

// problem here^^
//identified problem: melt undercalculates dmg, needs boost
    
//enemy stats
    var EnemyLevel=parseFloat(document.getElementById("eLv").value);
    var EnemyDefense=5*EnemyLevel+500;
    var Resistance= parseFloat(document.getElementById("resist").value)*.01;
    
    
    // var Btest=parseFloat(document.getElementById("Btest").value);
    // var Atest=parseFloat(document.getElementById("Atest").value);
    var DMGReduction=EnemyDefense/(EnemyDefense+(5*CharacterLevel)+500);
    var DefMultiplier=1-DMGReduction;

    //enemy Defense
    var ResShred=parseFloat(document.getElementById("resShred").value)*.01;//count resistance shred like 4pc VV
    
    if(document.getElementById('4VV').checked){
        ResShred+=.4
    }
    var ResPercent=Resistance-ResShred;//final resistance
    var ResMultiplier= ResistanceCalc(ResPercent);//get actual multiplier
    var OtherBoosts=parseFloat(document.getElementById("other").value)*.01;//adding other boosts ex: from constellations
    
    //elemental reaction 
    var SkillElement=document.getElementById("DmgELE").value;//element of the skill
    var ElementTarget=document.getElementById("AELE").value;//element on target

    //background change
    var bg=document.getElementById('charac').style.backgroundColor="ffffff";






    var EM= parseFloat(document.getElementById("EM").value);//Elemental Mastery
    var VapMelt=0;
    if(document.getElementById("4witch").checked){
        VapMelt+=.15;
    }
    //sucrose em buff
    if(document.getElementById('Sucrose').checked){
        if(document.getElementById('MollisFavonius').checked){
            EM+=.2*parseFloat(document.getElementById('SucroseEM').value);
        }
        if(document.getElementById('CatalystConversion').checked){
            EM+=50;
        }
    }
    //final em calculation
    VapMelt+= parseFloat((2.78*EM)/(EM+1400));//Melt/ Vaporize bonus
    var ReactionBonus=ElementalReaction(SkillElement,ElementTarget,VapMelt);


    //character buffs
    var bennetBase=parseFloat(document.getElementById('bennetBase').value);
    var bennetBonus=parseFloat(document.getElementById('%bonus').value)*.01;
    if(document.getElementById('bennet').checked){
        TotalAttack+=bennetBase*bennetBonus;
    }
    if(document.getElementById('noblesse').checked){
        DmgBonus+=.2;
    }
    if(document.getElementById('4noblesse').checked){
        TotalAttack+=.2*BaseAttack;
    }
    
    //something might be wrong with geoResonance, test it.
    if(document.getElementById('geoRes').checked){
        DmgBonus+=.15;
    }

    if(document.getElementById('thrillingTales').checked){
        TotalAttack+=.48*BaseAttack;
    }
    if(document.getElementById('omenDebuff').checked){
        DmgBonus+=parseFloat(document.getElementById('omen%').value)*.01;
    }

//final calculation
    
    DmgBonus+=OtherBoosts;
//bug w/ other dmg bonuses, hutao w/ 0 is good
// diluc w/ 15% is .18% off
//chongyun w/ 60% is 9.6%
//found out why: noblesse is meant to be in dmg bonus, not dmg scaling
    var OutgoingDamage=TotalAttack*DmgScaling*(1+DmgBonus);
    var IncomingDmg= OutgoingDamage*DefMultiplier*ResMultiplier*ReactionBonus;
    var IncomingCrit=IncomingDmg*CritDamage;

    // document.getElementById("output").textContent='non-crit hit:\t'
    // + IncomingDmg.toFixed(0)
    // +'\nCrit Hit:\t'+IncomingCrit.toFixed(0);


    //detailed console calculation
    document.getElementById("console").textContent=
    'Character level:\t\t'+CharacterLevel+
    '\nAttack:\t\t\t\t'+TotalAttack+'\nElemental Mastery:\t\t'+EM
    +'\nMelt/ Vaporize Bonus:\t'+(VapMelt*100).toFixed(1)+'%'
    +'\nCrit Rate:\t\t\t'+(CritRate*100).toFixed(1)+'%\nCrit Damage:\t\t\t'+((CritDamage-1)*100).toFixed(1)+'%'
    +'\nTarget is affected by: \t'+ElementTarget+'\nDamage Element is: \t'+SkillElement
    +'\nDamage Scaling:\t\t'+(DmgScaling*100).toFixed(1)+'%\nDamage Bonus:\t\t'+(DmgBonus*100).toFixed(1)+'%'
    +'\nReactionBonus:\t\t'+ReactionBonus.toFixed(2)
    +'\nEnemy Level:\t\t\t'+EnemyLevel+'\nEnemy Defense:\t\t'+EnemyDefense.toFixed(1)+'\nResistance Multiplier:\t'+ResMultiplier.toFixed(1)
    +'\nOutgoing Damage:\t\t'+OutgoingDamage.toFixed(1)+"\nDMG Reduction:\t\t"+DMGReduction
    +'\nDEF Multiplier:\t\t'+DefMultiplier;
    document.getElementById("dmgout").textContent=
    'non-crit hit:\t'+ IncomingDmg.toFixed(0)
    +'\nCrit Hit:\t\t'+IncomingCrit.toFixed(0);

    
    
    // var elements=document.getElementById("Characters").elements;

    // for (var i = 0, element; element = elements[i++];) {
    //     if (element.type === "text" && element.value === "")
    //         alert("some inputs are empty");
    // }
}

function ElementalReaction(skill, target, VapMelt){
    if (skill==='Pyro'&&target==='Cryo'){
        return 2*(1+VapMelt);
    }
    else if(skill==='Cryo'&&target==='Pyro'){
        return 1.5*(1+VapMelt);
    }
    else if(skill==='Pyro'&&target==='Hydro'){
        return 1.5*(1+VapMelt);
    }
    else if(skill==='Hydro'&&target==='Pyro'){
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

//big brain stuff here
//sets div image based on what element is selected
function changeBG(ElementName,divId){
    var url="images/Element_"+ElementName+".png";
    var div= document.getElementById(divId);
    div.style.backgroundImage=`url(${url})`;
}