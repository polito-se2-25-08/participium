TEMPLATE FOR RETROSPECTIVE (Team 08)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done : 9 stories committed vs 9 stories done
- Total points committed vs. done : 38 story points committed vs 38 story points done
- Nr of hours planned vs. spent (as a team) : 95 hours planned vs 82 hours spent

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 22      | -      | 1w3d4h30m  | 1w2d5h50m    |
| _#28_ | 3       | 2      | 3h         | 3h           |
| _#27_ | 2       | 5      | 3h         | 3h15m        |
| _#15_ | 3       | 2      | 3h         | 2h45m        |
| _#30_ | 1       | 5      | 1h30m      | 1h15m        |
| _#10_ | 1       | 2      | 2h      | 2h       |
| _#11_ | 1       | 8      | 1d3h10m    | 1d3h10m      |
| _#12_ | 3       | 3      | 3h50m         | 3h50m           |
| _#13_ | 1       | 3      | 45m         | 1h10m          |
| _#14_ | 4       | 8      | 3h30m         | 2h50m        |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  Number of tasks : 41
  | | Avg | StDev |
  | -------------- | ------ | ------ |
  | **Estimation** | h | h |
  | **Actual** | h | h |
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1
  - sum of total hours estimation : 95
  - sum of total hours spent : 82
  - _Total task estimation error ratio : 99/93 -1 = 0.158

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated 1d3h15m
  - Total hours spent 7h40m
  - Nr of automated unit test cases 388
  - Coverage (if available) 84.6%
- Integration testing: 
  - Total hours estimated 3h
  - Total hours spent 1h45m
- E2E testing:
  - Total hours estimated 1d1h30m
  - Total hours spent 6h35m
- Code review: 
  - Total hours estimated 2h
  - Total hours spent 3h
- Technical Debt management:
  - Strategy adopted: Prioritized Remediation Strategy
  - Total hours estimated estimated at sprint planning 1h
  - Total hours spent 4h
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - During our planning phase we focused on implementing more features underestimating how difficult it would've been and how much time we should've allocated to the technical debt management. This reason and some errors in the merge process made things more complicated and resulted in less stories presented.
  Another problem we faced was a non optimal collaboration which resulted in lateness in the planning stage.

- What lessons did you learn (both positive and negative) in this sprint?
  - Our planning should consider more the technical debt sphere not only for its importance in the production process, but also because underestimating it meant adding more tasks that weren't done because of it. 

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We achieved the goal of splitting more the tasks, but by doing it we committed so much stories instead of focusing on code review and refactoring. We also partially achieved the goal of committing less hours to not excess the hourly budget. Even if we estimated 3 more hours than our budged we spent 3 hour less than it
  
- Which ones you were not able to achieve? Why?
  - We couldn't achieve estimating less hours than our budget because we had to put one more story since we needed more hours. Unfortunately by doing it our estimated budget got exceeded

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two 

  - Manage more short meetings to collaborate better
  - Prioritize code quality

- One thing you are proud of as a Team!!
  - Despite having merging issues we were able to code features for eight stories. Even if they are not considerable done they require a not so exessive work.