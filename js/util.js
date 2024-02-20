/*--------------------良く使う関数--------------------*/

//弧度法にして返す
function rad(degree) {
    return degree * Math.PI / 180;
}

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

//配列のランダム並び替え
function arrayShuffle(array) {
    for (let i = (array.length - 1); 0 < i; i--) {

        // 0〜(i+1)の範囲で値を取得
        let r = getRundom(0, i + 1);

        // 要素の並び替えを実行
        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
    }
    return array;
}

//sine
function sin(radian){
    return Math.sin(radian);
}

//cosine
function cos(radian){
    return Math.cos(radian);
}

//tangent
function tan(radian){
    return Math.tan(radian);
}

//ベクトル
class Vecter {
    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    //成分を返す
    comp() {
        let component = [this.x, this.y, this.z];
        return component;
    }

    //長さ
    len() {
        let len = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        return len;
    }

    //足し算
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
    }

    //実数倍(引数なしで使うと逆ベクトル)
    times(real = -1) {
        this.x *= real;
        this.y *= real;
        this.z *= real;
    }

    //内積
    dot(vec) {
        let dotProduct = this.x * vec.x + this.y * vec.y + this.z * vec.z;
        return dotProduct;
    }

    //外積
    cross(vec) {
        let rtn = new Vecter(
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x
        );
        return rtn;
    }

    //回転
    spin(psy, theta = 0, phi = 0) {
        //z軸周りの回転行列
        const Rz = [
            [cos(psy), -sin(psy), 0],
            [sin(psy), cos(psy), 0],
            [0, 0, 1]
        ]

        //y軸周りの回転行列
        const Ry = [
            [cos(theta), 0, sin(theta)],
            [0, 1, 0],
            [-sin(theta), 0, cos(theta)]
        ]

        //x軸周りの回転行列
        const Rx = [
            [1, 0, 0],
            [0, cos(phi), -sin(phi)],
            [0, sin(phi), cos(phi)]
        ]

        //回転 e' = Rz Ry Rx eなのでRxから順番に掛ける
        const Rs = [Rx, Ry, Rz];
        let temp = this.comp();
        Rs.forEach((R) => {
            let next = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    next[i] += R[i][j] * temp[j];
                }
            }
            temp = next;
        });

        this.x = temp[0];
        this.y = temp[1];
        this.z = temp[2];
    }
}

//点
class Point{
    constructor(x, y, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

//線分
class LineSegment{
    constructor(Point1, Point2){
        this.p1 = Point1;
        this.p2 = Point2;
    }
}

//直線(2次元のみ対応)
class Line{
    constructor(Point1, Point2){
        this.a = (Point2.y - Point1.y) / (Point2.x - Point1.x);
        this.b = Point1.y - this.a * Point1.x;
    }
}

//2点間の距離
function culcLen(Point1, Point2){
    let v = new Vecter(Point2.x - Point1.x, Point2.y - Point1.y, Point2.z - Point1.z);
    return v.len();
}

//線分同士が交わっているかの判定(2次元のみ対応してる)
function JudgeLineSegment(ls1, ls2){
    //ls1の端点ab
    let a = ls1.p1;
    let b = ls1.p2;

    //ls2の端点cd
    let c = ls2.p1;
    let d = ls2.p2;

    //外積によって判定。ABxACとABxAD, CDxCAとCDxCBがそれぞれ逆向いてればいい。
    //https://yttm-work.jp/collision/collision_0011.html
    let s = 0, t = 0;
    let AB = new Vecter(b.x - a.x, b.y - a.y);
    let AC = new Vecter(c.x - a.x, c.y - a.y);
    let AD = new Vecter(d.x - a.x, d.y - a.y);
    s = AB.cross(AC);
    t = AB.cross(AD);
    if(s.z * t.z > 0) return false;

    let CD = new Vecter(d.x - c.x, d.y - c.y);
    let CA = new Vecter(a.x - c.x, a.y - c.y);
    let CB = new Vecter(b.x - c.x, b.y - c.y);
    s = CD.cross(CA);
    t = CD.cross(CB);
    if(s.z * t.z > 0) return false;
    
    return true;
}

//線分同士が交わるときに、その交点を返す。（2次元のみ対応）
function rtnJudgeLineSegment(ls1, ls2){
    //直線AB,CD
    let ab = new Line(ls1.p1, ls1.p2);
    let cd = new Line(ls2.p1, ls2.p2);
    if (ab.a === cd.a) {
    return ls1.p1;
    }
    let x = -(ab.b - cd.b) / (ab.a - cd.a);
    let y = x * ab.a + ab.b;
    return new Point(x, y);
}

//色を変える
function changeColor() {
    let c = "#";
    for (let i = 0; i < 6; i++) {
        let n = getRundom(0, 15)
        c += n.toString(16);
    }
    return c;
}
