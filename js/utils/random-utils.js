class RandomUtils {

    static chance = new Chance();

    static seed = new Date().getTime()

    static setSeed(seed) {

        RandomUtils.seed = seed;

        RandomUtils.chance = new Chance(RandomUtils.seed);
    }

    static nextInt(min, max) {
        return RandomUtils.chance.integer({ min: min, max: max })
    }

    static nextFloat(min, max, fixed = 15) {
        return RandomUtils.chance.floating({ min: min, max: max, fixed: fixed });
    }

    static nextPoint(chart) {

        let range = chart.getAxisRange();

        let x = RandomUtils.nextInt(range.x[0], range.x[1]);
        let y = RandomUtils.nextInt(range.y[0], range.y[1]);

        return [x, y];
    }
}
