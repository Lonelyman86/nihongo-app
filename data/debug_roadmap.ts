
const { courses } = require('./content');

console.log('--- DEBUG START ---');
const n5 = courses.find((c: any) => c.level === 'N5');
if (n5) {
    console.log('N5 Unit Count:', n5.unitCount);
    console.log('N5 Chapters:', n5.chapters.length);
    n5.chapters.slice(0, 10).forEach((c: any, idx: number) => {
        console.log(`[${idx}] ID: ${c.id} | Title: ${c.title} | Content: ${c.content.length} items`);
    });
} else {
    console.log('N5 Course Not Found');
}
console.log('--- DEBUG END ---');
