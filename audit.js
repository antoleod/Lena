import { subjects, activities, modules, gradeCatalog } from './src/features/curriculum/catalog.js';
import fs from 'fs';

let report = "=== INVENTORY & AUDIT ===\n\n";

let allActivitiesIds = new Set(activities.map(a => a.id));
let moduleLinkedActivities = new Set();
let moduleIds = new Set(modules.map(m => m.id));

let issues = [];

subjects.forEach(subject => {
  report += `\n**Subject:** ${subject.id} (${subject.name})\n`;
  report += `Description: ${subject.description}\n`;
  
  let subjectModules = modules.filter(m => m.subjectId === subject.id);
  let subjectActivities = activities.filter(a => a.subject === subject.id);
  
  let gradesWithContent = new Set([...subjectModules.map(m => m.gradeId), ...subjectActivities.map(a => a.gradeBand).flat()]);
  report += `Grades found: ${[...gradesWithContent].join(', ')}\n`;
  
  report += `Total Modules: ${subjectModules.length}\n`;
  report += `Total Activities: ${subjectActivities.length}\n\n`;

  gradeCatalog.forEach(grade => {
    let gModules = subjectModules.filter(m => m.gradeId === grade);
    if (gModules.length > 0) {
      report += `  - Grade ${grade} Modules:\n`;
      gModules.forEach(m => {
        report += `    * ${m.id} (${m.title})\n`;
        if (!m.activityIds || m.activityIds.length === 0) {
           issues.push(`Module ${m.id} has NO activities linked.`);
        } else {
           m.activityIds.forEach(id => {
             moduleLinkedActivities.add(id);
             if (!allActivitiesIds.has(id)) {
                issues.push(`Module ${m.id} links to missing activity: ${id}`);
             }
           });
           report += `      Activities: ${m.activityIds.join(', ')}\n`;
        }
      });
    }
  });
  
  // Find orphan activities
  let orphan = subjectActivities.filter(a => !moduleLinkedActivities.has(a.id));
  if (orphan.length > 0) {
    report += `\n  - ORPHAN ACTIVITIES (Not in any module):\n`;
    orphan.forEach(a => {
      report += `      * ${a.id} (${a.title})\n`;
    });
  }
});

report += `\n\n=== ISSUES DETECTED ===\n`;
issues.forEach(iss => report += `- ${iss}\n`);

// Also check generatedActivities vs activities
// Check if they are proper engines.

fs.writeFileSync('audit_report.txt', report);
console.log("Audit report generated: audit_report.txt");
