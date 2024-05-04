import salarydata from '../data/salary.js'
import cron from 'node-cron';

function calculateTaxRate(yearlyPay, taxBrackets, taxRates) {
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

// Schedule generateSalaryBreakdown to run on the 14th and 29th of each month
cron.schedule('0 0 14,29 * *', salarydata.generateSalaryBreakdown);

// Schedule generateSalaryBreakdown to run on the 28th of February
cron.schedule('0 0 28 2 *', salarydata.generateSalaryBreakdown);

export default { calculateTaxRate };