class ClassSelector {
    constructor() {}
  
    chooseClass(barrels) {
      let parsed = Math.floor(parseFloat(barrels));
      if (parsed == 0) {
        return "bin0"
      } else if (parsed <= 5000) {
        return "bin1";
      } else if (parsed <= 10000) {
        return "bin2";
      } else if (parsed <= 25000) {
        return "bin3";
      } else if (parsed <= 50000) {
        return "bin4";
      } else if (parsed <= 100000) {
        return "bin5";
      } else if (parsed > 100000) {
        return "bin6";
      } else {
        return "no-data";
      }
    }
  }
   