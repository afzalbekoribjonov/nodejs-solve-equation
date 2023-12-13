const { Telegraf } = require('telegraf');

const bot = new Telegraf('bot-token');

bot.start((ctx) => ctx.reply(`Hi ${ctx.message.from.first_name}! Send me an equation to solve \nFormat: a'x' (+,-,*,/) b = 0`));

bot.on('text', (ctx) => {
    const equation = ctx.message.text.replace(/\s/g, '');
    try {
        const { result, steps } = solveEquation(equation);
        ctx.reply(`Solution Steps:\n${steps}\n\nSolution: ${result}\n\nDeveloper: [Github](https://github.com/afzalbekoribjonov)`, { parse_mode: 'Markdown' });
    } catch (error) {
        ctx.reply(`Error solving the equation. ${error.message}`);
    }
});

function solveEquation(equation) {
    const match = equation.match(/^([-+]?\d*)[xX]([-+*/]\d+)\s*=\s*0$/);

    if (!match) {
        throw new Error('Invalid equation format.');
    }

    const a = match[1] ? parseFloat(match[1]) : 1;
    const operation = match[2] ? match[2][0] : '+';
    const b = match[2] ? parseFloat(match[2].substring(1)) : 0;

    let result;

    switch (operation) {
        case '+':
            result = isFinite(-b / a) ? -b / a : 'undefined';
            break;
        case '-':
            result = isFinite((b - a) / a) ? (b - a) / a : 'undefined';
            break;
        case '*':
            result = isFinite(-b / a) ? -b / a : 'undefined';
            break;
        case '/':
            if (a === 0) {
                throw new Error('Invalid equation. Division by zero is not allowed.');
            }
            result = b / a;
            break;
        default:
            throw new Error('Unsupported operation.');
    }

    const steps = [];
    steps.push(`Original equation: ${equation}`);
    steps.push(`Solve for X:`);
    steps.push(`Step 1: ${operation === '+' ? 'Subtract' : (operation === '-' ? 'Add' : 'Divide')} ${b} from both sides`);
    steps.push(`   ${a}X ${operation} ${b} = 0`);
    steps.push(`Step 2: ${operation === '*' ? 'Divide' : 'Multiply'} both sides by ${a}`);
    steps.push(`   X = ${operation === '*' ? -b / a : b / a}`);
    steps.push(`Step 3: Simplify`);

    return { result, steps: steps.join('\n') };
}

bot.launch();