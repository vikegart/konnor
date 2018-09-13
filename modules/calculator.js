const VALID = /^([^0-9.\+\-\/\*=]*([0-9]*[.]?[0-9])[^0-9.\+\-\/\*=]*[\+\-\*\/]*)*(([0-9]*[.]?[0-9])+[^0-9.\+\-\/\*=]*=[^0-9\+\-\/\*=]*)$/;
const REG_NUMBER = /[0-9]*[.]?[0-9]/g;
const REG_MATH = /[\+\-\*\/]/g;

const calculate = (originalString) => {
    return new Promise((resolve, reject) => {
        const clearString = originalString.trim().replace(/\s/g, '');
        console.log(clearString);
        if (!VALID.test(clearString)) {
            reject('может знака равно не хватает? ты то сможешь это посчитать?');
        }

        const numbers = clearString.match(REG_NUMBER);
        const maths = clearString.match(REG_MATH);

        if (maths && ((numbers.length - maths.length) !== 1)) {
            reject('мало цифр');
        }

        let result = Number(numbers[0]);
        for (let i = 1; i < numbers.length; i++) {
            switch (maths[i - 1]) {
                case '+':
                    result += Number(numbers[i]);
                    break;

                case '-':
                    result -= Number(numbers[i]);
                    break;

                case '*':
                    result *= Number(numbers[i]);
                    break;

                case '/':
                    result /= Number(numbers[i]);
                    break;
            }
        }
        resolve(result.toFixed(2));
    })
}

module.exports = calculate;