const colors = ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'];

class Point {

    constructor(clusterId, data) {

        this.data = data;
        this.clusterId = clusterId;
    }

    get x() {
        return this.data[0];
    }

    get y() {
        return this.data[1];
    }

    get z() {
        return this.data[2];
    }

    getColor() {

        if (this.clusterId === -1) {
            return "gray";
        }

        return colors[this.clusterId];
    }

    copy(){
        return new Point(this.clusterId, this.data);
    }

    /**
     * @param {Array} p1 point 1
     * @param {Array} p2 point 2
     * @returns True if two given arrays are equals, False, otherwise
     */
     isEqual(p2) {

        console.log(p2)

        if (this.data.length !== p2.data.length) {

            return false;
        }

        for (let i = 0; i < this.length; i++) {

            if (this.data[i] !== p2.data[i]) {
                return false;
            }
        }

        return true;
    }
}
