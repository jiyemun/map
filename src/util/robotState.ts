interface RGBA {
    RED: number;
    GREEN: number;
    BLUE: number;
    ALPHA: number;
}

class Off implements RGBA {
    RED = 140;
    GREEN = 140;
    BLUE = 139;
    ALPHA = 1;
}

class Wait implements RGBA {
    RED = 255;
    GREEN = 194;
    BLUE = 0;
    ALPHA = 1;
}

class Charge implements RGBA {
    RED = 128;
    GREEN = 0;
    BLUE = 255;
    ALPHA = 1;
}

class Alarm implements RGBA {
    RED = 255;
    GREEN = 0;
    BLUE = 0;
    ALPHA = 1;
}

class Transfer implements RGBA {
    RED = 3;
    GREEN = 83;
    BLUE = 164;
    ALPHA = 1;
}

class PreRun implements RGBA {
    RED = 0;
    GREEN = 176;
    BLUE = 80;
    ALPHA = 1;
}

class Parking implements RGBA {
    RED = 0;
    GREEN = 176;
    BLUE = 80;
    ALPHA = 1;
}

class Load implements RGBA {
    RED = 0;
    GREEN = 176;
    BLUE = 80;
    ALPHA = 1;
}

const off = new Off();
const wait = new Wait();
const charge = new Charge();
const alarm = new Alarm();
const transfer = new Transfer();
const preRun = new PreRun();
const parking = new Parking();
const load = new Load();

export {off, wait, charge, alarm, transfer, preRun, parking, load};
