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
| _Uncategorized_                                                | 9       | 0      |   1w2d  |     1w1d7h40m      |
| Admin assign roles                                         | 7       | 2      | 1d         |      7h30m   |
| Officer want to approve or reject reports                      | 4       | 3      | 7h         |     7h       |
| Citizens want to see approved reports on map (with zoom clusters)        | 4       | 8      | 1d4h      |  1d2h           |
| Technician want to see an overview of reports assigned to him                 | 4       |   3   | 4h    |    4h     |
| Citizen account configuration                         | 3      | 3      | 6h         |      6h   |
| Technical office staff member want to receive assigned reports                   | 5       | 3      | 6h45m      |    6h        |
| Report status update                   | 5       | 5      | 7h30m      |   1d10m         |



> story `Uncategorized` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
## Hours per task (average & standard deviation)

|            | Mean | StDev|
|------------|----------------|----------------|
| **Estimation** | 3.28h | 6.00h |
| **Actual**     | 1.82h | 3.54h |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$ = -0.43384 
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$ = 0.49359

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated = 9h
  - Total hours spent = 7h40m
  - Nr of automated unit test cases = 288
  - Coverage = 98.94%
- Integration Testing:
  - Total hours estimated = 7h30m
  - Total hours spent = 6h10m
  - Nr of test cases = 45
- Code review 
  - Total hours estimated = 5h
  - Total hours spent = 7h
  


##  ASSESSMENT
- What did go wrong in the sprint?
    - We completed story 7 but didn't implement image visualisation in map, which made the implementation not completely compliant with the requirements given by the product owner

- What caused your errors in estimation (if any)?-
    - We have a pretty good global estimation, but in some local cases the task required a different amount of time compared the estimation. This was caused by a more broad way of viewing the tasks, separating the task in smaller tasks might be a useful approach.

- What lessons did you learn (both positive and negative) in this sprint?
    - We learned that we work more effectively if we focus on less stories, and we learned that we should read details of  the stories more carefully, to make sure to not skip any part.

- Which improvement goals set in the previous retrospective were you able to achieve? 
    - We didn't skip stories. We made a lot of tests and had an high coverage. We had a better estimation

- Which ones you were not able to achieve? Why?
    - We actually think we achieved all the goals from the last retrospective.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  > Propose one or two
    - Try to add more stories if we think we can manage to do it. Add even more testing.

- One thing you are proud of as a Team!!
  - We fixed all the problems we had in the last sprint, so we had a really large improvement
 
