[![](https://i.postimg.cc/WzXsh0MX/image.png)](https://github.com/wx-chevalier/Backend-Series)

# 持续集成

Here’s an excerpt from [Thoughtworks](https://www.thoughtworks.com/continuous-integration) on what a typical continuous integration flow looks like:

- Developers check out code into their private workspaces
- When done, commit the changes to the repository
- The CI server monitors the repository and checks out changes when they occur
- The CI server builds the system and runs unit and integration tests
- The CI server releases deployable artifacts for testing
- The CI server assigns a build label to the version of the code it just built
- The CI server informs the team of the successful or failed build

![](https://semaphoreci.com/blog/assets/images/2017-07-27/cicd-flow-dde970bb.jpg)

- **Continuous Integration (CI)**: short-lived feature branches, team is merging to master branch multiple times per day, fully automated build and test process which gives feedback within 10 minutes; deployment is manual.
- **Continuous Delivery (CD)**: CI + the entire software release process is automated, it may be composed of multiple stages, and deployment to production is manual.
- **Continuous Deployment**: CI + CD + fully automated deployment to production.
