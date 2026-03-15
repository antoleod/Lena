import { subjects, activities, modules, gradeCatalog } from './src/features/curriculum/catalog.js';
import fs from 'fs';

let report = "=== LENA CONTENT AUDIT ===\n\n";

let allActivitiesIds = new Set(activities.map(a => a.id));
let moduleLinkedActivities = new Set();
let issues = [];
let subjectInventories = {};

subjects.forEach(subject => {
  let subRep = `\n### ${subject.label} (${subject.id})\n`;
  subRep += `Description: ${subject.description}\n`;
  
  let subjectModules = modules.filter(m => m.subjectId === subject.id);
  let subjectActivities = activities.filter(a => a.subject === subject.id);
  
  let gradesWithContent = new Set([...subjectModules.map(m => m.gradeId), ...subjectActivities.map(a => a.gradeBand).flat()]);
  subRep += `Grades found: ${[...gradesWithContent].join(', ')}\n`;
  subRep += `Total Modules: ${subjectModules.length}\n`;
  subRep += `Total Activities: ${subjectActivities.length}\n\n`;

  gradeCatalog.forEach(grade => {
    let gModules = subjectModules.filter(m => m.gradeId === grade);
    if (gModules.length > 0) {
      subRep += `  **Grade ${grade} Modules:**\n`;
      gModules.forEach(m => {
        let acts = [];
        if (m.mission && m.mission.levels) {
           acts = m.mission.levels.map(l => l.activityId).filter(Boolean);
        }
        subRep += `    - ${m.title} (${m.id})\n`;
        if (acts.length === 0) {
           issues.push(`🚨 Module ${m.id} has NO activities linked.`);
        } else {
           acts.forEach(id => {
             moduleLinkedActivities.add(id);
             if (!allActivitiesIds.has(id)) {
                issues.push(`🚨 Module ${m.id} links to MISSING activity: ${id}`);
             }
           });
           subRep += `      ↳ Activities: ${acts.join(', ')}\n`;
        }
      });
    }
  });
  
  let orphan = subjectActivities.filter(a => !moduleLinkedActivities.has(a.id));
  if (orphan.length > 0) {
    subRep += `\n  **Orphan / Disconnected Activities:**\n`;
    orphan.forEach(a => {
      subRep += `      - ${a.id} (${a.title})\n`;
    });
  }
  
  subjectInventories[subject.id] = subRep;
});

// Output
Object.values(subjectInventories).forEach(inv => report += inv);
report += `\n\n=== ISSUES DETECTED ===\n`;
issues.forEach(iss => report += iss + '\n');
if (issues.length === 0) report += "No structural issues found.\n";

fs.writeFileSync('audit_report_v2.txt', report);
console.log("V2 report generated: audit_report_v2.txt");
