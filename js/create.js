compDATASET_create();
let rtn = [];

//1ブロックの一片の長さ
let b;

//文字サイズ
let fontHeight;

//フィールドのデータ。どの画像を用いるかを規定
let fieldDATA = [];

//enemyの出現データ。
let enemyDATA = [];

//フレーム数を管理
let frame = 0;

//スタート位置とゴール位置、全ルートを格納
let starts = [];
let goals = [];
let routes = [];
let GAMEMODE = 10;

//DATASETの完成
function compDATASET_create() {
    //field画像の取り込み
    for (let k in fieldDATASET) {
        fieldDATASET[k]["img"] = new Image();
        fieldDATASET[k]["img"].src = `../img/${k}.png`;
    }
    //Enemy画像の取り込み
    for (let k in enemyDATASET) {
        enemyDATASET[k]["img"] = new Image();
        enemyDATASET[k]["img"].src = `../img/${k}.png`;
    }
    //TowerとBullet画像の取り込み
    for (let k in towerDATASET) {
        towerDATASET[k]["img"] = new Image();
        towerDATASET[k]["img"].src = `../img/${k}.png`;
        towerDATASET[k]["bullet_img"] = new Image();
        towerDATASET[k]["bullet_img"].src = `../img/${k}_bullet.png`;
    }
}
//fieldDATAに応じたマップの作製
function writeField_create(data) {
    //canvasの大きさを規定
    setCVS(data[0].length, data.length);
    //ブロック区画の作成
    fc.fillStyle = "rgb(100, 100, 100)";
    for (let i = 0; i < data.length + 1; i++) {
        fc.fillRect(0, i * (b + 1), field.width, 1);
    }
    for (let i = 0; i < data[0].length + 1; i++) {
        fc.fillRect(i * (b + 1), 0, 1, field.height);
    }
    //通路等の作成
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (parseInt(data[i][j]) >= 80) {
                goals.push([j, i]);
            } else if (parseInt(data[i][j]) >= 60) {
                starts.push([j, i]);
            }
            fc.drawImage(fieldDATASET[data[i][j]]["img"], j * (b + 1) + 1, i * (b + 1) + 1, b, b);
        }
    }
}


function create(){
    const f = document.forms[0];
    rtn = [parseInt(f["b"].value), parseInt(f["fund"].value), 
        [], 
        [parseInt(f["level"].value)]];
    
    //Stageの初期値
    for (let i = 0; i < f["height"].value; i++){
        let temp = [];
        for (let j = 0; j < f["width"].value; j++){
            temp.push("00");
        }
        rtn[2].push(temp);
    }

    //waveの初期値
    for (let i = 0; i < f["level"].value; i++) {
        let temp = [parseInt(f["wave"].value)];
        for (let j = 0; j < f["wave"].value; j++) {
            temp.push({});
        }
        rtn[3].push(temp);
    }
    console.log(rtn);

    b = rtn[0];
    fieldDATA = rtn[2];
    enemyDATA = rtn[3];
    writeField_create(fieldDATA);
}