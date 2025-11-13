TEMPLATE FOR RETROSPECTIVE (Team 08)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 
- Total points committed vs. done 
- Nr of hours planned vs. spent (as a team)

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story                                                          | # Tasks | Points | Hours est. | Hours actual |
|----------------------------------------------------------------|---------|--------|------------|--------------|
| _Uncategorized_                                                | 9       | 0      | 1w3d5h30m  | 4d5h         |
| Register A New Citizen                                         | 6       | 3      | 8h         | 8h20m        |
| Admin setting up users                                         | 5       | 3      | 7h         | 4h           |
| Admin assign roles                                             | 6       | 2      | 6h30m      | 0            |
| Citizen want to select location on the map                     | 7       | 13     | 10h30m     | 4h55m        |
| Citizen want to fill the report form                           | 6       | 3      | 6h         | 5h30m        |
| Officer want to approve or reject reports                      | 6       | 3      | 6h30m      | 3h           |
| Citizens want to see approved reports on map                   | 4       | 8      | 6h30m      | 2h           |
| Technician want to see an overview of reports assigned to him  | 5       | 3      | 6h         | 1h45m        |



> story `Uncategorized` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean  | StDev |
|------------|-------|-------|
| Estimation | 4.17h | 8.17h |
| Actual     | 1.82h | 3.34h |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$ = -0.5686
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$ = 0.5126
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated = 11h
  - Total hours spent = 1h10m
  - Nr of automated unit test cases = 24
  - Coverage = 15%
- E2E testing:
  - Total hours estimated
  - Total hours spent
  - Nr of test cases
- Code review 
  - Total hours estimated 
  - Total hours spent
  


## ASSESSMENT

- What did go wrong in the sprint?
  - We failed to complete story number 3 even if it we completed 4 and 5. We have had some misalignments on the code so the UI was not totally coherent.  We also weren't able to focus much on testing. These problems were caused by the fact that we wanted to complete several stories and also that some of them had some dependencies.

- What caused your errors in estimation (if any)?
  - The amount of work required for the setup and for coordination.

- What lessons did you learn (both positive and negative) in this sprint?
  - We can put our focus on less stories if needed, and try to have a stricter collaboration.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We defined a productive working strategy, and divided the task basing on team members knowledge gap.

- Which ones you were not able to achieve? Why?
  - Comunication was not totally perfect. Could be because the team is still at one of the first sprints so it has improvement margin.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two
  - Team coordination is the number 1 priority, and second one is focusing on quality.

- One thing you are proud of as a Team!!
  - We got compliments from stakeholders for the quality of our work.