//マップを描くレイヤ
const field = document.getElementById("field");
const fc = field.getContext("2d");

//タワーを描くレイヤ
const layer1 = document.getElementById("layer1");
const lc1 = layer1.getContext("2d");


//敵と弾を描くレイヤ
const layer2 = document.getElementById("layer2");
const lc2 = layer2.getContext("2d");

//攻撃範囲を描くレイヤ
const layer3 = document.getElementById("layer3");
const lc3 = layer3.getContext("2d");


//Level, Wave, Lifeの表示領域
const lwl = document.getElementById("showLWL");
const lwlc = lwl.getContext("2d");

//Towerのリスト表示
const tws = document.getElementById("showTowers");
const twsc = tws.getContext("2d");

const layers = [field, layer1, layer2, layer3, lwl, tws];

let ID = 0;

//6フレーム一単位
let frameUnit = 6;

//fieldのデータセット
//fromTo:スタート、ゴールのみに設定。どこからスタートするか
let fieldDATASET = {
    "00": {},
    "10": {},
    "11": {},
    "12": {},
    "13": {},
    "14": {},
    "15": {},
    "16": {},
    "17": {},
    "18": {},
    "19": {},
    "20": {},
    "60": { fromTo:"bottom" },
    "61": { fromTo:"left" },
    "80": { fromTo:"right" },
    "81": { fromTo:"bottom" }
}


//母クラス
class charactor {
    constructor(x, y, name) {
        this.id = ID;
        ID++;
        this.x = x;
        this.y = y;
        this.name = name;
    }
    get getID() {
        return this.id;
    }
    set setX(x) {
        this.x = x;
    }
    set setY(y) {
        this.y = y;
    }
    get getX() {
        return this.x;
    }
    get getY() {
        return this.y;
    }
    get getName(){
        return this.name;
    }
    //画像の表示
    showImage(lc, size, img) {
        lc.drawImage(img, this.x, this.y, size, size);
    }
}

//towerのデータ
//range:攻撃範囲, damage:与えるダメージ, speed:連射速度
let towerDATASET = {
    test: { range: 1, damage: 1, speed: 1, cost: 100 },
    test2: { range: 2, damage: 2, speed: 2, cost: 200 },
    test3: { range: 3, damage: 3, speed: 3, cost: 300 }
}

class tower extends charactor {
    constructor(x, y, name) {
        super(x, y, name);
        this.range = b * towerDATASET[name]["range"];
        this.damage = towerDATASET[name]["damage"];
        this.speed = frameUnit * 25 / towerDATASET[name]["speed"];
        this.img = towerDATASET[name]["img"];
        this.target = this.Target();
        this.show();
    }

    get getDamage(){
        return this.damage;
    }

    show() {
        super.showImage(lc1, b, this.img);
    }
    //攻撃範囲の表示
    showRange() {
        lc3.beginPath();
        lc3.arc(this.x + b / 2, this.y + b / 2, this.range, 0, 2 * Math.PI);
        lc3.fillStyle = "rgba(255, 178, 0, 0.5)";
        lc3.fill();
    }
    
    //攻撃するEmemyを設定
    Target() {
        //range内にいるEmemyを特定
        for(let i = 0; i < enemies.length; i++){
            let ex = enemies[i].getX;
            let ey = enemies[i].getY;
            let dx1 = ex - (this.x + b / 2);
            let dx2 = (ex + enemies[i].getSize) - (this.x + b / 2);
            let dy1 = ey - (this.y + b / 2);
            let dy2 = (ey + enemies[i].getSize) - (this.y + b / 2);
            let distance = [dx1 ** 2 + dy1 ** 2, dx1 ** 2 + dy2 ** 2, dx2 ** 2 + dy1 ** 2, dx2 ** 2 + dy2 ** 2];
            for (let j = 0; j < distance.length; j++) {
                if (distance[j] <= this.range ** 2) {
                    return enemies[i].getID;
                }
            }
        }
        return this.id;
    }
    
    //攻撃
    attack() {
        if( frame % this.speed != 0 ) return;
        this.target = this.Target();
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].getID === this.target) {
                bullets.push([this.id, enemies[i].id, 0]);
                return;
            }
        }
    }
}

//enemyのデータ。
//size:大きさ, hp:体力, damage:自陣まで到達した時のダメージ, speed:移動速度（0～10）
let enemyDATASET = {
    test: { size: 1, hp: 10, damage: 1, speed: 1, reward: 100 },
    test2: { size: 2, hp: 20, damage: 2, speed: 2, reward: 200 },
    test3: { size: 3, hp: 30, damage: 3, speed: 3, reward: 300 }
}

class enemy extends charactor {
    constructor(x, y, name) {
        super(x, y, name);
        this.size = b / 5 * enemyDATASET[name]["size"];
        this.hp = enemyDATASET[name]["hp"];
        this.damage = enemyDATASET[name]["damage"];
        this.speed = enemyDATASET[name]["speed"] / frameUnit;
        this.route = this.rtnRoute();
        this.direction = [0, 0];
        this.culcDir();
        this.img = enemyDATASET[name]["img"];
        this.show();
    }
    get getHP() {
        return this.hp;
    }
    get getDamage() {
        return this.damage;
    }
    get getSize() {
        return this.size;
    }
    show() {
        super.showImage(lc2, this.size, this.img);
        lc2.fillStyle = "rgba(255, 255, 255, 0.5)";
        lc2.fillRect(this.x, this.y, this.size, -1 * fontHeight);
        lc2.fillStyle = "black";
        lc2.fillText(this.hp, this.x, this.y);
    }
    //移動
    move() {
        this.x += this.direction[0] * this.speed;
        this.y += this.direction[1] * this.speed;
        this.judgeDir();
    }
    //被弾したらHPを減らす
    attacked(damage) {
        this.hp -= damage;
        if(this.hp < 0) this.hp = 0;
    }
    //最短ルートを求める
    rtnRoute() {
        let start = sec(this.x, this.y);
        let dx = [1, 0, -1, 0];
        let dy = [0, -1, 0, 1];
        let close = [start];
        let open = [[start, [start]]];
        let tf = true;
        let i;

        while (tf) {
            let pre = [];
            open.forEach((e) => {
                for (i = 0; i < 4; i++) {
                    let nx = e[0][0] + dx[i];
                    let ny = e[0][1] + dy[i];

                    //field からはみ出さないか
                    if (ny >= fieldDATA.length || ny < 0 || nx >= fieldDATA[0].length || nx < 0) continue;

                    //道、Start、Goalか
                    if (parseInt(fieldDATA[ny][nx]) < 10) continue;

                    //既に到達していないか
                    if (ck([nx, ny], close)) continue;

                    pre.push([[nx, ny], e[1].concat([[nx, ny]])]);
                    close.push([nx, ny]);

                }
            });
            open = pre;
            for (i = 0; i < open.length; i++) {
                if (ck(open[i][0], goals)) {
                    tf = false;
                    break;
                }
            }
        }
        return open[i][1];
    }

    //移動する方向を決定
    culcDir() {
        let i;
        //現在の座標
        let now = sec(this.x, this.y);
        //次の位置を考える
        for (i = 0; i < this.route.length; i++) {
            if (now[0] === this.route[i][0] && now[1] === this.route[i][1]) break;
        }
        if (i + 1 == this.route.length) return;
        let next = this.route[i + 1];
        this.direction = [next[0] - now[0], next[1] - now[1]];
    }

    //方向変換を実施するか判定
    judgeDir() {
        let now = sec(this.x, this.y);
        //現在の区画内での座標
        let npos = [this.x - (now[0] * (b + 1) + 1), this.y - (now[1] * (b + 1) + 1)];
        //区画の左上から右下に引いた対角線上(誤差this.speed)に乗った時に方向転換
        if (Math.abs(npos[0] - npos[1]) > this.speed) return;
        this.culcDir();
    }
}