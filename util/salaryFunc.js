
export function calculateTaxRate(yearlyPay, taxBrackets, taxRates) {
    let rate = 0;
  
    for (let i = 0; i < taxBrackets.length; i++) {
      if (yearlyPay > taxBrackets[i]) {
        rate = taxRates[i];
      } else {
        break;
      }
    }
  
    return rate;
  }