//arrがList内にあるか判定
function ck(arr, List) {
    for (let i = 0; i < List.length; i++) {
        if (arr[0] == List[i][0] && arr[1] == List[i][1]) return true;
    }
    return false;
}

//n以上m以下の乱数を生成
function getRundom(n, m) {
    for (let i = 0; i < 5; i++) {
        let num = Math.floor(Math.random() * (m + 1 - n)) + n;
        return num;
    }
};

//DATASETの完成
function compDATASET(){
    for(let k in towerDATASET){
        towerDATASET[k]["img"] = new Image();
        towerDATASET[k]["img"].src = "img/" + k + ".png";
    }
    for (let k in enemyDATASET) {
        enemyDATASET[k]["img"] = new Image();
        enemyDATASET[k]["img"].src = "img/" + k + ".png";
    }
}

//canvasのサイズとレイヤ指定
function setCVS(w, h) {
    let i = 0;
    let t = 20;
    layers.forEach((e) => {
        e.style.position = "absolute";
        e.style.top = t +"px";
        e.style.left = t + "px";
        e.style.zIndex = i;
        e.setAttribute("width", (b + 1) * w + 1);
        e.setAttribute("height", (b + 1) * h + 1);
        i++;
    });
    //lwl, twsの設定
    lwl.style.left = t + layers[0].width + "px";
    lwl.setAttribute("width", 3 * (b + 1));
    tws.setAttribute("width", (b + 1) * (w + 3) + 1);    

    //font指定
    lc1.font = fontHeight + "px Arial";
    lwlc.font = fontHeight * 2 + "px 'Arial'";
    twsc.font = fontHeight + "px 'Arial'";
}

//fieldDATAに応じたマップの作製
function writeField(data) {
    //canvasの大きさを規定
    setCVS(data[0].length, data.length);
    //ブロック区画の作成
    for (let i = 0; i < data.length + 1; i++) {
        fc.fillStyle = "rgb(100, 100, 100)";
        fc.fillRect(i * (b + 1), 0, 1, field.height);
        fc.fillRect(0, i * (b + 1), field.width, 1);
    }
    //通路等の作成
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (parseInt(data[i][j]) >= 80) {
                goals.push([j, i]);
            } else if (parseInt(data[i][j]) >= 60) {
                starts.push([j, i]); 
            }
            let img = new Image();
            img.src = "img/" + data[i][j] + ".png";
            img.onload = () => {
                fc.drawImage(img, j * (b + 1) + 1, i * (b + 1) + 1, b, b);
            }
        }
    }
    setLWLtws(data);
}

//lwlとtwsの設定
function setLWLtws(data){
    lwlc.fillStyle = "rgb(100, 100, 100)";
    for(let i = 1; i < 4; i++){
        //タテ罫線
        lwlc.fillRect(i * (b + 1) - 1 , 4 * (b + 1), 1, (data.length - 4) * (b + 1) + 1 );
    }
    for(let i = 4; i <= data.length; i++){
        //ヨコ罫線
        lwlc.fillRect(0, i * (b + 1), 3 * (b + 1), 1);
    }
    //Towerのリスト表示
    let c = 0;
    for (let k in towerDATASET){
        let img = new Image();
        img.src = "img/" + k + ".png";
        img.onload = () =>{
            lwlc.drawImage(img, (c % 3) * (b + 1), (data.length - 6 + Math.floor(c / 3)) * (b + 1) + 1, b, b);
            towerList.push([k, data[0].length + c % 3, data.length - 6 + Math.floor(c / 3)]);
            c++;
        }
    }
}

//Text類を書く
function writeText(){
    //Level、Wave、Fundを描く
    lwlc.fillStyle = "rgb(255, 255, 255)";
    lwlc.clearRect(0, 0, 3 * (b + 1), 4 * (b + 1));
    let text = "Level: " + level + " / " + enemyDATA[0];
    lwlc.fillText(text, fontHeight, fontHeight * 2);
    text = "Wave: " + wave + " / " + enemyDATA[level][0];
    lwlc.fillText(text, fontHeight, fontHeight * 4);
    text = "Fund: " + fund;
    lwlc.fillText(text, fontHeight, fontHeight * 6);
    
    //次のWaveへ進行可能な場合は赤色
    if(possibillity) {
        lwlc.fillStyle = "rgb(255, 0, 0)";
    }else{
        lwlc.fillStyle = "rgb(100, 100, 100)";
    }
    //Next Waveボタンの表示
    lwlc.fillRect(fontHeight, fontHeight * 8, b * 3, fontHeight * 2.5);
    lwlc.fillStyle = "rgb(255, 255, 255)";
    text = "Next Wave >>";
    lwlc.fillText(text, fontHeight, fontHeight * 10);

    //lifeの表示
    text = "残りライフ: " + life;
    lwlc.fillText(text, fontHeight, fontHeight * 13);

}

//各ウェーブの設定
function createWave(data){
    changeLW();
    possibillity = false;
    let arr = data[level][wave];
    let count = 0;
    for (let e in arr){
        count += arr[e];
    }
    
    let interval;
    if(count > 100){
        interval = 1 * frameUnit;
    }else if(count > 50){
        interval = 10 * frameUnit;
    }else if(count > 10){
        interval = 20 * frameUnit;
    }else{
        interval = 30 * frameUnit;
    }
    
    let rtn = [interval];
    for (let e in arr) {
        for (let i = 0; i < arr[e]; i++){
            let st = starts[getRundom(0, starts.length - 1)];
            rtn.push([st, e]);
        }
    }
    return rtn;
}

//ウェーブの実行
function runWave(){
    if(waveSet.length <= 1) return;
    if(frame % waveSet[0] != 0) return;
    appearEnemies(waveSet[1][0], waveSet[1][1]);
    waveSet.splice(1, 1);
}

//enemyを出現
function appearEnemies(s, name){
    let field = fieldDATA[s[1]][s[0]]; //スタートする区画の番号
    let sXY = [s[0] * (b + 1) + 1, s[1] * (b + 1) + 1]; //startする区画の右上の位置
    let from;
    switch(fieldDATASET[field]["fromTo"]){
        case "bottom":
            from = [getRundom(sXY[0] + b / 20, sXY[0] + b - b / 20 - b / 5 * enemyDATASET[name]["size"]), sXY[1] + b];
            break;
        case "left":
            from = [sXY[0], getRundom(sXY[1] + b / 20, sXY[1] + b - b / 20 - b / 5 * enemyDATASET[name]["size"])];
            break;
    }  
    enemies.push(new enemy(from[0], from[1], name));
}

//enemyを一斉に動かす
function moveEnemies() {
    if (enemies.length === 0) return;
    for (let i = enemies.length - 1; i >= 0; i--) {
        //Goalに到達したEnemyの処理
        if (enemies[i].getX >= field.width || enemies[i].getX <= 0 || enemies[i].getY >= field.height || enemies[i].getY <= 0) {
            life -= enemies[i].getDamage;
            enemies.splice(i, 1);
            continue;
        }
        //HPが0になったEnemyを削除
        if(enemies[i].getHP <= 0){
            fund += enemyDATASET[enemies[i].getName]["reward"]
            enemies.splice(i, 1);
            continue;
        }
        enemies[i].move();
        enemies[i].show();
    }
}

//Towerが攻撃
function towersAttack(){
    if (towers.length === 0) return;
    towers.forEach ((e) => {
        e.attack();
    })
    writeBullet();
}

//弾を線画
function writeBullet(){
    if (bullets.length === 0) return;
    for (let i = bullets.length - 1; i >= 0; i--) {
        //bulletには[towerのID, enemyのID, count]の形で格納
        let eIndex, tIndex;
        //対象Enemyを探す
        enemies.forEach((e, index) =>{
            if(e.getID == bullets[i][1]) eIndex = index;
        });

        //対象Towerを探す
        towers.forEach((e, index)=>{
            if (e.getID == bullets[i][0]) tIndex = index;
        });
        
        //countが1単位フレーム以上の弾を削除
        if (bullets[i][2] >= frameUnit) {
            if (enemies[eIndex] != undefined) enemies[eIndex].attacked(towers[tIndex].getDamage);
            bullets.splice(i, 1);
            continue;
        }

        let tx = towers[tIndex].getX;
        let ty = towers[tIndex].getY;
        let ex = enemies[eIndex].getX;
        let ey = enemies[eIndex].getY;
        let es = enemies[eIndex].getSize;
        wB2(tx, ty, ex, ey, es, bullets[i][2]);
        bullets[i][2]++;
    }
}

function wB2(x, y, tx, ty, tSize, count) {
    let i = frameUnit;
    
    //Towerの中心
    let c = [x + b / 2, y + b / 2];
    
    //Targetの中心
    let tc = [tx + tSize / 2, ty + tSize / 2];
    
    //Towerの中心からTargetの中心までのベクトル
    let d = [tc[0] - c[0], tc[1] - c[1]];
    
    //ベクトルdの大きさ
    let d_abs = Math.sqrt(d[0] ** 2 + d[1] ** 2);

    lc2.beginPath();
    lc2.moveTo(c[0] + count * d[0] / i, c[1] + count * d[1] / i);
    lc2.lineTo(c[0] + count * d[0] / i + b * (d[0] / d_abs) / 5, c[1] + count * d[1] / i + b * (d[1] / d_abs) / 5);
    lc2.lineWidth = b / 30;
    lc2.strokeStyle = "rgb(255, 255, 0)";
    lc2.stroke();
}

//マウス位置のCanvas上での位置を返す
function pos(e) {
    let x, y;
    x = e.clientX - field.getBoundingClientRect().left;
    y = e.clientY - field.getBoundingClientRect().top;
    return [x, y];
}

//任意の位置のfield上での座標（どの区画にいるか）を返す
function sec(x, y) {
    let Xs, Ys;
    Xs = Math.floor(x / (b + 1));
    Ys = Math.floor(y / (b + 1));
    return [Xs, Ys];
}

//Enemyの情報を表示
layers[layers.length - 1].addEventListener("mousemove", showEnemyData);
function showEnemyData(e) {
    if (mouseIndex != null) return;
    twsc.clearRect(0, 0, tws.width, tws.height);
    if (enemies.length === 0) return;

    //マウス位置
    let p = pos(e);

    //enemyのいないはずの場所なら終了
    if (p[0] > field.width) return;
    
    let i, x, y, size;
    for (i = 0; i < enemies.length; i++) {
        x = enemies[i].getX;
        y = enemies[i].getY;
        size = enemies[i].getSize;

        if (p[0] >= x && p[0] <= x + size && p[1] >= y && p[1] <= y + size) {
            break;
        }
    }

    if (i === enemies.length) return;

    let name = enemies[i].getName;
    
    twsc.fillStyle = "rgb(0, 0, 0)";
    twsc.strokeStyle = "rgb(255, 255, 255)";
    let ulx = x + size / 2 - b;
    let uly = y + size / 2 - b;
    twsc.fillRect(ulx, uly, 1.5 * b, b);
    twsc.lineWidth = 1;
    twsc.strokeRect(ulx, uly, 1.5 * b, b);
    twsc.fillStyle = "rgb(255, 255, 255)";
    
    let text = name;
    twsc.fillText(text, ulx + 1, uly + fontHeight);
    text = `移動速度: ${enemyDATASET[name]["speed"]}`;
    twsc.fillText(text, ulx + 1, uly + fontHeight * 2 + 1);
    text = `ダメージ: ${enemyDATASET[name]["damage"]}`;
    twsc.fillText(text, ulx + 1, uly + fontHeight * 3 + 2);
    text = `撃破報酬: ${enemyDATASET[name]["reward"]}`;
    twsc.fillText(text, ulx + 1, uly + fontHeight * 4 + 3);
}


//Towerの攻撃範囲を表示
layers[layers.length - 1].addEventListener("mousemove", createRange);
function createRange(e) {
    //何かタワーを持っているもしくはTowerがない場合終了
    if(mouseIndex != null) return;
    if (towers.length === 0) return;

    //マウスの位置（座標形式）
    let xy = sec(pos(e)[0], pos(e)[1]);
    
    //field範囲外のとき終了
    if(xy[0] > fieldDATA[0].length) return;

    
    lc3.clearRect(0, 0, layer3.width, layer3.height);
    towers.forEach((t) => {
        let txy = sec(t.getX, t.getY);
        if (xy[0] == txy[0] && xy[1] == txy[1]) {
            t.showRange();
            return;
        }
    });

}

//Towerの情報を表示
layers[layers.length - 1].addEventListener("mousemove", showTowerData);
function showTowerData(e) {
    if(mouseIndex != null) return;
    
    //マウス位置
    let p = pos(e);
    let xy = sec(p[0], p[1]);
    if(p[0] <= field.width) return;

    let i;
    for(i = 0; i < towerList.length; i++){
        if(xy[0] === towerList[i][1] && xy[1] === towerList[i][2]){
            break;
        }
    }
    if(i === towerList.length) return;
    i = towerList[i][0];

    twsc.fillStyle = "rgb(0, 0, 0)";
    twsc.strokeStyle = "rgb(255, 255, 255)";
    let ulx = xy[0] * (b + 1) - b * 0.8;
    let uly = xy[1] * (b + 1) - b;
    twsc.fillRect(ulx, uly, b * 1.7, b * 1.5);
    twsc.lineWidth = 1;
    twsc.strokeRect(ulx, uly, b * 1.7, b * 1.5);
    twsc.fillStyle = "rgb(255, 255, 255)";
    
    let text = i;
    twsc.fillText(text, ulx + 1, uly + fontHeight);
    text = `攻撃範囲: ${towerDATASET[i]["range"]}`;
    twsc.fillText(text, ulx + 1, uly + fontHeight * 2 + 1);
    text = `連射速度: ${towerDATASET[i]["speed"]}`;
    twsc.fillText(text, ulx + 1, uly + fontHeight * 3 + 2);
    text = `与ダメージ: ${towerDATASET[i]["damage"]}`;
    twsc.fillText(text, ulx + 1, uly + fontHeight * 4 + 3);
    text = `コスト: ${towerDATASET[i]["cost"]}`;
    twsc.fillText(text, ulx + 1, uly + fontHeight * 5 + 4);
}

//Towerを生成
layers[layers.length - 1].addEventListener("mousedown", (e)=>{
    //マウス位置の取得
    let xy = sec(pos(e)[0], pos(e)[1]);
    for(let i = 0; i < towerList.length; i++){
        //towerリスト上でクリックされていれば実行
        if (xy[0] === towerList[i][1] && xy[1] === towerList[i][2]){
            mouseIndex = i;
            layers[layers.length - 1].addEventListener("mousemove", moveTower);
            break;
        };
    }
});
layers[layers.length - 1].addEventListener("mouseup", createTower);
//マウスを動かしているとき
function moveTower(e) {
    if (mouseIndex == null) return;
    //mouse位置の取得
    let p = pos(e);
    //mouseのいる座標の取得
    let xy = sec(p[0], p[1]);

    //描画
    twsc.clearRect(0, 0, tws.width, tws.height);
    lc3.clearRect(0, 0, layer3.width, layer3.height);
    twsc.fillStyle = "rgba(0, 0, 0, 0.7)";

    //Towerの画像がもと居たところを隠す
    twsc.fillRect(towerList[mouseIndex][1] * (b + 1) + 1, towerList[mouseIndex][2] * (b + 1) + 1, b, b);
    
    if (xy[0] < fieldDATA[0].length) {
        twsc.fillStyle = "rgba(255, 0, 0, 0.5)";
        if (fieldDATA[xy[1]][xy[0]] == "00"){
            let i = towers.length;
            if (towers.length > 0) {
                for (i = 0; i < towers.length; i++) {
                    let txy = sec(towers[i].getX, towers[i].getY);
                    //既にその位置にTowerがあったとき
                    if (txy[0] == xy[0] && txy[1] == xy[1]) {
                        break;
                    }
                }
            }
            if (i === towers.length) {
                twsc.fillStyle = "rgba(255, 178, 0, 0.5)";
            }
        }
        if(fund < towerDATASET[towerList[mouseIndex][0]]["cost"]) twsc.fillStyle = "rgba(255, 0, 0, 0.5)";
        twsc.fillRect(xy[0] * (b + 1) + 1, xy[1] * (b + 1) + 1, b, b);
        lc3.beginPath();
        lc3.arc(xy[0] * (b + 1) + 1 + b / 2, xy[1] * (b + 1) + 1 + b / 2, towerDATASET[towerList[mouseIndex][0]]["range"] *b, 0, 2 * Math.PI);
        lc3.strokeStyle = "rgb(255, 255, 0)";
        lc3.stroke();
    }
    twsc.drawImage(towerDATASET[towerList[mouseIndex][0]]["img"], p[0] - b / 2, p[1] - b / 2, b, b);    
}
//マウスを離した時
function createTower(e) {
    layers[layers.length - 1].removeEventListener("mousemove", moveTower);
    if (mouseIndex == null) return;
    let index = mouseIndex;
    mouseIndex = null;
    
    //Canvasのクリア
    twsc.clearRect(0, 0, tws.width, tws.height);
    lc3.clearRect(0, 0, layer3.width, layer3.height);
    
    //お金が足りなければ終了
    if(fund < towerDATASET[towerList[index][0]]["cost"]) return;
    
    //マウス位置
    let xy = sec(pos(e)[0], pos(e)[1]);
    if(xy[0] >= fieldDATA[0].length) return;
    
    //置けるかどうか判定
    if(fieldDATA[xy[1]][xy[0]] != "00") return;
    if (towers.length > 0) {
        for (let i = 0; i < towers.length; i++) {
            let txy = sec(towers[i].getX, towers[i].getY);
            //既にその位置にTowerがあったとき
            if (txy[0] == xy[0] && txy[1] == xy[1]) return;
        }
    }
    towers.push(new tower(xy[0] * (b + 1) + 1, xy[1] * (b + 1) + 1, towerList[index][0]));
    fund -= towerDATASET[towerList[index][0]]["cost"];
}
    
