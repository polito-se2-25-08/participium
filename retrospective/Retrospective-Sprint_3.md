TEMPLATE FOR RETROSPECTIVE (Team 08)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done : 11 stories committed vs 3 stories done
- Total points committed vs. done : 54 story points committed vs 22 story points done
- Nr of hours planned vs. spent (as a team) : 99 hours planned vs 93 hours spent

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  | 7       | -      | 3d7h30m    | 4d5h         |
| _#24_ | 5       | 5      | 4h45m      | 4h45m        |
| _#25_ | 4       | 1      | 3h30m      | 4h30m        |
| _#26_ | 6       | 5      | 1d         | 1d           |
| _#27_ | 5       | 8      | 7h30m      | 6h30m        |
| _#10_ | 6       | 3      | 7h30m      | 6h15m        |
| _#11_ | 8       | 5      | 1d2h15m    | 1d2h35m      |
| _#12_ | 5       | 8      | 6h         | 6h           |
| _#13_ | 3       | 5      | 3h         | 2h5m         |
| _#14_ | 5       | 3      | 5h         | 0m           |
| _#15_ | 3       | 2      | 4h         | 3h15m        |
| _#16_ | 5       | 8      | 1d         | 4h10m        |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  Number of tasks : 62
  | | Avg | StDev |
  | -------------- | ------ | ------ |
  | **Estimation** | 1.59 h | 1.94 h |
  | **Actual** | 1.50 h | 2.08 h |
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1
  - sum of total hours estimation : 99
  - sum of total hours spent : 93
  - _Total task estimation error ratio : 99/93 -1 = 0.064

  
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