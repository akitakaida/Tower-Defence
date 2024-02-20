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

//DATASETの完成
function compDATASET(){
    for (let k in Data) {
        let h = Data[k][2].length;
        let w = Data[k][2][0].length;
        STAGEDATASET[k] = {};
        STAGEDATASET[k]["text"] = `${h} X ${w}`;
        STAGEDATASET[k]["img"] = new Image();
        STAGEDATASET[k]["img"].src = "img/" + k + ".png";
    }
    for (let k in fieldDATASET) {
        fieldDATASET[k]["img"] = new Image();
        fieldDATASET[k]["img"].src = "img/" + k + ".png";
    }
    for(let k in towerDATASET){
        towerDATASET[k]["img"] = new Image();
        towerDATASET[k]["img"].src = "img/" + k + ".png";
        towerDATASET[k]["bullet_img"] = new Image();
        towerDATASET[k]["bullet_img"].src = "img/" + k + "_bullet.png";
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
        e.style.left = t * 2 + "px";
        e.style.zIndex = i;
        e.setAttribute("width", (b + 1) * w + 1);
        e.setAttribute("height", (b + 1) * h + 1);
        i++;
    });
    //lwl, twsの設定 
    lwl.style.left = t * 2 + layers[0].width + "px";
    lwl.setAttribute("width", 3 * (b + 1));
    tws.setAttribute("width", (b + 1) * (w + 3) + 1);    

    //font指定
    lc1.font = fontHeight + "px Arial";
    lc2.font = fontHeight + "px Arial";
    lwlc.font = fontHeight * 2 + "px 'Arial'";
    twsc.font = fontHeight + "px 'Arial'";
}

//fieldDATAに応じたマップの作製
function writeField(data) {
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
    setLWLtws(data);
    culcRoute();
}

//lwlとtwsの設定
function setLWLtws(data){
    lwlc.fillStyle = "rgb(100, 100, 100)";
    for(let i = 1; i < 4; i++){
        //タテ罫線
        lwlc.fillRect(i * (b + 1) - 1 , 4 * (b + 1), 1, (data.length - 3) * (b + 1) + 1 );
    }
    for(let i = 3; i <= data.length; i++){
        //ヨコ罫線
        lwlc.fillRect(0, i * (b + 1), 3 * (b + 1), 1);
    }
    //Towerのリスト表示
    let c = 0;
    for (let k in towerDATASET){
        if(c / 3 + 3 >= data.length) return;
        lwlc.drawImage(towerDATASET[k]["img"], (c % 3) * (b + 1), (3 + Math.floor(c / 3)) * (b + 1) + 1, b, b);
        towerList.push([k, data[0].length + c % 3, 3 + Math.floor(c / 3)]);
        c++;
    }
}

//Text類を書く
function writeText(){
    //Level、Wave、Fundを描く
    lwlc.fillStyle = "rgb(255, 255, 255)";
    lwlc.clearRect(0, 0, 3 * (b + 1), fontHeight * 15);
    let text = stage;
    lwlc.fillText(text, fontHeight, fontHeight * 2);
    text = "Level: " + level + " / " + enemyDATA[0];
    lwlc.fillText(text, fontHeight, fontHeight * 4);
    text = "Wave: " + wave + " / " + enemyDATA[level][0];
    lwlc.fillText(text, fontHeight, fontHeight * 6);
    text = "Fund: " + fund;
    lwlc.fillText(text, fontHeight, fontHeight * 8);

    //次のWaveへ進行可能な場合は赤色
    if(possibillity) {
        lwlc.fillStyle = "rgb(255, 0, 0)";
    }else{
        lwlc.fillStyle = "rgb(100, 100, 100)";
    }
    //Next Waveボタンの表示
    lwlc.fillRect(fontHeight, fontHeight * 9, b * 3, fontHeight * 2.5);
    lwlc.fillStyle = "rgb(255, 255, 255)";
    text = "Next Wave >>";
    lwlc.fillText(text, fontHeight, fontHeight * 11);

    //lifeの表示
    text = "残りライフ: " + life;
    lwlc.fillText(text, fontHeight, fontHeight * 14);

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
    if(count > 50){
        interval = 1 * frameUnit;
    }else if(count > 30){
        interval = 5 * frameUnit;
    }else if(count > 10){
        interval = 10 * frameUnit;
    }else{
        interval = 20 * frameUnit;
    }
    
    let rtn = [];
    for (let e in arr) {
        for (let i = 0; i < arr[e]; i++){
            let rt = routes[getRundom(0, routes.length - 1)];
            rtn.push([e, rt]);
        }
    }
    arrayShuffle(rtn);
    rtn.unshift(interval);
    return rtn;
}

//ウェーブの実行
function runWave(){
    if(waveSet.length <= 1) return;
    if(frame % waveSet[0] != 0) return;
    try{
        appearEnemies(waveSet[1][0], waveSet[1][1]);
    }catch(error){
        console.log(error);
        waveSet.splice(1, 1);
        appearEnemies(waveSet[1][0], waveSet[1][1]);
    }
    waveSet.splice(1, 1);
}

//enemyを出現
function appearEnemies(name, route) {
    let field = fieldDATA[route[0][1]][route[0][0]]; //スタートする区画の番号
    let sXY = [route[0][0] * (b + 1) + 1, route[0][1] * (b + 1) + 1]; //startする区画の右上の位置
    let from;//Enemyの出現位置
    switch (fieldDATASET[field]["fromTo"]) {
        case "bottom":
            from = [getRundom(sXY[0] + b / 20, sXY[0] + b - b / 20 - b / 5 * enemyDATASET[name]["size"]), sXY[1] + b];
            break;
        case "left":
            from = [sXY[0], getRundom(sXY[1] + b / 20, sXY[1] + b - b / 20 - b / 5 * enemyDATASET[name]["size"])];
            break;
        case "top":
            from = [getRundom(sXY[0] + b / 20, sXY[0] + b - b / 20 - b / 5 * enemyDATASET[name]["size"]), sXY[1]];
            break;
        case "right":
            from = [sXY[0] + b, getRundom(sXY[1] + b / 20, sXY[1] + b - b / 20 - b / 5 * enemyDATASET[name]["size"])];
            break;
    }
    enemies.push(new enemy(from[0], from[1], name, route));
}

//routeを計算
function culcRoute(){
    let rtn = [];
    for(let j = 0; j < starts.length; j++){
        let start = starts[j];
        let dx = [1, 0, -1, 0];
        let dy = [0, -1, 0, 1];
        let close = [start];
        let open = [[start, [start]]];
        let tf = true;
        let i;

        while (tf) {
            let pre = [];
            let preClose = [];
            open.forEach((e) => {
                for (i = 0; i < 4; i++) {
                    let nx = e[0][0] + dx[i];
                    let ny = e[0][1] + dy[i];

                    //field からはみ出さないか
                    if (ny >= fieldDATA.length || ny < 0 || nx >= fieldDATA[0].length || nx < 0) continue;

                    //道、Goalか
                    if (parseInt(fieldDATA[ny][nx]) < 10) continue;

                    //スタートに到達していないか
                    if (ck([nx, ny], close)) continue;

                    pre.push([[nx, ny], e[1].concat([[nx, ny]])]);
                    if(!ck([nx, ny], preClose)) preClose.push([nx, ny]);

                }
            });
            open = pre;
            close = close.concat(preClose);
            for (i = 0; i < open.length; i++) {
                if (ck(open[i][0], goals)) {
                    tf = false;
                    rtn.push(open[i][1]);
                }
            }
        }
    }
    routes = rtn;
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
    for (let i = bullets.length - 1; i >= 0; i--){
        let blt = bullets[i];
        if (blt.count >= frameUnit) {
            bullets.splice(i, 1);
            continue;
        }
        blt.move();
        blt.show();
    }
}

//Enemyの情報を表示
layers[layers.length - 1].addEventListener("mousemove", showEnemyData);
function showEnemyData(e) {
    if (GAMEMODE > 3) return;
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

function rtnRange(r){
    return Math.floor(b * Math.sqrt(r) * 1.5);
}

//Towerの攻撃範囲を表示
layers[layers.length - 1].addEventListener("mousemove", createRange);
function createRange(e) {
    if (GAMEMODE > 3) return;
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
    if (GAMEMODE > 3) return;
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
    twsc.fillRect(ulx, uly, b * 1.7, b * 1.6);
    twsc.lineWidth = 1;
    twsc.strokeRect(ulx, uly, b * 1.7, b * 1.6);
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
    text = `レベルアップ: `;
    twsc.fillText(text, ulx + 1, uly + fontHeight * 6 + 5);
    text = towerDATASET[i]["next"];
    for(let j = 0; j < towerList.length; j++){
        if(towerList[j][0] == text){
            twsc.fillStyle = "rgb(255, 255, 0)";
            twsc.fillText(text, ulx + fontHeight, uly + fontHeight * 7 + 6);
            return;
        } 
    }
    text  = "無し";
    twsc.fillText(text, ulx + fontHeight, uly + fontHeight * 7 + 6);
}

//Towerを生成
layers[layers.length - 1].addEventListener("mousedown", (e)=>{
    if (GAMEMODE > 3) return;
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
    if(GAMEMODE > 3) return;
    if (mouseIndex == null) return;
    levelUP = false;
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
                        if(towerDATASET[towers[i].getName]["next"] == towerList[mouseIndex][0]) {
                            levelUP = true;
                            twsc.fillStyle = "rgba(255, 255, 255, 0.5)";
                        }
                        break;
                    }
                }
            }
            if (i === towers.length) {
                twsc.fillStyle = "rgba(255, 178, 0, 0.5)";
            }
        }
        let up = 1;
        if(levelUP) up = 2;
        if(fund < towerDATASET[towerList[mouseIndex][0]]["cost"] / up){
            twsc.fillStyle = "rgba(255, 0, 0, 0.5)";
            levelUP = false;
        }
        twsc.fillRect(xy[0] * (b + 1) + 1, xy[1] * (b + 1) + 1, b, b);
        lc3.beginPath();
        lc3.arc(xy[0] * (b + 1) + 1 + b / 2, xy[1] * (b + 1) + 1 + b / 2, rtnRange(towerDATASET[towerList[mouseIndex][0]]["range"]), 0, 2 * Math.PI);
        lc3.strokeStyle = "rgb(255, 255, 0)";
        lc3.stroke();
    }
    twsc.drawImage(towerDATASET[towerList[mouseIndex][0]]["img"], p[0] - b / 2, p[1] - b / 2, b, b); 
    if(levelUP){
        twsc.fillStyle = "rgba(255, 255, 255, 0.7)";
        twsc.fillRect(xy[0] * (b + 1) + 1, xy[1] * (b + 1) + 1 + b, b, -1 * fontHeight);
        twsc.fillStyle = "rgb(0, 0, 0)";
        twsc.fillText("LEVEL UP", xy[0] * (b + 1) + 1, xy[1] * (b + 1) + 1 + b);
    }   
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
    
    let up = 1;
    if(levelUP) up = 2;
    levelUP = false;

    //お金が足りなければ終了
    if(fund < towerDATASET[towerList[index][0]]["cost"] / up) return;
    
    //マウス位置
    let xy = sec(pos(e)[0], pos(e)[1]);
    if(xy[0] >= fieldDATA[0].length) return;
    
    //置けるかどうか判定
    if(fieldDATA[xy[1]][xy[0]] != "00") return;
    if (towers.length > 0) {
        for (let i = 0; i < towers.length; i++) {
            let txy = sec(towers[i].getX, towers[i].getY);
            //既にその位置にTowerがあったとき
            if (txy[0] == xy[0] && txy[1] == xy[1]) {
                if(up === 2){
                    //タワーのレベルアップ処理
                    towers.splice(i,1);
                }else{
                    return;
                }
            }
        }
    }
    towers.push(new tower(xy[0] * (b + 1) + 1, xy[1] * (b + 1) + 1, towerList[index][0]));
    fund -= towerDATASET[towerList[index][0]]["cost"] / up;
}
    
//Towerを撤去orLevelUp
layers[layers.length - 1].addEventListener("dblclick", breakTower);
function breakTower(e){
    if (GAMEMODE > 3) return;
    //何かタワーを持っているもしくはTowerがない場合終了
    if (mouseIndex != null) return;
    if (towers.length === 0) return;

    //マウスの位置（座標形式）
    let xy = sec(pos(e)[0], pos(e)[1]);

    //field範囲外のとき終了
    if (xy[0] > fieldDATA[0].length) return;
    
    let p = [xy[0] * (b + 1) + 1, xy[1] * (b + 1) + 1]
    for(let i = 0; i < towers.length; i++){
        if(p[0] === towers[i].getX && p[1] === towers[i].getY){
            fund += towerDATASET[towers[i].getName]["cost"] / 2;
            towers.splice(i, 1);
            lc1.clearRect(p[0], p[1], b, b);
            lc3.clearRect(0, 0, layer3.width, layer3.height);
        }
    }
}

//ステージ選択画面に戻る
function back() {
    layers.forEach((e) => {
        let ec = e.getContext("2d");
        ec.clearRect(0, 0, e.width, e.height);
        e.setAttribute("width", 0);
    });
    GAMEMODE = 10;
    main();
}

//GameClearの処理
function GameClear() {
    mouseIndex = null;
    twsc.fillStyle = "rgba(255, 255, 255, 0.4)";
    twsc.fillRect(0, 0, tws.width, tws.height);
    twsc.fillStyle = "rgb(255, 178, 0)";
    twsc.strokeStyle = "rgb(0, 0, 0)";
    twsc.font = fontHeight * 10 + "px 'Arial'";
    twsc.fillText("Clear!", 3 * b, 3 * b);
    twsc.strokeText("Clear!", 3 * b, 3 * b);
}

//GameOverの処理
function GameOver() {
    twsc.fillStyle = "rgba(0, 0, 0, 0.4)";
    twsc.fillRect(0, 0, tws.width, tws.height);
    twsc.fillStyle = "rgb(255, 178, 0)";
    twsc.strokeStyle = "rgb(255, 255, 255)";
    twsc.font = fontHeight * 10 + "px 'Arial'";
    twsc.fillText("GameOver...", 3 * b, 3 * b);
    twsc.strokeText("GameOver...", 3 * b, 3 * b);
}

//Next Wave>> をクリックされたとき
layers[layers.length - 1].addEventListener("click", (e) => {
    if (!possibillity) return;
    let p = pos(e);
    p[0] -= field.width;
    if (p[0] >= fontHeight && p[0] <= fontHeight + b * 3 && p[1] >= fontHeight * 9 && p[1] <= fontHeight * 11.5) GAMEMODE = 2;
});

//level, waveの進行可否を判定
function nextLW() {
    let MaxLevel = enemyDATA[0];
    let MaxWave = enemyDATA[level][0];
    possibillity = false;
    if (wave === MaxWave && level === MaxLevel) {
        if (enemies.length === 0 && waveSet.length === 1) {
            GAMEMODE = 4;
        }
        return;
    }
    if (waveSet.length <= 1) {
        if (wave === MaxWave) {
            if (enemies.length > 0) return;
        }
        possibillity = true;
        return;
    }
}

//level, waveを変更
function changeLW() {
    if (!possibillity) return;
    let MaxWave = enemyDATA[level][0];
    if (wave === MaxWave) {
        level++;
        wave = 1;
    } else {
        wave++;
    }
}

//ステージ選択画面を表示
function showStages() {
    b = 180;
    let cs = [field, layer1];
    let num = 4;
    for (let i = 0; i < cs.length; i++) {
        cs[i].style.position = "absolute";
        cs[i].style.top = "20px";
        cs[i].style.left = "40px";
        cs[i].style.zIndex = i;
        cs[i].setAttribute("width", (b + 1) * num + 1);
        cs[i].setAttribute("height", (b + 1) * num + 1);
    }
    for (let i = 0; i <= num; i++) {
        fc.fillStyle = "rgb(100, 100, 100)";
        fc.fillRect(i * (b + 1), 0, 1, field.height);
        fc.fillRect(0, i * (b + 1), field.width, 1);
    }
    fc.font = "40px 'Arial'"
    fc.fillStyle = "rgb(255, 0, 0)";
    fc.strokeStyle = "rgb(255, 255, 255)"

    let c = 0;
    for (let k in STAGEDATASET){
        let li = STAGEDATASET[k];
        fc.drawImage(li["img"], (c % num) * (b + 1) + 1, Math.floor(c / num) * (b + 1) + 1, b, b);
        let w = fc.measureText(k).width;
        fc.fillText(k, (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b / 5 + 1);
        fc.strokeText(k, (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b / 5 + 1);
        w = fc.measureText(li["text"]).width;
        fc.fillText(li["text"], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b);
        fc.strokeText(li["text"], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b);
        STAGEDATASET[k]["x"] = c % num;
        STAGEDATASET[k]["y"] = Math.floor(c / num);
        c++
    }
    //なんかステージ表示が上手くいかないので一旦放置。戻るを押したら表示される
    /*STAGEDATASET.forEach((e) => {
        let img = new Image();
        img.src = "img/" + e[0] + ".png";
        img.onload = () => {
            fc.fillStyle = "rgb(255, 0, 0)";
            fc.strokeStyle = "rgb(255, 255, 255)"
            fc.drawImage(img, (c % num) * (b + 1) + 1, Math.floor(c / num) * (b + 1) + 1, b, b);
            let w = fc.measureText(e[0]).width;
            fc.fillText(e[0], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b / 5 + 1);
            fc.strokeText(e[0], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b / 5 + 1);
            w = fc.measureText(e[1]).width;
            fc.fillText(e[1], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b);
            fc.strokeText(e[1], (c % num) * (b + 1) + 1 + b / 2 - w / 2, Math.floor(c / num) * (b + 1) + b);
            e.push(c % num, Math.floor(c / num));
            c++;
        }
    });*/
    layer1.addEventListener("mousemove", selectStage);
    layer1.addEventListener("click", goStage);
}
//マウスのある位置を表示
function selectStage(e) {
    lc1.clearRect(0, 0, layer1.width, layer1.height);
    let p = pos(e);
    let s = sec(p[0], p[1]);
    if (s[0] + s[1] * 4 >= STAGEDATASET.length) return;
    lc1.fillStyle = "rgba(255, 255, 255, 0.5)";
    lc1.fillRect(s[0] * (b + 1) + 1, s[1] * (b + 1) + 1, b, b);
}
//Stage選択
function goStage(e) {
    stage = undefined;

    let p = pos(e);
    let s = sec(p[0], p[1]);
    for (let k in STAGEDATASET) {
        if (s[0] === STAGEDATASET[k]["x"] && s[1] === STAGEDATASET[k]["y"]) {
            stage = k;
            break;
        }
    }
    if (stage == undefined) return;


    layer1.removeEventListener("mousemove", selectStage);
    lc1.fillStyle = "rgba(255, 255, 0, 0)";
    let count = 0;
    
    function rect() {
        count++;
        lc1.clearRect(0, 0, layer1.width, layer1.height);
        lc1.fillStyle = "rgba(255, 255, 0," + count * 0.02 + ")";
        lc1.fillRect(s[0] * (b + 1) + 1, s[1] * (b + 1) + 1, b, b);
        if (count > 25) {
            lc1.fillStyle = "rgba(0, 0, 0," + (count - 25) * 0.04 + ")";
            lc1.fillRect(0, 0, field.width, field.height);
        }
        if (count < 50) {
            requestAnimationFrame(rect);
        } else {
            lc1.clearRect(0, 0, layer1.width, layer1.height);
            fc.clearRect(0, 0, field.width, field.height);
            GAMEMODE = 0
            main();
        }
    }
    rect();
    layer1.removeEventListener("click", goStage);
}

