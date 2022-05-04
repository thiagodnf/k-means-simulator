class EuclideanDistance {

    getDistance(p, c) {

        let sum = 0.0;

        for (let i = 0; i < p.data.length; i++) {
            sum += Math.pow(p.data[i] - c.data[i], 2);
        }

        return Math.sqrt(sum);
    }
}
