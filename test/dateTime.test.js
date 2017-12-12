/* global test, expect, jest */

import DateTime from '../src/dateTime';

let second = 1000;
let minute = 60 * second;
let hour = 60 * minute;
let day = 24 * hour;


const now = new Date(new Date('2017-11-23T10:00:00').toISOString());
Date.now = jest.genMockFunction().mockReturnValue(now);


test('Humanize some dates as unique', () => {
    let now = new Date();

    let humanized = DateTime.humanize(now);
    expect(humanized).toBe("agora");

    humanized = DateTime.humanize(now.getTime() - 30 * minute);
    expect(humanized).toBe("30 minutos");

    humanized = DateTime.humanize(now.getTime() - 3 * hour);
    expect(humanized).toBe("3 horas");

    humanized = DateTime.humanize(now.getTime() - (day + (2 * hour)));
    expect(humanized).toBe("1 dia");

    humanized = DateTime.humanize(now.getTime() - (8 * day));
    expect(humanized).toBe("8 dias");

    humanized = DateTime.humanize(now.getTime() - (40 * day));
    expect(humanized).toBe("40 dias");

    humanized = DateTime.humanize(now.getTime() - (400 * day));
    expect(humanized).toBe("400 dias");
});

test('Humanize some dates as not unique', () => {
    let reallyNow = new Date();

    let humanized = DateTime.humanize(reallyNow);
    expect(humanized).toBe("agora");

    humanized = DateTime.humanize(reallyNow.getTime() - 30 * minute, false);
    expect(humanized).toBe("30 minutos");

    humanized = DateTime.humanize(reallyNow.getTime() - 3 * hour, false);
    expect(humanized).toBe("3 horas");

    humanized = DateTime.humanize(reallyNow.getTime() - (day + (2 * hour)), false);
    expect(humanized).toBe("1 dia, 2 horas");

    humanized = DateTime.humanize(reallyNow.getTime() - (8 * day + (2 * hour) + (20 * minute)), false);
    expect(humanized).toBe("8 dias, 2 horas, 20 minutos");

    humanized = DateTime.humanize(reallyNow.getTime() - (40 * day + (2 * hour) + (20 * minute) + (30 * second)), false);
    expect(humanized).toBe("40 dias, 2 horas, 20 minutos, 30 segundos");

    humanized = DateTime.humanize(reallyNow.getTime() - (400 * day + (2 * hour)), false);
    expect(humanized).toBe("400 dias, 2 horas");
});

test('Relative without hour', () => {

    let relative = DateTime.relative(now);
    expect(relative).toBe("Hoje");

    relative = DateTime.relative(now.getTime() - 2 * hour, false);
    expect(relative).toBe("Hoje");

    relative = DateTime.relative(now.getTime() + 2 * hour, false);
    expect(relative).toBe("Hoje");

    relative = DateTime.relative(now.getTime() - (day), false);
    expect(relative).toBe("Ontem");

    relative = DateTime.relative(now.getTime() + (day), false);
    expect(relative).toBe("Amanhã");

    relative = DateTime.relative(now.getTime() - (8 * day + (2 * hour) + (20 * minute)), false);
    expect(relative).toBe("15/11");

    relative = DateTime.relative(now.getTime() - (40 * day + (2 * hour) + (20 * minute) + (30 * second)), false);
    expect(relative).toBe("14/10");

    relative = DateTime.relative(now.getTime() - (400 * day + (2 * hour)), false);
    expect(relative).toBe("19/10/2016");
});

test('Relative with hour', () => {
    let relative = DateTime.relative(now, true);
    expect(relative).toBe("Hoje às 10:00");

    relative = DateTime.relative(now.getTime() - 2 * hour, true);
    expect(relative).toBe("Hoje às 08:00");

    relative = DateTime.relative(now.getTime() + 2 * hour, true);
    expect(relative).toBe("Hoje às 12:00");

    relative = DateTime.relative(now.getTime() - (day), true);
    expect(relative).toBe("Ontem às 10:00");

    relative = DateTime.relative(now.getTime() + (day), true);
    expect(relative).toBe("Amanhã às 10:00");

    relative = DateTime.relative(now.getTime() - (8 * day + (2 * hour) + (20 * minute)), true);
    expect(relative).toBe("Dia 15 às 07:40");

    relative = DateTime.relative(now.getTime() - (40 * day + (2 * hour) + (20 * minute) + (30 * second)), true);
    expect(relative).toBe("14/10 às 06:39");

    relative = DateTime.relative(now.getTime() - (400 * day + (2 * hour)), true);
    expect(relative).toBe("19/10/2016 às 08:00");
});
