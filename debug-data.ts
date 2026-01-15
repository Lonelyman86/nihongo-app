
import { courses } from './data/content';

const n5 = courses.find(c => c.level === 'N5');
console.log('N5 Course Found:', !!n5);
if (n5) {
    console.log('Chapter Count:', n5.chapters.length);
    n5.chapters.forEach(ch => {
        console.log(`Chapter: ${ch.title}`);
        console.log(`  Content Count: ${ch.content.length}`);
        const kinds = ch.content.map(c => c.kind);
        console.log(`  Kinds: ${Array.from(new Set(kinds)).join(', ')}`);
    });
}
